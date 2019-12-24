export default () => {
  if (process.env.NODE_ENV === "development") {
    return {
      serverUrl: `${process.env.REACT_APP_DEV_API_BASE_URL}:${process.env.REACT_APP_DEV_API_PORT}`
    };
  }
  return {
    serverUrl: `${process.env.REACT_APP_PROD_API_URL}`
  };
};
