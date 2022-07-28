import client from "../../client";
import { Resolvers } from "src/types";
import { protectedResolver } from "../../utils";

type FollowUserArgs = {
  username: string;
};

type FollowUserReturn = {
  ok: Boolean;
  error?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (
        _,
        { username }: FollowUserArgs,
        { loggedInUser }
      ): Promise<FollowUserReturn> => {
        try {
          const isUserExist = await client.user.findUnique({
            where: {
              username,
            },
          });
          if (!isUserExist) {
            throw Error("User does not exist.");
          }
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                connect: {
                  username,
                },
              },
            },
          });
          return { ok: true };
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
