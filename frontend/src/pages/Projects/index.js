import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import _ from 'lodash';
import qs from 'qs';
import { Flipped } from 'react-flip-toolkit';
import Fuse from 'fuse.js';
import { IoMdGrid, IoMdList } from 'react-icons/io';

import fuseOptions from '../../_config/fuse.config';
import useAction from '../../_utils/useAction.util';
import useDebounce from '../../_utils/useDebounce.util';
import useWindowWidth from '../../_utils/useWindowWidth.util';
import { breakpoints } from '../../_constants/theme.constants';
import { getProjectsByUser } from '../../_actions/projects.actions';
import { sortOptions, displayOptions } from './Projects.options';
import {
  getCurrentUserAndToken,
  getUsersPendingAndError
} from '../../_selectors/users.selectors';
import {
  getProjects,
  getProjectsPendingAndError
} from '../../_selectors/projects.selectors';

import { Background, StyledProjects } from './Projects.style';
import Navbar from '../../components/Navbar';
import { Input } from '../../components/Form';
import ToggleSwitch from '../../components/Filters/ToggleSwitch';
import Dropdown from '../../components/Filters/Dropdown';
import AddProjectButton from './AddProjectButton';
import ProjectCard from './ProjectCard';

const ProjectsBox = () => {
  const windowWidth = useWindowWidth();
  const history = useHistory();
  const location = useLocation();
  const prevQueryParams = qs.parse(
    JSON.parse(sessionStorage.getItem('projectsPage')),
    { ignoreQueryPrefix: true }
  ); // get saved query params from session storage
  const _getProjectsByUser = useAction(getProjectsByUser);
  const { user } = useSelector(getCurrentUserAndToken);
  const { pending: userPending } = useSelector(getUsersPendingAndError);
  const { pending: projectsPending, error: projectsError } = useSelector(
    getProjectsPendingAndError
  );
  const projects = useSelector(getProjects);
  const [state, setState] = useState({
    filter: prevQueryParams.filter || '',
    display:
      windowWidth <= breakpoints.xs
        ? displayOptions.list
        : prevQueryParams.display || displayOptions.grid,
    sort: prevQueryParams.sort || sortOptions.newestFirst.name
  });
  const debouncedSearchTerm = useDebounce(state.filter, 200);

  // Lifecycle methods
  const handleChange = e => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const updateQueryParam = obj => {
    const newQueryParams = qs.stringify(
      { ...qs.parse(location.search, { ignoreQueryPrefix: true }), ...obj },
      { addQueryPrefix: true }
    );

    // If location.search is already same as new query params (happens
    // in the case of redirects to this page), don't update local storage
    // and don't push history
    if (location.search === newQueryParams) {
      return;
    }
    // Store query params in session storage so that they are saved
    // when the user returns to the page in the same session.
    sessionStorage.setItem('projectsPage', JSON.stringify(newQueryParams));

    // Push new query params for render update
    history.push({ search: newQueryParams });
  };

  const navigate = project => {
    history.push({
      pathname: `/project/${project._id}`
    });
  };

  const handleSmallWindow = () => {
    if (windowWidth <= breakpoints.xs) {
      if (state.display !== displayOptions.list) {
        updateQueryParam({ display: displayOptions.list });
      }
    }
  };

  // Fetch projects at start
  useEffect(() => {
    try {
      _getProjectsByUser(user._id);
    } catch (e) {
      // console.log("User Projects Fetch Error", user._id, e);
    }
  }, []);

  // If window size gets below xs, change query parameter 'display' to list
  useEffect(() => {
    handleSmallWindow();
  }, [windowWidth]);

  // Update query parameters when debounced search term is changed
  useEffect(() => {
    updateQueryParam(state);
  }, [debouncedSearchTerm]);

  // Update visible projects when projects or query params change
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      ...qs.parse(location.search, { ignoreQueryPrefix: true })
    }));
  }, [projects, location.search]);

  // Render methods
  const renderProjects = () => {
    if (_.isEmpty(projects)) {
      if (projectsPending) {
        // If no projects and still pending
        return 'Pending projects!';
      }
      // If finished pending but still no projects
      return 'No projects found.';
    }

    if (projectsError) {
      return projectsError.message;
    }

    const {
      filter: searchParam = state.filter,
      display: displayParam = state.display,
      sort: sortParam = state.sort
    } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const sortOption = sortOptions[sortParam];
    let visibleProjects = _(projects)
      .orderBy([sortOption.by], [sortOption.order])
      .value();
    if (!_.isEmpty(searchParam)) {
      visibleProjects = new Fuse(projects, fuseOptions).search(searchParam);
    }
    if (_.isEmpty(visibleProjects)) {
      return 'No projects with those criteria.';
    }
    return (
      <Fragment>
        {visibleProjects.map(project => (
          <ProjectCard
            project={project}
            key={project._id}
            setKey={project._id}
            display={displayParam}
            navigate={navigate}
          />
        ))}
      </Fragment>
    );
  };

  const renderControls = () => {
    const {
      display: displayParam = state.display,
      sort: sortParam = state.sort
    } = qs.parse(location.search, { ignoreQueryPrefix: true });
    return (
      <Fragment>
        <Dropdown
          name={'sort'}
          active={sortParam}
          options={sortOptions}
          selectCallback={updateQueryParam}
        />
        {windowWidth > breakpoints.xs && (
          <ToggleSwitch
            name={'display'}
            icons={{
              left: { name: displayOptions.grid, icon: <IoMdGrid /> },
              right: { name: displayOptions.list, icon: <IoMdList /> }
            }}
            active={displayParam}
            toggleCallback={updateQueryParam}
          />
        )}
        <AddProjectButton />
      </Fragment>
    );
  };

  // if user or token is empty, or user auth error, redirect to auth page
  if (!userPending && _.isEmpty(user)) {
    history.push({ pathname: '/auth' });
    return <Fragment>You are not logged in. Redirecting to login...</Fragment>;
  }

  return (
    <Fragment>
      <Navbar />
      {/* <div className="spacer"></div> */}
      <div className="body">
        <div className="box">
          <div className="toggles">{renderControls()}</div>
          <div className="search">
            <Input.Text
              type="text"
              name="filter"
              placeholder={'Search here for a project...'}
              value={state.filter}
              onChange={handleChange}
            />
          </div>
          <StyledProjects>{renderProjects()}</StyledProjects>
        </div>
      </div>
    </Fragment>
  );
};

const Projects = () => (
  <Flipped flipId="page">
    <Background>
      <Flipped inverseFlipId="page">
        <ProjectsBox />
      </Flipped>
    </Background>
  </Flipped>
);

export default Projects;
