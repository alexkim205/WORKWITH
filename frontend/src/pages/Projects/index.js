import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import _ from "lodash";
import qs from "qs";
import { Flipped } from "react-flip-toolkit";
import Fuse from "fuse.js";
import { IoMdGrid, IoMdList } from "react-icons/io";

import fuseOptions from "../../_config/fuse.config";
import useAction from "../../_utils/useAction.util";
import useDebounce from "../../_utils/useDebounce.util";
import useWindowWidth from "../../_utils/useWindowWidth.util";
import { breakpoints } from "../../_constants/theme.constants";
import { getProjectsByUser } from "../../_actions/projects.actions";
import { getCurrentUserAndToken } from "../../_selectors/users.selectors";
import {
  getProjects,
  getProjectsPendingAndError
} from "../../_selectors/projects.selectors";
import { sortOptions, displayOptions } from "./Projects.options";
import { Background, StyledProjects } from "./Projects.style";
import Navbar from "../../components/Navbar";
import { Input } from "../../components/Form";
import ToggleSwitch from "../../components/Filters/ToggleSwitch";
import Dropdown from "../../components/Filters/Dropdown";
import ProjectCard from "./ProjectCard";

const ProjectsBox = () => {
  const windowWidth = useWindowWidth();
  const [state, setState] = useState({
    filter: "",
    display:
      windowWidth <= breakpoints.xs ? displayOptions.list : displayOptions.grid,
    sort: sortOptions[0].name
  });
  const history = useHistory();
  const location = useLocation();
  const _getProjectsByUser = useAction(getProjectsByUser);
  const { user, token } = useSelector(getCurrentUserAndToken);
  const { pending, error } = useSelector(getProjectsPendingAndError);
  const projects = useSelector(getProjects);
  const debouncedSearchTerm = useDebounce(state.filter, 200);

  // Lifecycle methods
  const handleChange = e => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const updateQueryParam = obj => {
    history.push({
      search: `?${qs.stringify({
        ...qs.parse(location.search.replace("?", "")),
        ...obj
      })}`
    });
  };

  const navigate = project => {
    history.push({
      pathname: `/project/${project._id}`
      // search: location.search
    });
  };

  const handleSmallWindow = () => {
    if (windowWidth <= breakpoints.xs) {
      if (state.display !== displayOptions.list) {
        updateQueryParam({ display: displayOptions.list });
      }
    }
  };

  // Fetch projects at start and set display if window is small
  useEffect(() => {
    if (_.isEmpty(user) || _.isEmpty(token)) {
      history.push({ pathname: `/auth` });
      return;
    }
    try {
      _getProjectsByUser(user._id);
    } catch (e) {
      // console.log(e);
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
      ...qs.parse(location.search.replace("?", ""))
    }));
  }, [projects, location.search]);

  // Render methods
  const renderProjects = () => {
    if (pending) {
      return `Pending projects!`;
    }
    if (error) {
      return error.message;
    }
    if (_.isEmpty(projects)) {
      return `No projects found`;
    }

    const {
      filter: searchParam = state.filter,
      display: displayParam = state.display,
      sort: sortParam = state.sort
    } = qs.parse(location.search.replace("?", ""));
    const sortOption = _.find(sortOptions, ["name", sortParam]);
    let visibleProjects = _(projects)
      .orderBy([sortOption.by], [sortOption.order])
      .value();
    if (!_.isEmpty(searchParam)) {
      visibleProjects = new Fuse(projects, fuseOptions).search(searchParam);
    }
    if (_.isEmpty(visibleProjects)) {
      return `No projects with those criteria.`;
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
    } = qs.parse(location.search.replace("?", ""));
    return (
      <Fragment>
        <Dropdown
          name={"sort"}
          active={sortParam}
          options={sortOptions}
          selectCallback={updateQueryParam}
        />
        {windowWidth > breakpoints.xs && (
          <ToggleSwitch
            name={"display"}
            icons={{
              left: { name: displayOptions.grid, icon: <IoMdGrid /> },
              right: { name: displayOptions.list, icon: <IoMdList /> }
            }}
            active={displayParam}
            toggleCallback={updateQueryParam}
          />
        )}
      </Fragment>
    );
  };

  return (
    <Flipped inverseFlipId="page">
      <Fragment>
        <Navbar />
        <div className="spacer"></div>
        <div className="body">
          <div className="box">
            <div className="toggles">{renderControls()}</div>
            <div className="search">
              <Input.Text
                type="text"
                name="filter"
                placeholder={"Search here for a project..."}
                value={state.filter}
                onChange={handleChange}
              />
            </div>
            <StyledProjects>{renderProjects()}</StyledProjects>
          </div>
        </div>
      </Fragment>
    </Flipped>
  );
};

const Projects = () => (
  <Background>
    <ProjectsBox />
  </Background>
);

export default Projects;
