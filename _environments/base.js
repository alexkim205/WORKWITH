export default function(baseApi) {
  return {
    api: {
      base: ``,
      users: `${baseApi}/api/v${process.env.REACT_APP_BACKEND_API_VERSION}/users`,
      notes: `${baseApi}/api/v${process.env.REACT_APP_BACKEND_API_VERSION}/notes`
    }
  };
}
