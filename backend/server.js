/* eslint-disable no-console */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Setup Express
require("dotenv").config();
require("./_config/passport.config").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(passport.initialize());

// Make connection to MongoDB
const uri = require("./_config/getDatabaseUri.config").getUri();

console.log(uri);
mongoose.connect(uri, {
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
const API_VERSION = swaggerOptions.swaggerDefinition.info.version;
const notesRouter = require("./routes/note.route");
const userRouter = require("./routes/user.route");
const projectRouter = require("./routes/project.route");

app.use(`/api/v${API_VERSION}/notes`, notesRouter);
app.use(`/api/v${API_VERSION}/users`, userRouter);
app.use(`/api/v${API_VERSION}/projects`, projectRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
