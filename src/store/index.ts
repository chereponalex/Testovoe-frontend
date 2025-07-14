import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { PatientSlice, createPatientSlice } from "./slices/patientSlice";
import { VisitSlice, createVisitSlice } from "./slices/visitSlice";

export type AppState = PatientSlice & VisitSlice;

export const useAppStore = create<AppState>()(
  devtools(
    (...a) => ({
      ...createPatientSlice(...a),
      ...createVisitSlice(...a),
    }),
    {
      name: "MyAppRootStore",
    }
  )
);
