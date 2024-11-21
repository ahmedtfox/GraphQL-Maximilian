const { buildSchema } = require("graphql");

const schema = buildSchema(`#graphql
    input PostInputData{
        title:String!
        content:String!
        imageUrl:String!
    }
    input PostInputUpdate{
        title:String
        content:String
        imageUrl:String
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
       posts(page:Int):PostData!
       post(id:ID!):Post!
    }
    type RootMutation {
        createUser(userInput:UserInputData):User!
        createPost(postInput:PostInputData):Post!
        updatePost(id:ID!,postInput:PostInputUpdate):Post!
        deletePost(id:String!):Boolean!
    }
    schema {
        query:RootQuery
        mutation: RootMutation
    }
`);

module.exports = schema;
