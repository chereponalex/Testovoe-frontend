import { StateCreator } from "zustand";
import { getAllPatients } from "@/api/patient/getAllPatients";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientSlice {
  patients: Patient[];
  isPatientsLoading: boolean;
  patientsError: string | null;
  currentPage: number;
  itemsPerPage: number;
  totalPatients: number;
  totalPages: number;
  searchQuery: string;

  fetchPatients: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
}

export const createPatientSlice: StateCreator<
  PatientSlice,
  [],
  [],
  PatientSlice
> = (set, get) => ({
  patients: [],
  isPatientsLoading: false,
  patientsError: null,
  currentPage: 1,
  itemsPerPage: 10,
  totalPatients: 0,
  totalPages: 0,
  searchQuery: "",

  fetchPatients: async (page, limit, search) => {
    const state = get();
    const actualPage = page !== undefined ? page : state.currentPage;
    const actualLimit = limit !== undefined ? limit : state.itemsPerPage;
    const actualSearch = search !== undefined ? search : state.searchQuery;

    set({ isPatientsLoading: true, patientsError: null });
    try {
      const response = await getAllPatients({
        page: actualPage,
        limit: actualLimit,
        search: actualSearch,
      });
      if (response.data) {
        set({
          patients: response.data.data,
          totalPatients: response.data.total,
          currentPage: response.data.page,
          itemsPerPage: response.data.limit,
          totalPages: response.data.totalPages,
          searchQuery: actualSearch,
        });
      }
    } catch (err: any) {
      console.error("Не удалось получить пациентов:", err);
      set({ patientsError: err.message || "Не удалось загрузить пациентов." });
    } finally {
      set({ isPatientsLoading: false });
    }
  },
  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    get().fetchPatients(page);
  },
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().fetchPatients(1, undefined, query);
  },
});
