import { Suspense } from "react";
import { protectedRoutes /* publicRoutes */ } from "@/configs/routes.config";
import appConfig from "@/configs/app.config";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import AppRoute from "@/components/route/AppRoute";
import AuthorityGuard from "@/components/route/AuthorityGuard";

interface ViewsProps {}

type AllRoutesProps = ViewsProps;

const { authenticatedEntryPath } = appConfig;

const AllRoutes = (props: AllRoutesProps) => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route
          path="/"
          element={<Navigate replace to={authenticatedEntryPath} />}
        />
        {protectedRoutes.map((route, index) => {
          return (
            <Route
              key={route.key + index}
              path={route.path}
              element={
                <AuthorityGuard userAuthority={[]} authority={route.authority}>
                  <div>
                    <AppRoute
                      routeKey={route.key}
                      component={route.component}
                    />
                  </div>
                </AuthorityGuard>
              }
            />
          );
        })}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
      {/* <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AppRoute
                routeKey={route.key}
                component={route.component}
                {...route.meta}
              />
            }
          />
        ))}
      </Route> */}
    </Routes>
  );
};

const Views = (props: ViewsProps) => {
  return (
    <Suspense /* fallback={<Loading loading={true} />} */>
      <AllRoutes {...props} />
    </Suspense>
  );
};

export default Views;
