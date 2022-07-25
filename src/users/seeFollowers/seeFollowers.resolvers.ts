import client from "../../client";
import { Resolvers } from "src/types";
import { User } from "../users";
import { TAKE } from "../../constants/users";

type SeeFollowersArgs = {
  username: string;
  page: number;
};

type SeeFollowersResult = {
  ok: boolean;
  error?: string;
  followers?: User[];
  totalPages?: number;
};

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (
      _,
      { username, page }: SeeFollowersArgs
    ): Promise<SeeFollowersResult> => {
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
        const followers = await client.user
          .findUnique({
            where: {
              username,
            },
          })
          .followers({
            take: TAKE,
            skip: (page - 1) * TAKE,
          });
        const totalFollowers = await client.user.count({
          where: {
            following: {
              some: {
                username,
              },
            },
          },
        });
        return {
          ok: true,
          followers,
          totalPages: Math.ceil(totalFollowers / TAKE),
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
        };
      }
    },
  },
};
export default resolvers;
