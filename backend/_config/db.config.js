/* eslint-disable no-console */
/*
 * In the development and production environments, use the online ATLAS links.
 * For the testing environment spin up a local in-memory mongod server. This
 * also removes the need to access the .env variables which is needed for
 * Travis CI.
 */

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const getEnv = require("./getEnv.config");

const { connection } = mongoose;

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
};

const setupOnline = async () => {
  try {
    await mongoose.connect(getEnv.getDatabaseUri(), mongooseOptions);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const setupOffline = async () => {
  try {
    const mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri, mongooseOptions);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const setupDatabaseConnection = async () => {
  try {
    getEnv.switchEnvs({
      dev: async () => {
        await setupOnline();
      },
      prod: async () => {
        await setupOnline();
      },
      test: async () => {
        await setupOffline();
      }
    });
    await connection.once("open", () => {
      getEnv.switchEnvs({
        test: () => {},
        generic: () =>
          console.log(
            "Online MongoDB database connection established successfully"
          )
      });
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

module.exports = setupDatabaseConnection;
