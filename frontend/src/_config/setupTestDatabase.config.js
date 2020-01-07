/* eslint-disable no-console */

import mongoose from "mongoose";

const setup = async () => {
  try {
    await mongoose.connect(process.env.REACT_APP_TESTING_CONNECTION_ATLAS_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
    console.log(
      "Online test MongoDB database connection established successfully"
    );
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const disconnect = async () => {
  try {
    await mongoose.connection.close();
    console.log("Online test MongoDB database disconnected");
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

export default {
  setup,
  disconnect
};
