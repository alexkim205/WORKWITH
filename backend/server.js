/* eslint-disable no-console */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Setup Express
require("dotenv").config();
require("./_config/passport.config").config();
const getEnv = require("./_config/getEnv.config");
const setupDatabaseConnection = require("./_config/db.config");

const app = express();
app.set("PORT", parseInt(getEnv.getPort(), 10) || 5001);

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Different logging config for each environment
getEnv.switchEnvs({
  dev: () => app.use(morgan("combined")),
  test: () => {},
  testConnection: () => app.use(morgan("tiny"))
});

// Make connection to MongoDB
(async () => {
  await setupDatabaseConnection();
})();

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

// Expose listen and close methods so that they can be called in test files
let server;
app.tListen = async () => {
  server = await app.listen(app.get("PORT"));
  getEnv.switchEnvs({
    test: () => {},
    generic: () => console.log(`Server is running on port: ${app.get("PORT")}`)
  });
};
app.tClose = async () => {
  await server.close();
};

getEnv.switchEnvs({
  test: () => {},
  generic: app.tListen
});

module.exports = app;
