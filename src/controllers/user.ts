import { UserService } from '../services/user';
import type { Request, Response } from 'express';
import { UserPayload } from '../types/user';
import { AppResponse } from '../utils/response';

export async function create(req: Request, res: Response) {
  const payload = req.body as UserPayload;
  const id = await UserService.create(payload);
  return res
    .status(201)
    .json(new AppResponse('User created succesfully', { id }));
}

export async function update(req: Request, res: Response) {
  const id = req.query.id as string;
  const payload = req.body as UserPayload;
  await UserService.update(id, payload);
  return res.status(200).json(new AppResponse('User updated succesfully'));
}

export async function remove(req: Request, res: Response) {
  const id = req.query.id as string;
  await UserService.delete(id);
  return res.status(200).json(new AppResponse('User removed succesfully'));
}

export async function get(req: Request, res: Response) {
  const id = req.query.id as string;
  const data = await UserService.get(id);
  return res
    .status(200)
    .json(new AppResponse('User fetched succesfully', data));
}

export async function list(req: Request, res: Response) {
  const data = await UserService.list();
  return res
    .status(200)
    .json(new AppResponse('User list fetched succesfully', data));
}
