import { Resolvers } from "src/types";
import { User } from "../users";

type Keyword = {
  keyword: string;
};

type SearchUsers = User[];

const resolvers: Resolvers = {
  Query: {
    searchUsers: async (
      _,
      { keyword }: Keyword,
      { client }
    ): Promise<SearchUsers> => {
      const users = await client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
      });
      return users;
    },
  },
};
export default resolvers;
