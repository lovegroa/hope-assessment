import {Request, Response} from 'express';
import User from '../models/user.model';
import {serverError} from '../utils/general.utils';

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!('userId' in req)) {
      return serverError(res);
    }

    const {userId} = req;

    if (typeof userId !== 'string') {
      return serverError(res);
    }

    const user = await User.findById(userId, 'username email');
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    return res.status(200).json(user);
  } catch (error) {
    return serverError(res, error);
  }
};
