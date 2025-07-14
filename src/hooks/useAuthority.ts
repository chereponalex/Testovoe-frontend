import { useMemo } from "react";

function useAuthority(userAuthority: string[] = [], authority: string[] = []) {
  if (Array.isArray(authority) && authority.length === 0) {
    return true;
  }

  const roleMatched = useMemo(() => {
    return authority.some((role) => userAuthority.includes(role));
  }, [authority, userAuthority]);

  return roleMatched;
}

export default useAuthority;
