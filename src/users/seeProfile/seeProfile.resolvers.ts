import { Resolvers } from "src/types";

const resolvers: Resolvers = {
  Query: {
    seeProfile: (_, { username }, { client }) =>
      client.user.findUnique({
        where: {
          username,
        },
        include: {
          followers: true,
          following: true,
        },
      }),
  },
};
export default resolvers;
