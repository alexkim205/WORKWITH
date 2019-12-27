const switchEnvs = ({ dev, prod, test, generic }) => {
  const ternaryUtil = v => {
    if (typeof v === "undefined") {
      if (typeof generic === "function") {
        generic();
        return null;
      }
      return generic;
    }
    if (typeof v === "function") {
      v();
      return null;
    }
    return v;
  };
  switch (process.env.NODE_ENV) {
    case "production":
      return ternaryUtil(prod);
    case "testing":
      return ternaryUtil(test);
    default:
      // development
      return ternaryUtil(dev);
  }
};

const getDatabaseUri = () =>
  switchEnvs({
    dev: process.env.DEVELOPMENT_ATLAS_URI,
    prod: process.env.PRODUCTION_ATLAS_URI
    // test uses local mongod instance
  });

const getPort = () =>
  switchEnvs({
    dev: process.env.DEVELOPMENT_API_PORT,
    prod: process.env.PRODUCTION_API_PORT,
    test: process.env.TESTING_API_PORT
  });

const getApiBase = () => `/api/v${process.env.API_VERSION}`;

module.exports = {
  getDatabaseUri,
  getPort,
  getApiBase,
  switchEnvs
};
