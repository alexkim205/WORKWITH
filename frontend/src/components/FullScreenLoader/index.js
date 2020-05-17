import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Flipper, Flipped } from 'react-flip-toolkit';

import {
  InverseContainer,
  Container,
  Content,
  Blob
} from './FullScreenLoader.style';
import wait from '../../_utils/wait.util';

const FullScreenLoader = ({
  flipId,
  backgroundColorCallback,
  setPending,
  onComplete,
  onSuccess,
  onFailure,
  ...flipProps
}) => {
  const [pendingStatus, setPendingStatus] = useState('pending');
  const _onComplete = async () => {
    try {
      await wait(800);
      await onComplete();
      // Animate success loading page
      setPendingStatus('success');
      // Animate away from loading page
      await wait(800);
      setPending(false);
      onSuccess();
    } catch (error) {
      setPendingStatus('failure');
      onFailure(error);
      await wait(800);
      setPending(false);
    }
  };

  const _renderStatus = () => {
    if (pendingStatus === 'failure') {
      return (
        <Fragment>
          <Content>
            <span>Error</span>
            <Flipped flipId={`${flipId}-status`} translate={false}>
              <Blob large failure />
            </Flipped>
          </Content>
        </Fragment>
      );
    }
    if (pendingStatus === 'success') {
      return (
        <Fragment>
          <Content>
            <span>Success!</span>
            <Flipped flipId={`${flipId}-status`} translate={false}>
              <Blob large success />
            </Flipped>
          </Content>
        </Fragment>
      );
    }
    // if pending
    return (
      <Fragment>
        <Content>
          <span>Loading</span>
          <Flipped flipId={`${flipId}-status`} translate={false}>
            <Blob pending />
          </Flipped>
        </Content>
      </Fragment>
    );
  };

  return (
    <Flipped
      flipId={flipId}
      onComplete={_onComplete}
      {...flipProps}
      opacity={false}
    >
      <Container backgroundColorCallback={backgroundColorCallback}>
        <Flipped inverseFlipId={flipId}>
          <InverseContainer>
            <Flipper flipKey={pendingStatus}>{_renderStatus()}</Flipper>
          </InverseContainer>
        </Flipped>
      </Container>
    </Flipped>
  );
};

FullScreenLoader.propTypes = {
  backgroundColorCallback: PropTypes.func,
  flipId: PropTypes.string,
  setPending: PropTypes.func,
  onComplete: PropTypes.func,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func
};

export default FullScreenLoader;
