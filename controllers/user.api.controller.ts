import { Request, Response } from 'express';
import { hashPasswordWithBcrypt, signJWT } from '../helpers';
import { UpdateUser, UserData } from '../interfaces';
import { UserModel } from '../models';

/**
 * Login User without Google
 * @param req
 * @param res
 *
 */

export const loginUser = async (req: Request, res: Response) => {
  const { username, email, id, role }: UserData = req.user;
  const user = {
    id,
    username,
    email,
    role,
  };
  try {
    const token = await signJWT(id!);
    res.status(200).json({
      ok: true,
      msg: 'Logging Success',
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Sorry something was wrong, please contact with Admin',
    });
  }
};

/**
 * Register User without Google
 * @param req
 * @param res
 * @returns
 */
export const registerUser = async (req: Request, res: Response) => {
  const { password, ...userData }: UserData = req.body;
  const hashPassword = hashPasswordWithBcrypt(password);
  const user = new UserModel({ ...userData, password: hashPassword });
  try {
    user.save();
    const token = await signJWT(user.id!);
    return res.status(201).json({
      ok: true,
      msg: ' Successfully registered ',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Sorry something was wrong, please contact with Admin',
    });
  }
};

/**
 * Route for Configure User  {email, password}
 * @param req
 * @param res
 * @returns
 */
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password, newPassword, role, img, ...newUserData }: UpdateUser =
    req.body;
  type Update = Omit<UpdateUser, 'role'>;

  const newUser: Update = newUserData;

  if (newPassword) {
    newUser.password = hashPasswordWithBcrypt(newPassword as string);
  }

  try {
    const user: UserData | null = await UserModel.findByIdAndUpdate<UserData>(
      id,
      { ...newUser },
      { new: true }
    );
    const token = await signJWT(id);

    return res.status(201).json({
      ok: true,
      msg: ' Successfully registered ',
      user: {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        role: user?.role,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Sorry something was wrong, please contact with Admin',
    });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  res.json({
    msg: 'delete API',
  });
};
