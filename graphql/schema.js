const { buildSchema } = require("graphql");

const schema = buildSchema(`#graphql
    type RootQuery {
        hello: TestData
    }
    type TestData {
        text: String
        views: Int
    }
    schema {
        query: RootQuery
    }
`);

module.exports = schema;
