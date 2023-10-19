import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import {
  checkRequestBodyKeys,
  envValues,
  missingKeysError,
  serverError,
} from '../utils/general.utils';

const {JWT_SECRET} = envValues;

export const register = async (req: Request, res: Response) => {
  const missingKeys = checkRequestBodyKeys(req.body, [
    'username',
    'email',
    'password',
  ]);

  if (missingKeys.length) return missingKeysError(res, missingKeys);

  const {username, email, password} = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{email: email}, {username: username}],
    });
    if (existingUser) {
      return res.status(400).json({message: 'User already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(204).json();
  } catch (error) {
    return serverError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  const missingKeys = checkRequestBodyKeys(req.body, ['username', 'password']);

  if (missingKeys.length) return missingKeysError(res, missingKeys);

  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user) {
      return res.status(401).json({message: 'Invalid username or password'});
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({message: 'Invalid username or password'});
    }

    const token = jwt.sign({userId: user._id}, JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({Token: token});
  } catch (error) {
    return serverError(res, error);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const missingKeys = checkRequestBodyKeys(req.body, [
    'username',
    'old_password',
    'new_password',
  ]);
  if (missingKeys.length) return missingKeysError(res, missingKeys);
  const {old_password, new_password, username} = req.body;

  try {
    const user = await User.findOne({username});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const passwordMatch = await bcrypt.compare(old_password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({message: 'Invalid password'});
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({message: 'Password changed successfully'});
  } catch (error) {
    return serverError(res, error);
  }
};
