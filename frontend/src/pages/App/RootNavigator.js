import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Flipper } from 'react-flip-toolkit';
import _ from 'lodash';

import { useFlip } from '../../_utils/FlipProvider.util';
import ProjectsPage from '../Projects';
import AuthPage from '../Auth';
import ProjectPage from '../Project';

const RootNavigator = ({ location }) => {
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
      flipKey={flipKeyParams.join('-')}
      decisionData={{ location, flipState, isPending }}
      // spring={{
      //   stiffness: 10,
      //   dampness: 30
      // }}
      spring="noWobble"
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
      <Switch>
        <Route exact path={'/auth'} render={AuthPage} />
        <Route exact path={'/projects'} render={ProjectsPage} />
        <Route path="/project/:id" component={ProjectPage} />
      </Switch>
    </Flipper>
  );
};

RootNavigator.propTypes = {
  location: PropTypes.object,
  search: PropTypes.object
};

export default RootNavigator;
