import { gql } from "apollo-server";

export default gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String
    username: String!
    bio: String
    avatar: String
    createdAt: String!
    updatedAt: String!
    following: [User]
    followers: [User]
    totalFollowing: Int
    totalFollowers: Int
    isMe: Boolean!
    isFollowing: Boolean
  }
`;

//   isMe: Boolean!
