const getUri = () => {
  const environment = process.env.NODE_ENV;
  if (environment === "development") {
    return process.env.DEVELOPMENT_ATLAS_URI;
  }
  if (environment === "production") {
    return process.env.PRODUCTION_ATLAS_URI;
  }
  return process.env.SANDBOX_ATLAS_URI;
};

module.exports.getUri = getUri;
