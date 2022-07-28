import { Resolvers } from "src/types";
import { User } from "../users";
import { TAKE } from "../../constants/users";

type SeeFollowingArgs = {
  username: string;
  lastId: number;
};

type SeeFollowingResult = {
  ok: boolean;
  error?: string;
  following?: User[];
};

const resolver: Resolvers = {
  Query: {
    seeFollowing: async (
      _,
      { username, lastId }: SeeFollowingArgs,
      { client }
    ): Promise<SeeFollowingResult> => {
      try {
        const isExistUser = await client.user.findUnique({
          where: {
            username,
          },
          select: {
            id: true,
          },
        });
        if (!isExistUser) {
          throw Error("User not found");
        }

        const following = await client.user
          .findUnique({
            where: {
              username,
            },
          })
          .followers({
            take: TAKE,
            skip: lastId ? 1 : 0,
            ...(lastId && {
              cursor: {
                id: lastId,
              },
            }),
          });
        return {
          ok: true,
          following,
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

export default resolver;
