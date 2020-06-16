import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
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
  getProjectsPendingAndError,
  getCreatedProject
} from '../../_selectors/projects.selectors';

import { Background, StyledProjects } from './Projects.style';
import Navbar from '../../components/Navbar';
import { Input } from '../../components/Form';
import ToggleSwitch from '../../components/Filters/ToggleSwitch';
import Dropdown from '../../components/Filters/Dropdown';
import AddProjectButton from './AddProjectButton';
import ProjectCard from './ProjectCard';

const ProjectsBox = () => {
  const isFirstRender = useRef(true);
  const windowWidth = useWindowWidth();
  const history = useHistory();
  const location = useLocation();
  const prevQueryParams = qs.parse(
    JSON.parse(sessionStorage.getItem('projectsPage')),
    { ignoreQueryPrefix: true }
  ); // get saved query params from session storage
  const [_getProjectsByUser, cleanupGetProjectsByUser] = useAction(
    getProjectsByUser
  );
  const { user } = useSelector(getCurrentUserAndToken);
  const { pending: userPending } = useSelector(getUsersPendingAndError);
  const { pending: projectsPending, error: projectsError } = useSelector(
    getProjectsPendingAndError
  );
  const fetchedProjects = useSelector(getProjects);
  const [projectsAndPending, setProjectsAndPending] = useState(fetchedProjects);
  const createdProject = useSelector(getCreatedProject);
  const [queryParams, setQueryParams] = useState({
    filter: prevQueryParams.filter || '',
    display:
      windowWidth <= breakpoints.xs
        ? displayOptions.list
        : prevQueryParams.display || displayOptions.grid,
    sort: prevQueryParams.sort || sortOptions.newestFirst.name,
    sizePerPage: prevQueryParams.sizePerPage || fetchedProjects?.length || 100
  });
  // Memoized visible projects
  const { visibleProjects, displayParam, sortParam } = useMemo(() => {
    const {
      filter: searchParam = queryParams.filter,
      display: _displayParam = queryParams.display,
      sort: _sortParam = queryParams.sort
    } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const sortOption = sortOptions[_sortParam];
    let _visibleProjects = _(projectsAndPending)
      .uniqBy('_id')
      .orderBy([sortOption.by], [sortOption.order])
      .value();
    if (!_.isEmpty(searchParam)) {
      _visibleProjects = new Fuse(projectsAndPending, fuseOptions).search(
        searchParam
      );
    }

    return {
      visibleProjects: _visibleProjects,
      displayParam: _displayParam,
      sortParam: _sortParam
    };
  }, [projectsAndPending, location.search]);
  const debouncedSearchTerm = useDebounce(queryParams.filter, 200);

  // Lifecycle methods
  const handleChange = e => {
    const { name, value } = e.target;
    setQueryParams(prevState => ({ ...prevState, [name]: value }));
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

  const navigate = newProject => {
    history.push({
      pathname: `/project/${newProject._id}`
    });
  };

  // Refresh projects. Use skeleton flipped element to trigger animation.
  useEffect(() => {
    const refreshProjects = async () => {
      if (_.isEmpty(createdProject)) {
        return;
      }

      // Set pending projects so that a skeleton can be rendered.
      setProjectsAndPending(prevProjects =>
        _.concat(
          [_.assign({}, createdProject, { pending: true })],
          prevProjects || []
        )
      );

      // Update projects redux state by fetching newest.
      await _getProjectsByUser(user._id);
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    refreshProjects();

    // return cleanupGetProjectsByUser;
  }, [createdProject?._id]);
  useEffect(() => {
    // update projectsAndPending once projects (with created project) are
    // finally fetched.
    setProjectsAndPending(fetchedProjects);
    updateQueryParam({ pending: createdProject?._id });
  }, [fetchedProjects]);

  // Fetch projects at start
  useEffect(() => {
    _getProjectsByUser(user._id);
    return cleanupGetProjectsByUser;
  }, []);

  // If window size gets below xs, change query parameter 'display' to list
  useEffect(() => {
    if (windowWidth <= breakpoints.xs) {
      if (queryParams.display !== displayOptions.list) {
        updateQueryParam({ display: displayOptions.list });
      }
    }
  }, [windowWidth]);

  // Update query parameters when debounced search term is changed
  useEffect(() => {
    updateQueryParam(queryParams);
  }, [debouncedSearchTerm]);

  // Render methods
  const renderProjects = useCallback(() => {
    if (_.isEmpty(visibleProjects)) {
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
    if (_.isEmpty(visibleProjects)) {
      return 'No projects with those criteria.';
    }
    return (
      <Fragment>
        {visibleProjects.map(p => (
          <ProjectCard
            project={p}
            key={p._id}
            setKey={p._id}
            display={displayParam}
            navigate={navigate}
            pending={p.pending}
          />
        ))}
      </Fragment>
    );
  }, [visibleProjects]);

  const renderControls = useCallback(() => {
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
  }, [sortParam, displayParam, windowWidth]);

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
              value={queryParams.filter}
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
