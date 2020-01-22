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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      responses: {
        UnauthorizedError: {
          description: "Bearer token is missing or invalid"
        }
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.DEVELOPMENT_API_PORT}/api/v1.0.0`
      },
      {
        url: `http://localhost:${process.env.PRODUCTION_API_PORT}/api/v1.0.0`
      },
      {
        url: `http://idonthaveadomainyet.com/api/v1.0.0`
      }
    ]
  },
  apis: ["./models/*.model.js", "./routes/*.route.js"]
};

module.exports.default = swaggerOptions;
