import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import anime from "animejs";
import { Flipped } from "react-flip-toolkit";
import { secondaryColor } from "../../_constants/theme.constants";
import { breakpoint } from "../../_constants/theme.mixins.constants";

const CARD_SPACING = 1.5; // em

const Card = styled.li`
  box-sizing: border-box;
  position: relative;
  color: white;
  border-radius: 5px;
  margin-right: ${CARD_SPACING}em;
  margin-bottom: ${CARD_SPACING}em;
  background-color: ${secondaryColor};
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  will-change: transform;
  // transition: 0.2s margin-bottom;

  ${({ display }) => {
    if (display === "grid") {
      return `
      // 3 columns
      width: calc((100% / 3) - (${CARD_SPACING * 2}em / 3));
      padding-bottom: calc((100% / 3) - (${CARD_SPACING * 2}em / 3));
      &:nth-child(3n) {
        margin-right: 0;
      }
      &:nth-child(2n) {
        margin-right: ${CARD_SPACING}em;
      }

      // 2 columns
      ${breakpoint.down("m")`
        width: calc((100% / 2) - (${CARD_SPACING}em / 2));
        padding-bottom: calc((100% / 2) - (${CARD_SPACING}em / 2));
        &:nth-child(2n) {
          margin-right: 0;
        }
        &:nth-child(3n) {
          margin-right: ${CARD_SPACING}em;
        }
      `.join("")}

      // 1 column and row
      ${breakpoint.down("xs")`
        width: 100%;
        padding-bottom: 0;
        margin-right: 0 !important;
      `.join("")}
      `;
    }
    return `
      width: 100%;
      margin-right: 0 !important;
      margin-bottom: ${CARD_SPACING}em;

      ${breakpoint.down("s")`
        margin-bottom: ${CARD_SPACING / 2}em;
      `.join("")}
    `;
  }}

  .card-content {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    transition: 0.2s padding;

    ${({ display }) => {
      if (display === "grid") {
        return `
        position: absolute;
        padding: 1.8em;
        `;
      }
      return `
        position: relative;
        padding: 2.1em 1.8em;

        ${breakpoint.down("s")`
          padding: 1.8em 1.5em;
        `.join("")}
      `;
    }}

    .card-title {
      font-family: "Ubuntu", sans-serif;
      font-weight: 300;
      font-size: 1.2em;
      letter-spacing: 0.04em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: 0.2s all;

      ${breakpoint.down("s")`
        font-size: 1.1em;
      `}
    }
  }

  .ur-icon {
    position: relative;
    top: 1em;
    right: 1em;
  }
`;

const onExit = (el, i, removeElement) => {
  anime({
    targets: el,
    opacity: 0,
    scale: 0.9,
    easing: "easeOutSine",
    duration: 400,
    delay: i * 40,
    complete: removeElement
  });
};

const onAppear = (el, i) => {
  anime({
    targets: el,
    opacity: [0, 1],
    scale: [0.9, 1],
    easing: "easeInSine",
    duration: 400,
    delay: i * 40
  });
};

const shouldFlip = (prev, current) => {
  const sort1 =
    current.location.search.match(/sort=([^&]+)/) &&
    current.location.search.match(/sort=([^&]+)/)[1];
  const sort2 =
    prev.location.search.match(/sort=([^&]+)/) &&
    prev.location.search.match(/sort=([^&]+)/)[1];
  return sort1 === sort2;
};

const ProjectCard = ({ project, setKey, display }) => {
  return (
    <Flipped
      flipId={setKey}
      stagger
      onAppear={onAppear}
      onExit={onExit}
      shouldInvert={shouldFlip}
    >
      <Card display={display}>
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
  display: PropTypes.oneOf(["grid", "list"])
};

export default ProjectCard;
