import { useEffect } from "react";
import _ from "lodash";

export default function useOutsideClick(refs, callback) {
  const refArray = _.isArray(refs) ? refs : [refs];

  const handleClick = e => {
    if (refArray.every(ref => ref.current && !ref.current.contains(e.target))) {
      if (callback) callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
}
