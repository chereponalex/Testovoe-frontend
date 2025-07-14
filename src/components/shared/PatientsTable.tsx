import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { FiEye } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AddPatientModal } from "./AddPatientModal";
import { MdDeleteSweep } from "react-icons/md";
import { createNewPatient } from "@/api/patient/createNewPatient";
import { deletePatient } from "@/api/patient/deletePatient";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { Patient, CreatePatientPayload } from "@/@types/patient";
import formatCellValue from "@/utils/formatCellValue";

interface PatientsTableProps {
  data: Patient[];
  loading: boolean;
  error: string | null;
  refetchPatients: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>;
  currentPage: number;
  itemsPerPage: number;
  totalPatients: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type PatientColumnKey = keyof Patient | "actions";

const COLUMN_HEADERS_MAP: Record<PatientColumnKey, string> = {
  id: "ID",
  firstName: "Имя",
  lastName: "Фамилия",
  dateOfBirth: "Дата рождения",
  phoneNumber: "Телефон",
  email: "Email",
  createdAt: "Создано",
  updatedAt: "Обновлено",
  actions: "Действия",
};

export function PatientsTable({
  data,
  loading,
  error,
  refetchPatients,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  searchQuery,
  onSearchChange,
}: PatientsTableProps) {
  const navigate = useNavigate();
  const [modalError, setModalError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [localSearchInput, setLocalSearchInput] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchInput(searchQuery);
  }, [searchQuery]);

  const currentTableData = data || [];

  const columnKeys = useMemo<PatientColumnKey[]>(() => {
    if (data && data.length > 0) {
      const baseKeys: PatientColumnKey[] = (
        Object.keys(data[0]) as (keyof Patient)[]
      ).filter((key) => key in COLUMN_HEADERS_MAP);
      return [...baseKeys, "actions"];
    }
    return ["id", "firstName", "lastName", "email", "phoneNumber", "actions"];
  }, [data]);

  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const handleDeletePatient = useCallback(
    async (patientId: string) => {
      setDeleteError(null);
      if (
        window.confirm(
          "Вы уверены, что хотите удалить этого пациента? Это также удалит все связанные визиты."
        )
      ) {
        try {
          await deletePatient(patientId);
          await refetchPatients(1, itemsPerPage, searchQuery);
          alert("Пациент успешно удален!");
        } catch (err: any) {
          console.error("Ошибка при удалении пациента:", err);
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Неизвестная ошибка при удалении пациента.";
          setDeleteError(errorMessage);
        }
      }
    },
    [currentPage, itemsPerPage, searchQuery]
  );

  const handleAddPatientClick = () => {
    setIsModalOpen(true);
    setModalError(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateNewPatient = useCallback(
    async (patientData: CreatePatientPayload) => {
      setModalError(null);
      try {
        await createNewPatient(patientData);
        await refetchPatients(1, itemsPerPage, searchQuery);
        alert("Пациент успешно добавлен!");
        return Promise.resolve();
      } catch (err: any) {
        console.error("Ошибка при добавлении нового пациента:", err);
        const errorDetail =
          err.response?.data?.message || err.message || "Неизвестная ошибка.";
        let userMessage = "Произошла ошибка при добавлении пациента.";
        if (Array.isArray(errorDetail)) {
          userMessage = errorDetail.join(". ");
        } else if (typeof errorDetail === "string") {
          userMessage = errorDetail;
        }
        setModalError(userMessage);
        throw new Error(userMessage);
      }
    },
    [itemsPerPage, searchQuery]
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchInput(e.target.value);
  };

  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onSearchChange(value);
      }, 500);
    };
  }, []);

  useEffect(() => {
    debouncedSearch(localSearchInput);
    return () => {};
  }, [localSearchInput]);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-prev">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-next">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="p-4 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Список пациентов</h2>
        <Input
          className="max-w-[250px]"
          placeholder="Поиск по имени или фамилии"
          value={localSearchInput}
          onChange={handleSearchInputChange}
        />
        <Button className="cursor-pointer" onClick={handleAddPatientClick}>
          Добавить нового пациента
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Spinner size="large" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Ошибка!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columnKeys.map((key) => (
                  <TableHead key={key} className="text-center">
                    {COLUMN_HEADERS_MAP[key]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTableData.length > 0 ? (
                currentTableData.map((patient: Patient) => (
                  <TableRow key={patient.id}>
                    {columnKeys.map((key) => (
                      <TableCell
                        key={`${patient.id}-${key}`}
                        className="text-center"
                      >
                        {key === "actions" ? (
                          <div className="flex justify-center space-x-2">
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePatient(patient.id)}
                              aria-label={`Удалить пациента ${patient.firstName} ${patient.lastName}`}
                            >
                              <MdDeleteSweep className="h-4 w-4" />
                            </Button>
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewPatient(patient.id)}
                              aria-label={`Посмотреть пациента ${patient.firstName} ${patient.lastName}`}
                            >
                              <FiEye className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          formatCellValue(
                            key as keyof Patient,
                            patient[key as keyof Patient]
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnKeys.length}
                    className="h-24 text-center text-gray-500"
                  >
                    {searchQuery ? (
                      "Пациенты по вашему запросу не найдены."
                    ) : (
                      <Spinner size="large" />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && !error && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {deleteError && (
        <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Ошибка удаления!</AlertTitle>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onPatientAdded={handleCreateNewPatient}
        error={modalError}
      />
    </div>
  );
}
