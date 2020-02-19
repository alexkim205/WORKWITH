import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import _ from "lodash";
import qs from "qs";
import { Flipped } from "react-flip-toolkit";
import Fuse from "fuse.js";
import {
  IoMdGrid,
  IoMdList,
  IoMdCalendar,
  IoIosArrowRoundDown,
  IoIosArrowRoundUp
} from "react-icons/io";

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
import { Background, StyledProjects } from "./Projects.style";
import { LinkButton } from "../../components/Button";
import { Input } from "../../components/Form";
import ToggleSwitch from "../../components/ToggleSwitch";
import ProjectCard from "./ProjectCard";

const ProjectsBox = () => {
  const windowWidth = useWindowWidth();
  const [state, setState] = useState({
    filter: "",
    display: windowWidth <= breakpoints.xs ? "list" : "grid", // grid or list
    sort: "createdAt" // ["createdAt", "updatedAt"]
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

  const handleSmallWindow = () => {
    if (windowWidth <= breakpoints.xs) {
      if (state.display !== "list") {
        updateQueryParam({ display: "list" });
      }
    }
  };

  // Fetch projects at start and set display if window is small
  useEffect(() => {
    // console.log("Project Page", user, token, projects, pending, error);
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
    // console.log("VISIBLE", pending, error);
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
      filter: searchParam,
      display: displayParam,
      sort: sortParam
    } = qs.parse(location.search.replace("?", ""));
    let visibleProjects = _(projects)
      .sortBy(project => new Date(project[sortParam]))
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
          />
        ))}
      </Fragment>
    );
  };

  const renderControls = () => {
    const { display: displayParam, sort: sortParam } = qs.parse(
      location.search.replace("?", "")
    );
    return (
      <Fragment>
        <div>
          <ToggleSwitch.Icon
            active={sortParam === "createdAt"}
            onClick={() => updateQueryParam({ sort: "createdAt" })}
          >
            <IoMdCalendar />
            <IoIosArrowRoundUp />
          </ToggleSwitch.Icon>
          <ToggleSwitch.Icon
            active={sortParam === "updatedAt"}
            onClick={() => updateQueryParam({ sort: "updatedAt" })}
          >
            <IoMdCalendar />
            <IoIosArrowRoundDown />
          </ToggleSwitch.Icon>
        </div>
        <div>
          <ToggleSwitch.Icon
            active={displayParam === "list"}
            onClick={() => updateQueryParam({ display: "list" })}
          >
            <IoMdList />
          </ToggleSwitch.Icon>
          <ToggleSwitch.Icon
            active={displayParam === "grid"}
            onClick={() => updateQueryParam({ display: "grid" })}
          >
            <IoMdGrid />
          </ToggleSwitch.Icon>
        </div>
      </Fragment>
    );
  };

  return (
    <Flipped inverseFlipId="page">
      <Fragment>
        <div className="header">
          <div>Logo</div>
          <div style={{ flex: 1 }}>Flex</div>
          <LinkButton onClick={() => history.push({ pathname: `/auth` })}>
            Logout
          </LinkButton>
        </div>
        <div className="spacer"></div>
        <div className="body">
          <div className="box">
            {/* {windowWidth} */}
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
