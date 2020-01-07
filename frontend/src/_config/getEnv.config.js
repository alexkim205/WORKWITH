export const switchEnvs = ({ dev, prod, test, testConnection, generic }) => {
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
  switch (process.env.REACT_APP_ENV) {
    case "production":
      return ternaryUtil(prod);
    case "testing":
      return ternaryUtil(test);
    case "testing-connection":
      return ternaryUtil(testConnection);
    default:
      // development
      return ternaryUtil(dev);
  }
};

export const getServerUrl = () =>
  switchEnvs({
    dev: `${process.env.REACT_APP_DEV_API_BASE_URL}:${process.env.REACT_APP_DEV_API_PORT}/api/v${process.env.REACT_APP_API_VERSION}`,
    prod: `${process.env.REACT_APP_PROD_API_URL}/api/v${process.env.REACT_APP_API_VERSION}`
    // testConnection: `${process.env.REACT_APP_TEST_API_BASE_URL}:${process.env.REACT_APP_TEST_CONNECT_API_PORT}/api/v${process.env.REACT_APP_API_VERSION}`
    // test uses nock http mocking service
  });
