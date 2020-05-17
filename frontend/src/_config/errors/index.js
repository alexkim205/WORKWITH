import Server from './Server.error';
import Form from './Form.error';
import Auth from './Auth.error';

export const ServerError = Server;
export const FormError = Form;
export const AuthError = Auth;

const Errors = {
  Server,
  Form,
  Auth
};

export default Errors;
