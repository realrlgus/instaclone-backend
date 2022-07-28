import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Resolver } from "src/types";
import client from "./client";

type UserPayload = {
  id: number;
};

type Token = string | string[] | undefined;

export const getUser = async (token: Token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = jwt.verify(
      token as string,
      process.env.PRIVATE_KEY as string
    ) as UserPayload;
    const user = await client.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (e) {
    return null;
  }
};

export const protectedResolver =
  (ourResolver: Resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: "Please log in to perform this action.",
      };
    }
    return ourResolver(root, args, context, info);
  };
