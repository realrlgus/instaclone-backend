import client from "../src/client";

type SearchArgs = {
  id: number;
};

type CreateMovie = {
  title: string;
  year: number;
  genre?: string;
};

export default {
  Mutation: {
    createMovie: (_: undefined, { title, year, genre }: CreateMovie) =>
      client.movie.create({ data: { title, year, genre } }),
    deleteMovie: (_: undefined, { id }: SearchArgs) =>
      client.movie.delete({ where: { id } }),
  },
};
