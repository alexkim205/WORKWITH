import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

// https://blog.usejournal.com/new-react-redux-coding-style-with-hooks-without-selectors-5055d59ab753
const useAction = actionCreator => {
  const dispatch = useDispatch();
  return useCallback((...args) => dispatch(actionCreator(...args)), [dispatch]);
};

export default useAction;
