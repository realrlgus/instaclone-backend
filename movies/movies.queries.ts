import client from "../src/client";

type SearchArgs = {
  id: number;
};

export default {
  Query: {
    movies: () => client.movie.findMany(),
    movie: (_: any, { id }: SearchArgs) =>
      client.movie.findUnique({ where: { id } }),
  },
};
