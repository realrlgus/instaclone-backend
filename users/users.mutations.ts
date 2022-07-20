import bcrypt from "bcrypt";
import client from "../src/client";

type CreateAccountProps = {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
};

export default {
  Mutation: {
    createAccount: async (
      _: undefined,
      { firstName, lastName, username, email, password }: CreateAccountProps
    ) => {
      const existingUser = await client.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });
      const uglyPassword = await bcrypt.hash(password, 10);

      return client.user.create({
        data: {
          firstName,
          username,
          lastName,
          email,
          password: uglyPassword,
        },
      });
    },
  },
};
