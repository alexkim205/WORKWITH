import React, { Fragment } from 'react';
import { Flipped } from 'react-flip-toolkit';

import Background from './Profile.style';
import Navbar from '../../components/Navbar';
// import { Input } from '../../components/Form';

const ProfileBox = () => {
  return (
    <Fragment>
      <Navbar />
      {/* <div className="spacer"></div> */}
      <div className="body"></div>
    </Fragment>
  );
};

const Profile = () => (
  <Flipped flipId="page">
    <Background>
      <Flipped inverseFlipId="page">
        <ProfileBox />
      </Flipped>
    </Background>
  </Flipped>
);

export default Profile;
