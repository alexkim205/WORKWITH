import React, { Fragment, useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import _ from "lodash";
import { Flipped } from "react-flip-toolkit";
// import useAction from "../../_utils/useAction.util";
// import { getProjectsByUser } from "../../_actions/projects.actions";
// import { getCurrentUserAndToken } from "../../_selectors/users.selectors";
// import {
//   getProjects,
//   getProjectsPendingAndError
// } from "../../_selectors/projects.selectors";

const CardGrid = styled.ul`
  display: ${props => (props.display === "grid" ? "grid" : "block")};
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: block;
    margin-bottom: ${props => (props.display === "grid" ? 0 : "1.5rem")};
    height: ${props => (props.display === "grid" ? "auto" : "5.75rem")};
  }
`;

const Container = styled.div`
  width: 100%;
  background-color: pink;
`;

const Projects = () => {
  const [state, setState] = useState({
    filter: "",
    display: "grid",
    sort: "created", // ["created", "last modified"]
    projects: [],
    visibleProjects: []
  });

  const history = useHistory();
  const location = useLocation();
  // const updateQueryParam = obj => {
  //   history.push({
  //     search: `?${qs.stringify({
  //       ...qs.parse(location.search.replace("?", "")),
  //       ...obj
  //     })}`
  //   });
  // };
  // const navigate = projectTitle => {
  //   history.push({
  //     pathname: `/${projectTitle.replace(/\s/g, "-")}`,
  //     search: location.search
  //   });
  // };

  // // Get projects by user
  // const _getProjectsByUser = useAction(getProjectsByUser);
  // const { user } = useSelector(getCurrentUserAndToken);
  // const projects = useSelector(getProjects);
  // const { pending, error } = useSelector(getProjectsPendingAndError);

  // useEffect(() => {
  //   if (!user) {
  //     history.push({ pathname: `/auth` });
  //     return;
  //   }
  //   const getProjectsAsync = async () => {
  //     await _getProjectsByUser(user._id);
  //     setState(prevState => ({ ...prevState, projects }));
  //   };
  //   getProjectsAsync();
  // }, []);

  // Update visible projects when projects or query params change
  useEffect(() => {
    const sortParam = state.sort === "created" ? "createdAt" : "updatedAt";
    setState(prevState => ({
      ...state,
      visibleProjects: _(prevState.visibleProjects)
        .sortBy(project => new Date(project[sortParam]))
        .filter(project =>
          new RegExp(`^${prevState.filter}`).test(project.name)
        )
        .value()
    }));
  }, [state.projects, location.search]);

  return (
    <Fragment>
      {state.visibleProjects.length === 0 ? (
        <Container>
          <Flipped inverseFlipId="page">
            <div>
              <h1>No Results Found</h1>
              <button
                onClick={() => {
                  history.push({ pathname: `/auth` });
                }}
              >
                go back
              </button>
            </div>
          </Flipped>
        </Container>
      ) : (
        <Container>
          <h1>Projects</h1>
          <CardGrid display={state.display}>
            {state.visibleProjects.map((project, i) => (
              <div key={i}>
                <h3>{project.title}</h3>
              </div>
            ))}
          </CardGrid>
        </Container>
      )}
    </Fragment>
  );
};

export default Projects;
