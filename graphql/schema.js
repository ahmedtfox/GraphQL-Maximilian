const { buildSchema } = require("graphql");

const schema = buildSchema(`#graphql
    type RootMutation {
        createUser(userInput:UserInputData):User!
    }
    type Post{
        _id:ID!
        title:String!
        content:String!
        imageUrl:String!
        creator:User!
        createdAt:String!
        updatedAt:String!
    }
    type User{
        _id:ID!
        name:String!
        email:String!
        password:String
        status:String!
        posts:[Post!]!
    }
    input UserInputData {
        email: String!
        name: String!
        password:String!
    }
    schema {
        mutation: RootMutation
    }
`);

module.exports = schema;
