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
  // const parameters = useSelector(
  //   createSelector(
  //     state => state.users.pending,
  //     state => state.users.error,
  //     state => state.projects.pending,
  //     state => state.projects.error,
  //     state => state.notes.pending,
  //     state => state.notes.error,
  //     (...props) =>
  //       _(props)
  //         .map(e => !_.isNull(e))
  //         .join("-")
  //   )
  // );
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
