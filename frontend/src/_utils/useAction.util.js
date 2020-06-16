import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

// https://blog.usejournal.com/new-react-redux-coding-style-with-hooks-without-selectors-5055d59ab753
const useAction = actionCreator => {
  const dispatch = useDispatch();
  const source = axios.CancelToken.source();
  const axiosOptions = { cancelToken: source.token };

  const action = useCallback(
    (...args) => dispatch(actionCreator(...args, axiosOptions)),
    [dispatch, actionCreator, axiosOptions]
  );
  const cleanupAction = () => source.cancel();

  return [action, cleanupAction];
};

export default useAction;
