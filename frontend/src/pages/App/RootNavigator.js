import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Flipper } from 'react-flip-toolkit';
import _ from 'lodash';

import { useFlip } from '../../_utils/FlipProvider.util';
import ProjectsPage from '../Projects';
import AuthPage from '../Auth';
import ProfilePage from '../Profile';
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
  // console.log(flipKeyParams.join('-'));
  return (
    <Flipper
      flipKey={flipKeyParams.join('-')}
      decisionData={{ location, flipState, isPending }}
      // spring={{
      //   stiffness: 10,
      //   dampness: 30
      // }}
      spring="noWobble"
      handleEnterUpdateDelete={async ({
        hideEnteringElements,
        animateEnteringElements,
        animateExitingElements,
        animateFlippedElements
      }) => {
        // console.log('hiding entering elements');
        // hideEnteringElements();
        // console.log('animate entering elements');
        // animateEnteringElements();
        // console.log('animate exiting elements');
        // await animateExitingElements();
        // console.log('animate flipped elements');
        // await animateFlippedElements();

        // console.log('hideEnteringElements');
        // hideEnteringElements(); // gives entering elements opacity 0
        // console.log('animateFlippedElements');
        // await animateFlippedElements();
        // console.log('animateEnteringElements');
        // animateEnteringElements(); // calls on Appear
        // console.log('animateExitingElements');
        // await animateExitingElements(); // calls on Exit

        // console.log('hideEnteringElements');
        hideEnteringElements(); // gives entering elements opacity 0
        // console.log('animateFlippedElements + animateExitingElements');
        await Promise.all([animateFlippedElements(), animateExitingElements()]);
        // console.log('animateEnteringElements2');
        animateEnteringElements(); // calls on Appear
      }}
      // debug
    >
      <Switch>
        <Route exact path={'/auth'} render={AuthPage} />
        <Route exact path={'/projects'} render={ProjectsPage} />
        <Route exact path={'/profile'} render={ProfilePage} />
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
