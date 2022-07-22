import bcrypt from "bcrypt";
import { createWriteStream } from "fs";
import { GraphQLUpload } from "graphql-upload/GraphQLUpload.js";
import { Resolvers } from "src/types";
import { protectedResolver } from "../users.utils";

type EditProfileArgs = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatar?: GraphQLUpload;
};

type EditProfileReturn = {
  ok: Boolean;
  error?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password,
          bio,
          avatar,
        }: EditProfileArgs,
        { loggedInUser, client }
      ): Promise<EditProfileReturn> => {
        try {
          let avatarUrl = null;
          if (avatar) {
            const {
              file: { createReadStream, filename },
            } = await avatar;
            const currentDirectory = process.cwd();
            const newFileName = `${loggedInUser.id}${Date.now()}${filename}`;
            const readStream = createReadStream();
            const writeStream = createWriteStream(
              `${currentDirectory}/uploads/${newFileName}`
            );
            readStream.pipe(writeStream);
            avatarUrl = `http://localhost:${process.env.PORT}/static/${newFileName}`;
          }

          const uglyPassword =
            password && (await bcrypt.hash(password as string, 10));
          await client.user.update({
            where: {
              id: 1,
            },
            data: {
              firstName,
              lastName,
              username,
              email,
              bio,
              password: uglyPassword,
              ...(avatar && { avatar: avatarUrl }),
            },
          });
          return {
            ok: true,
          };
        } catch (e: any) {
          return {
            ok: false,
            error: e.message,
          };
        }
      }
    ),
  },
};

export default resolvers;
