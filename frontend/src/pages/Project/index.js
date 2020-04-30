/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Flipped } from 'react-flip-toolkit';
import _ from 'lodash';
import qs from 'qs';
import { IoMdArrowBack } from 'react-icons/io';

import useAction from '../../_utils/useAction.util';
import useDebounce from '../../_utils/useDebounce.util';
import useWindowWidth from '../../_utils/useWindowWidth.util';
import { breakpoints } from '../../_constants/theme.constants';
import { getProject } from '../../_actions/projects.actions';
import {
  getProject as getProjectSelector,
  getProjectsPendingAndError
} from '../../_selectors/projects.selectors';
import {
  noteTypeOptions,
  privacyOptions,
  sortOptions
} from './Project.options';
import { Background, onComplete, onStart } from './Project.style';

const ProjectBox = () => {
  const history = useHistory();
  const location = useLocation();
  const prevQueryParams = qs.parse(
    JSON.parse(sessionStorage.getItem('projectPage')),
    { ignoreQueryPrefix: true }
  ); // get saved query params from session storage
  const { id: projectId } = useParams();
  const _getProject = useAction(getProject);
  const { pending: projectPending, error: projectError } = useSelector(
    getProjectsPendingAndError
  );
  const project = useSelector(getProjectSelector);
  const [state, setState] = useState({
    filter: prevQueryParams.filter || '',
    tags: prevQueryParams.tags || [],
    types: prevQueryParams.types || noteTypeOptions.text,
    private: prevQueryParams.private || privacyOptions.public,
    sort: prevQueryParams.sort || sortOptions.newestFirst
  });
  const debouncedSearchTerm = useDebounce(state.filter, 200);

  useEffect(() => {
    try {
      _getProject(projectId);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Project Fetch Error', projectId, e);
    }
  }, []);

  // Lifecycle methods
  const handleChange = e => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const updateQueryParam = obj => {
    const newQueryParams = qs.stringify(
      {
        ...qs.parse(location.search, { ignoreQueryPrefix: true }),
        ...obj
      },
      { addQueryPrefix: true }
    );
    // Store query params in session storage so that they are saved
    // when the user returns to the page in the same session.
    sessionStorage.setItem('projectPage', JSON.stringify(newQueryParams));

    // Push new query params for render update
    history.push({ search: newQueryParams });
  };

  const navigateBack = () => {
    history.push({
      pathname: '/projects'
    });
  };

  // Render methods
  // eslint-disable-next-line consistent-return
  const renderProject = () => {
    if (projectPending) {
      return 'Pending project!';
    }
    if (projectError) {
      return projectError.message;
    }
    if (_.isEmpty(project)) {
      return `Project ${projectId} not found.`;
    }
  };

  return (
    <Fragment>
      <div className="header">
        <Link
          to={{
            pathname: '/projects',
            search: JSON.parse(sessionStorage.getItem('projectsPage'))
          }}
        >
          <IoMdArrowBack />
        </Link>
        {renderProject()}
      </div>
    </Fragment>
  );
};

ProjectBox.propTypes = {
  backgroundRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]) // Prop type for reference
};

const Project = () => {
  const { id: projectId } = useParams();
  const backgroundRef = useRef(null);

  return (
    <Flipped flipId={projectId} onComplete={onComplete} onStart={onStart}>
      <Background ref={backgroundRef}>
        <Flipped inverseFlipId={projectId}>
          <ProjectBox backgroundRef={backgroundRef} />
        </Flipped>
      </Background>
    </Flipped>
  );
};

export default Project;
