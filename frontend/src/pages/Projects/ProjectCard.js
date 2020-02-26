import React from "react";
import PropTypes from "prop-types";
import { Flipped } from "react-flip-toolkit";
import _ from "lodash";
import { displayOptions } from "./Projects.options";
import { Card, _onAppear, _onExit } from "./ProjectCard.style";

const shouldFlip = (prev, current) => {
  const sort1 =
    current.location.search.match(/sort=([^&]+)/) &&
    current.location.search.match(/sort=([^&]+)/)[1];
  const sort2 =
    prev.location.search.match(/sort=([^&]+)/) &&
    prev.location.search.match(/sort=([^&]+)/)[1];
  return sort1 === sort2;
};

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
      shouldInvert={shouldFlip}
    >
      <Card display={display} onClick={onClick}>
        <Flipped inverseFlipId={setKey} opacity scale>
          <div className="card-content">
            <div className="card-title">{project.title}</div>
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
