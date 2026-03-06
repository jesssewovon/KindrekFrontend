import { useEffect } from "react";
import { useLocation  } from "react-router";

export function useBeforeRouteChange(
  callback: (location: any) => void
): void {
  const location = useLocation();

  useEffect(() => {
    callback(location);
  }, [location, callback]);
}