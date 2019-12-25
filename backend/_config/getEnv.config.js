const getUri = () => {
  const environment = process.env.NODE_ENV;
  if (environment === "development") {
    return process.env.DEVELOPMENT_ATLAS_URI;
  }
  if (environment === "production") {
    return process.env.PRODUCTION_ATLAS_URI;
  }
  return process.env.TESTING_ATLAS_URI;
};

const getPort = () => {
  const environment = process.env.NODE_ENV;
  if (environment === "development") {
    return process.env.DEVELOPMENT_API_PORT;
  }
  if (environment === "production") {
    return process.env.PRODUCTION_API_PORT;
  }
  return process.env.TESTING_API_PORT;
};

module.exports.getUri = getUri;
module.exports.getPort = getPort;
