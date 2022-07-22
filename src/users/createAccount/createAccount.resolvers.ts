import bcrypt from "bcrypt";
import { Resolvers } from "src/types";

type CreateAccountProps = {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
};
const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }: CreateAccountProps,
      { client }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });

        if (existingUser) {
          throw new Error("This username/password is already taken.");
        }

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
      } catch (e) {
        return e;
      }
    },
  },
};

export default resolvers;
