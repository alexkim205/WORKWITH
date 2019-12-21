const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: process.env.API_VERSION,
      title: "WorkWith REST API Documentation",
      description: "A social organizational app.",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "Alex Kim",
        url: "https://swagger.io",
        email: "alexgkim205@gmail.com"
      }
    },
    servers: [
      {
        url: process.env.DEV_API
      },
      {
        url: process.env.PROD_API_URL
      }
    ]
  },
  apis: ["./models/*.model.js", "./routes/*.route.js"]
};

module.exports.default = swaggerOptions;
