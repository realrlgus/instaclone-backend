import client from "../../client";
import { Resolvers } from "src/types";
import { protectedResolver } from "../../utils";

type UnfollowUserArgs = {
  username: string;
};

type UnfollowUserResult = {
  ok: boolean;
  error?: string;
};

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: protectedResolver(
      async (
        _,
        { username }: UnfollowUserArgs,
        { loggedInUser }
      ): Promise<UnfollowUserResult> => {
        try {
          const isUserExist = await client.user.findUnique({
            where: {
              username,
            },
          });
          if (!isUserExist) {
            throw Error("Can't unfollow user.");
          }
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                disconnect: {
                  username,
                },
              },
            },
          });
          return {
            ok: true,
          };
        } catch (e) {
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
