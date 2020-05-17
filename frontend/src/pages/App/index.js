import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Router, Switch, Route } from 'react-router-dom';

import { MyThemeProvider } from '../../_config/theme.config';
import FlipProvider from '../../_utils/FlipProvider.util';
import { store, persistor } from '../../_config/store.config';
import history from '../../_config/history.config';
import configureAxiosInterceptor from '../../_config/axios.config';

import RootNavigator from './RootNavigator';

configureAxiosInterceptor(store);

/**
 * Routing
 * - Authentication Page (/auth)
 *  - Contains both signup and login components
 * - After authentication, go to index page
 *  - Header
 *  - Body
 *    - Projects Page (/projects)
 *      - Click a project to go to Project Dashboard Page (/project/:projectId)
 *        - Click a user to go to profile.
 *    - Profile Page (/user/{me|:handle})
 *
 * Pages
 * - Auth page (/auth)
 * - Index/Projects page (/projects)
 * - Project Dashboard page (/projects/:projectId)
 * - Profile page (/user/{me|:handle})
 */

const App = () => {
  return (
    <MyThemeProvider>
      <Provider store={store}>
        <FlipProvider>
          <PersistGate loading={null} persistor={persistor}>
            <Router history={history}>
              <Switch>
                <Route render={props => <RootNavigator {...props} />} />
              </Switch>
            </Router>
          </PersistGate>
        </FlipProvider>
      </Provider>
    </MyThemeProvider>
  );
};

export default App;
