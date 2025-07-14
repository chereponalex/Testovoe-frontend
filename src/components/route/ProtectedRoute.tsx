import appConfig from "@/configs/app.config";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const { unAuthenticatedEntryPath } = appConfig;

const ProtectedRoute = () => {
  const authenticated = true;
  const location = useLocation();

  if (!authenticated) {
    return <Navigate replace to={`/`} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
