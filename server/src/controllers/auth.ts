import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { userMapper } from '../models/User.js';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { config } from '../config/config.js';

/* REGISTER USER */
export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000)
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* LOG IN USER */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: 'User does not exist' });

    const matchCred = await bcrypt.compare(password, user.password);
    if (!matchCred) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, config.jwt.secret as string);
    res.status(200).json({ token, user: userMapper(user) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
