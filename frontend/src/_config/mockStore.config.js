import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import rootReducer from '../_reducers';

const middlewares = [thunk];

export default () => configureMockStore(middlewares)(rootReducer);
