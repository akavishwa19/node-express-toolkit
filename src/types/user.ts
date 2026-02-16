export interface UserPayload {
  username: string;
  email: string;
  password: string;
  age: number;
}

export interface User extends Omit<UserPayload, 'password'> {
  id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}
