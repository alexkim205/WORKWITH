/* eslint-disable no-console */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const tcpPortUsed = require("tcp-port-used");

// Setup Express
require("dotenv").config();
require("./_config/passport.config").config();
const getEnv = require("./_config/getEnv.config");

const app = express();
const port = parseInt(getEnv.getPort(), 10) || 5001;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Different logging config for each environment
getEnv.switchEnvs({
  dev: () => app.use(morgan("combined")),
  test: () => app.use(morgan("tiny"))
});

// Make connection to MongoDB
mongoose.connect(getEnv.getDatabaseUri(), {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});
const { connection } = mongoose;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Setup Swagger API Documentation
const swaggerOptions = require("./_config/swagger.config.js").default;

const specs = swaggerJsdoc(swaggerOptions);

app.use(express.static("./public"));
app.use("/api-docs", swaggerUi.serve);
app.get(
  "/api-docs",
  swaggerUi.setup(specs, { explorer: true, customCssUrl: "/css/swagger.css" })
);

// Setup API endpoints
const notesRouter = require("./routes/note.route");
const userRouter = require("./routes/user.route");
const projectRouter = require("./routes/project.route");

app.use(`/api/v${process.env.API_VERSION}/notes`, notesRouter);
app.use(`/api/v${process.env.API_VERSION}/users`, userRouter);
app.use(`/api/v${process.env.API_VERSION}/projects`, projectRouter);

// Don't listen again if address is already being used
(async () => {
  const inUse = await tcpPortUsed.check(port);
  if (!inUse) {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
      app.emit("appStarted");
    });
  }
})();

module.exports = app;
