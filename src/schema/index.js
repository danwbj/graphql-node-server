const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');
// 在这里定义所有的类型
const typeDefs = `
  type Link {
    id: ID!
    url: String!
    description: String!
    postedById:String!
    postedBy: User
    votes: [Vote!]!
  }
  type Query {
    allLinks: [Link!]!
  }
  type Mutation {
    createLink(url: String!, description: String!,postedById:String!): Link
    createUser(name: String!, authProvider: AuthProviderSignupData!): User
    createVote(linkId: String!, userId: String!): Vote
  }
  type User {
    id: ID!
    name: String!
    email: String
  }

input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL
}

input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
}
type Vote {
    id: ID!
    user: User!
    link: Link!
  }
`;

// 根据所有类型来生成模式对象
module.exports = makeExecutableSchema({typeDefs,resolvers});