const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const { graphql } = require("graphql");
const graphQLResolver = require("./graphql/resolver");
const schema = require("./graphql/schema");
const { createHandler } = require("graphql-http/lib/use/express");

const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const removeFile = require("./middlewares/removeFile");
const moment = require("moment");
const isAuth = require("./middlewares/is-auth");
const hello = require("./graphql/resolver");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(isAuth);
app.use("/feed/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-METHODS",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.statusCode(200).end();
  }
  next();
});

app.all(
  "/",
  createHandler({
    schema: schema,
    rootValue: graphQLResolver,
    graphiql: true, // Enables the GraphiQL interface
    context: (req) => {
      // Pass request and response objects to the resolvers
      return { req };
    },
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const error = err.originalError;
      const message = error.message || "An error occurred.";
      const code = error.code || 500;
      const data = error.data || [];
      console.log(error);
      return {
        message,
        status: code,
        data,
      };
    },
  })
);

//error handling
/* app.use((error, req, res, next) => {
  error.time = moment().format("HH:mm:SS");
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const errorDetails = error.errorDetails || undefined;
  if (req.uploadStatus === "success") {
    removeFile(req.file.filename);
  }
  return res.status(statusCode).json({
    message: message,
    errorDetails,
  });
});
 */

let server;
const PORT = process.env.PORT;
const db_rrl = process.env.DB_URL;

mongoose
  .connect(db_rrl, { dbName: "REST-APIs-Maximilian-course" })
  .then((result) => {})
  .catch((err) => {
    console.log(err);
  });

mongoose
  .connect(db_rrl, { dbName: "REST-APIs-Maximilian-course" })
  .then((result) => {
    console.log("connected to db successfully");
  })
  .catch((err) => {
    console.log(err);
  });

server = app.listen(PORT, () => {
  console.log("Listening to port:" + PORT);
});
