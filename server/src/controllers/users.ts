import { Request, Response } from 'express';
import User, { userMapper } from '../models/User.js';

/* Read */
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    res.status(200).json(userMapper(user));
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    const friends = await Promise.all(
      user.friends.map((id) => {
        return User.findById(id);
      })
    );

    if (!friends) {
      return res.status(404).json({ message: 'User has no friends' });
    }
    const mappedFriends = friends.map((friend) => {
      if (friend) {
        return {
          _id: friend._id,
          firstName: friend.firstName,
          lastName: friend.lastName,
          picturePath: friend.picturePath,
          location: friend.location,
          occupation: friend.occupation
        };
      }
    });
    res.status(200).json(mappedFriends);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

/* Update */
export const addRemoveFriend = async (req: Request, res: Response) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!friend) {
      return res.status(404).json({ message: 'Friend user not found' });
    }

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id: string) => id !== friendId);
      friend.friends = friend.friends.filter((id: string) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();
    const friends = await Promise.all(
      user.friends.map((id) => {
        return User.findById(id);
      })
    );

    const mappedFriends = friends.map((friend) => {
      if (friend) {
        return {
          _id: friend._id,
          firstName: friend.firstName,
          lastName: friend.lastName,
          picturePath: friend.picturePath,
          location: friend.location,
          occupation: friend.occupation
        };
      }
    });
    res.status(200).json(mappedFriends);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
