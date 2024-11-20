const { buildSchema } = require("graphql");

const schema = buildSchema(`#graphql
    type RootMutation {
        createUser(userInput:UserInputData):User!
        createPost(postInput:PostInputData):Post!
    }
    input PostInputData{
        title:String!
        content:String!
        imageUrl:String!
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
    type AuthData{
        token:String!
        userId:String!
    }
    input UserInputData {
        email: String!
        name: String!
        password:String!
    }
    type PostData{
        posts:[Post]!
        totalPosts:Int!
    }
    type RootQuery {
       login(email:String!,password:String!):AuthData!
       posts:PostData!
    }
    schema {
        query:RootQuery
        mutation: RootMutation
    }
`);

module.exports = schema;
