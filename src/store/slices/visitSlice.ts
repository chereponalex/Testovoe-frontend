import { StateCreator } from "zustand";
interface Visit {
  id: string;
  patientId: string;
  visitDate: string;
  reason: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitSlice {
  visits: Visit[];
  isVisitsLoading: boolean;
  visitsError: string | null;
  fetchVisits: () => Promise<void>;
}

export const createVisitSlice: StateCreator<VisitSlice, [], [], VisitSlice> = (
  set
) => ({
  visits: [],
  isVisitsLoading: false,
  visitsError: null,

  fetchVisits: async () => {
    set({ isVisitsLoading: true, visitsError: null });
    try {
      const response = await new Promise<any>((resolve) =>
        setTimeout(() => resolve({ data: [] }), 500)
      );
      if (response.data) {
        set({ visits: response.data });
      }
    } catch (err: any) {
      console.error("Failed to fetch visits:", err);
      set({ visitsError: err.message || "Failed to load visits." });
    } finally {
      set({ isVisitsLoading: false });
    }
  },
});
