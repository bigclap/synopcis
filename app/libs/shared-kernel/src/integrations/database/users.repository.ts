export interface UserAccount {
  readonly id: string;
  readonly displayName: string;
  readonly email?: string | null;
}

export interface UsersRepository {
  findById(id: string): Promise<UserAccount | null>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
