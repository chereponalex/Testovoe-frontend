import { PatientsTable } from "@/components/shared/PatientsTable";
import { useAppStore } from "@/store";
import React from "react";

const PatientsPage: React.FC = () => {
  const patients = useAppStore((state) => state.patients);
  const isLoading = useAppStore((state) => state.isPatientsLoading);
  const error = useAppStore((state) => state.patientsError);
  const currentPage = useAppStore((state) => state.currentPage);
  const itemsPerPage = useAppStore((state) => state.itemsPerPage);
  const totalPatients = useAppStore((state) => state.totalPatients);
  const totalPages = useAppStore((state) => state.totalPages);
  const searchQuery = useAppStore((state) => state.searchQuery);

  const fetchPatients = useAppStore((state) => state.fetchPatients);
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  return (
    <div>
      <PatientsTable
        data={patients}
        loading={isLoading}
        error={error}
        refetchPatients={fetchPatients}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPatients={totalPatients}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
};

export default PatientsPage;
