import React, { Suspense } from "react";
import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import RootPage from "@/views/RootPage/RootPage";
import { Spinner } from "./components/ui/spinner";
import PatientPage from "./views/PatientPage";

const PatientsPage = React.lazy(() => import("@/views/PatientsPage"));
const ContactsPage = React.lazy(() => import("@/views/ContactsPage"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/patients" replace />,
      },
      {
        path: "patients",
        element: (
          <Suspense
            fallback={
              <div>
                <Spinner size="large"/>
              </div>
            }
          >
            <PatientsPage />
          </Suspense>
        ),
      },
      {
        path: "contacts",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ContactsPage />
          </Suspense>
        ),
      },
      {
        path: "patients/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PatientPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/patients" replace />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<div>FALLBACK ELEMENT</div>}
    />
  );
}

export default App;
