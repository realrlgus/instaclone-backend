import { GraphQLUpload } from "graphql-upload/GraphQLUpload.js";
import { protectedResolver } from "../../utils";

interface UploadPhotoArgs {
  file: String;
  caption?: String;
}

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }: UploadPhotoArgs, { loggedInUser }) => {
        if (caption) {
          const hashtags = caption.match(/#[\w]+/g);
          console.log(hashtags);
        }
      }
    ),
  },
};
