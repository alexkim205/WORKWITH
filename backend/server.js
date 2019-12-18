const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Setup Express
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Make connection to MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Setup Swagger API Documentation
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerOptions = require("./config/swagger.config.js").default;
const specs = swaggerJsdoc(swaggerOptions);

app.use(express.static('public'))
app.use("/api-docs", swaggerUi.serve);
app.get(
  "/api-docs",
  swaggerUi.setup(specs, { explorer: true, customCssUrl: "/css/swagger.css" })
);

// Setup API endpoints
const notesRouter = require("./routes/note.route");
const userRouter = require("./routes/user.route");
app.use(`/api/v${process.env.API_VERSION}/notes`, notesRouter);
app.use(`/api/v${process.env.API_VERSION}/users`, userRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
