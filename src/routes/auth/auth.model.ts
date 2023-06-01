import { Static, Type } from "@sinclair/typebox";

export const User = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
  username: Type.String({ minLength: 4, maxLength: 16 }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
});

export type UserType = Static<typeof User>;

export const LoginUser = Type.Object({
  username: Type.String(),
  password: Type.String({ minLength: 8 }),
});

export type LoginUserType = Static<typeof LoginUser>;
