/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createBrowserHistory } from 'history';

export default () => {
  const history = createBrowserHistory();
  const cachedPush = history.push;

  // override history.push method to allow to exit animations and delayed FLIP
  history.push = args => {
    if (typeof args === 'string') {
      return cachedPush(args);
    }
    if (args && args.state && args.state.animate) {
      args.state.animate().then(() => {
        delete args.state.animate;
        cachedPush(args);
      });
    } else {
      cachedPush(args);
    }
  };

  return history;
};
