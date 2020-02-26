// import React, { useRef, useEffect } from "react";
// import PropTypes from "prop-types";
// import { Flipped } from "react-flip-toolkit";
// import _ from "lodash";
// import useAction from "../../_utils/useAction.util";
// import { getProjectsByUser } from "../../_actions/projects.actions";
// import {
//   getProjects,
//   getProjectsPendingAndError
// } from "../../_selectors/projects.selectors";

// import styled from "styled-components";
// import anime from "animejs";
// import {
//   secondaryColor,
//   springConfig,
//   PURPLE
// } from "../../_constants/theme.constants";

// const Background = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   bottom: 0;
//   right: 0;
//   min-height: 100vh;
//   // margin: 5em;
//   // height: 600px;
//   // width: 600px;
//   background-color: ${secondaryColor}
//   z-index: 3;
//   will-change: transform;
// `;

// const _onComplete = (el, loadingCallback) => {
//   console.log("COMPLETE", el);
//   anime({
//     targets: el,
//     backgroundColor: [secondaryColor({ theme: { mode: "light" } }), "#fff"],
//     easing: springConfig.noWobble,
//     duration: 1000
//   });
// };

// const ProjectPage = ({
//   match: {
//     params: { id: setKey }
//   }
// }) => {
//   const containerRef = useRef(null);
//   const loadingCallback = () => {

//   };
//   useEffect(() => {
//     console.log("PROJECT PAGE", setKey);
//   }, []);

//   return (
//     <Flipped
//       flipId={setKey}
//       onComplete={el => _onComplete(el, loadingCallback)}
//     >
//       <Background>
//         <Flipped inverseFlipId={setKey}>
//           <div className="content">PROJECT</div>
//         </Flipped>
//       </Background>
//     </Flipped>
//   );
// };

// ProjectPage.propTypes = {
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       id: PropTypes.string
//     })
//   })
// };

// export default ProjectPage;
