import React, { useState, useContext, createContext } from "react";
// import { shallowEqual, useSelector } from "react-redux";
// import { createSelector } from "reselect";
// import _ from "lodash";
import PropTypes from "prop-types";

const FlipContext = createContext({
  flip: () => {}
});

export const useFlip = () => useContext(FlipContext);

const FlipProvider = ({ children }) => {
  const [flipState, setFlipState] = useState(false);
  const [isPending, setPending] = useState(false);
  const flip = () => {
    setFlipState(prevState => !prevState);
  };

  return (
    <FlipContext.Provider value={{ flip, flipState, setPending, isPending }}>
      {children}
    </FlipContext.Provider>
  );
};

FlipProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default FlipProvider;
