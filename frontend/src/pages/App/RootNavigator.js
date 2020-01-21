import React, { useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Route } from "react-router-dom";
import { Flipper, Flipped } from "react-flip-toolkit";
import _ from "lodash";

import { useFlip } from "../../_utils/FlipProvider.util";

import Projects from "../Projects";
import Auth from "../Auth";

const Header = styled.header`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid black;
  width: 100%;
  position: relative;
  background-color: #f1f1f1;
  z-index: 10;
`;

const RootNavigator = ({ location, search }) => {
  const { flipState, isPending } = useFlip();
  const flipKeyParams = useMemo(
    () =>
      _.compact([
        location.pathname,
        location.search,
        flipState.toString(),
        isPending.toString()
      ]),
    [location.pathname, location.search, flipState, isPending]
  );
  // console.log(flipKeyParams.join("-"));
  return (
    <Flipper
      flipKey={flipKeyParams.join("-")}
      decisionData={{ location, search, flipState }}
      // spring={{
      //   stiffness: 110,
      //   dampness: 10
      // }}
      sprint="veryGentle"
    >
      <Route
        exact
        path={"/auth"}
        render={() => (
          <Flipped flipId="page">
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
              <Header />
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
