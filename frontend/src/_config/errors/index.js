import Server from './Server.error';
import Cancel from './Cancel.error';
import Form from './Form.error';
import Register from './Register.error';
import Login from './Login.error';
import Project from './Project.error';

const Errors = {
  Server,
  Cancel,
  Form,
  Auth: {
    Register,
    Login
  },
  Project
};

export default Errors;
