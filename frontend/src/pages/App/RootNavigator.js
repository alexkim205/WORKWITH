import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { Flipper, Flipped } from "react-flip-toolkit";
import _ from "lodash";

import { useFlip } from "../../_utils/FlipProvider.util";
import Projects from "../Projects";
import Auth from "../Auth";

const RootNavigator = ({ location }) => {
  const { flipState, isPending } = useFlip();
  const flipKeyParams = useMemo(
    () =>
      _.compact([
        location.pathname,
        location.search.replace("?", ""),
        flipState.toString(),
        isPending.toString()
      ]),
    [location.pathname, location.search, flipState, isPending]
  );
  // console.log(flipKeyParams.join("-"));
  return (
    <Flipper
      flipKey={flipKeyParams.join("-")}
      decisionData={{ location, flipState, isPending }}
      // spring={{
      //   stiffness: 110,
      //   dampness: 30
      // }}
      sprint="veryGentle"
      handleEnterUpdateDelete={({
        hideEnteringElements,
        animateEnteringElements,
        animateExitingElements,
        animateFlippedElements
      }) => {
        hideEnteringElements();
        animateExitingElements().then(
          Promise.all[(animateEnteringElements(), animateFlippedElements())]
        );

        // then(
        //   Promise.all[(animateEnteringElements(), animateFlippedElements())]
        // );
        // Promise.all([animateExitingElements(), animateFlippedElements()]).then(
        //   animateEnteringElements
        // );
        // animateFlippedElements().then(animateEnteringElements);
      }}
      // debug
    >
      <Route
        exact
        path={"/auth"}
        render={() => (
          <Flipped
            flipId="page"
            // eslint-disable-next-line no-unused-vars
            shouldFlip={({ location: prevLoc }, { location: currLoc }) =>
              currLoc === "/auth"
            }
          >
            <div>
              <Auth />
            </div>
          </Flipped>
        )}
      />
      <Route
        exact
        path={"/projects"}
        render={() => (
          <Flipped flipId="page">
            <div>
              <Projects />
            </div>
          </Flipped>
        )}
      />
    </Flipper>
  );
};

RootNavigator.propTypes = {
  location: PropTypes.object,
  search: PropTypes.object
};

export default RootNavigator;
