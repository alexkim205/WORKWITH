import React from 'react';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import _ from 'lodash';
import { displayOptions } from './Projects.options';
import {
  Card,
  _onAppear,
  _onExit,
  _onStart,
  _onComplete
} from './ProjectCard.style';

const ProjectCard = ({ project, setKey, display, navigate }) => {
  const onClick = () => {
    navigate(project);
  };

  return (
    <Flipped
      flipId={setKey}
      stagger
      onAppear={_onAppear}
      onExit={_onExit}
      onStart={_onStart}
      onComplete={_onComplete}
      // shouldInvert={_shouldFlip}
    >
      <Card display={display} onClick={onClick}>
        <Flipped inverseFlipId={setKey} opacity scale>
          <div className="card-content">
            <div className="card-title" data-fade-in>
              {project.title}
            </div>
            <div className="card-subtitle" data-fade-in>
              Filler subtitle
            </div>
          </div>
        </Flipped>
      </Card>
    </Flipped>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object,
  setKey: PropTypes.string,
  display: PropTypes.oneOf(_.values(displayOptions)),
  navigate: PropTypes.func
};

export default ProjectCard;
