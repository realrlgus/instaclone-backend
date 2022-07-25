import client from "../client";
import { Resolvers } from "src/types";

type UserId = {
  id: number;
};

const resolvers: Resolvers = {
  User: {
    totalFollowing: ({ id }: UserId) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    totalFollowers: ({ id }: UserId) =>
      client.user.count({ where: { following: { some: { id } } } }),
    isMe: ({ id }: UserId, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }: UserId, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      if (id === loggedInUser.id) {
        return false;
      }
      const isFollowing = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(isFollowing);
    },
  },
};

export default resolvers;
