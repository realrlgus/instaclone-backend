import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resolvers } from "src/types";

type LoginProps = {
  username: string;
  password: string;
};

type LoginReturn = {
  ok: Boolean;
  error?: string;
  token?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    login: async (
      _,
      { username, password }: LoginProps,
      { client }
    ): Promise<LoginReturn> => {
      try {
        const user = await client.user.findFirst({ where: { username } });
        if (!user) {
          throw new Error("User not found.");
        }
        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
          throw new Error("Incorrect password.");
        }
        const token = await jwt.sign(
          { id: user.id },
          process.env.PRIVATE_KEY as string
        );

        return {
          ok: true,
          token,
        };
      } catch (e: any) {
        return {
          ok: false,
          error: e.message,
        };
      }
    },
  },
};

export default resolvers;
