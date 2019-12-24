import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "../../_config/store";
import { MyThemeProvider } from "../../_config/theme";

const { store, persistor } = configureStore();

function App() {
  return (
    <MyThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <div>Hello World!</div>
          </Router>
        </PersistGate>
      </Provider>
    </MyThemeProvider>
  );
}

export default App;
