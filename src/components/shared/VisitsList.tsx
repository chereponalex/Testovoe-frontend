import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Visit, VisitStatus } from "@/@types/visit";
import { Button } from "../ui/button";
import { AddVisitModal } from "./AddVisitModal";
import { EditVisitModal } from "./EditVisitModal";
import { createNewVisit } from "@/api/visit/createNewVisit";
import { updateVisit } from "@/api/visit/updateVisit";
import { Pencil, Trash2 } from "lucide-react";
import { deleteVisit } from "@/api/visit/deleteVisit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Spinner } from "../ui/spinner";
import formatVisitDate from "@/utils/formatVisitDate";

interface VisitsListProps {
  visits: Visit[];
  patientId: string;
  onVisitAdded: () => Promise<void>;
  onVisitsRefreshed: () => Promise<void>;
}

const getStatusVariant = (status: VisitStatus) => {
  switch (status) {
    case VisitStatus.COMPLETED:
      return "default";
    case VisitStatus.SCHEDULED:
      return "secondary";
    case VisitStatus.CANCELED:
      return "destructive";
    default:
      return "outline";
  }
};

export const VisitsList: React.FC<VisitsListProps> = ({
  visits,
  patientId,
  onVisitAdded,
  onVisitsRefreshed,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addVisitError, setAddVisitError] = useState<string | null>(null);
  const [isAddingVisit, setIsAddingVisit] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<Visit | null>(null);
  const [editVisitError, setEditVisitError] = useState<string | null>(null);
  const [isDeletingVisitId, setIsDeletingVisitId] = useState<string | null>(
    null
  );

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    VisitStatus | "all"
  >("all");
  const [dateFilterInput, setDateFilterInput] = useState<string>("");

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setAddVisitError(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddVisit = useCallback(
    async (newVisitData: any, currentPatientId: string) => {
      setAddVisitError(null);
      setIsAddingVisit(true);
      try {
        const payload = {
          ...newVisitData,
          patientId: currentPatientId,
        };
        await createNewVisit(payload);
        await onVisitAdded();
        alert("Новый визит успешно добавлен!");
      } catch (err: any) {
        console.error("Ошибка при добавлении визита:", err);
        const errorDetail =
          err.response?.data?.message || err.message || "Неизвестная ошибка.";

        let userMessage = "Произошла ошибка при добавлении визита.";
        if (Array.isArray(errorDetail)) {
          userMessage = errorDetail.join(". ");
        } else if (typeof errorDetail === "string") {
          userMessage = errorDetail;
        }

        setAddVisitError(userMessage);
        throw new Error(userMessage);
      } finally {
        setIsAddingVisit(false);
      }
    },
    []
  );

  const handleEditVisit = useCallback((visit: Visit) => {
    setVisitToEdit(visit);
    setIsEditModalOpen(true);
    setEditVisitError(null);
  }, []);

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setVisitToEdit(null);
  };

  const handleUpdateVisit = useCallback(
    async (updatedVisitData: { id: string; [key: string]: any }) => {
      setEditVisitError(null);
      try {
        if (!updatedVisitData.id) {
          throw new Error("ID визита для обновления не найден.");
        }
        const visitId = updatedVisitData.id;
        const { id, ...dataToSend } = updatedVisitData;

        await updateVisit(dataToSend, visitId);
        alert("Визит успешно обновлен!");
        await onVisitsRefreshed();
      } catch (err: any) {
        console.error("Ошибка при обновлении визита:", err);
        const errorDetail =
          err.response?.data?.message || err.message || "Неизвестная ошибка.";
        let userMessage = "Произошла ошибка при обновлении визита.";
        if (Array.isArray(errorDetail)) {
          userMessage = errorDetail.join(". ");
        } else if (typeof errorDetail === "string") {
          userMessage = errorDetail;
        }
        setEditVisitError(userMessage);
        throw new Error(userMessage);
      }
    },
    [onVisitsRefreshed]
  );

  const handleDeleteVisit = useCallback(async (visitId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот визит?")) {
      setIsDeletingVisitId(visitId);
      try {
        await deleteVisit(visitId);
        await onVisitsRefreshed();
      } catch (err: any) {
        console.error("Ошибка при удалении визита:", err);
        alert(
          `Ошибка при удалении визита: ${
            err.response?.data?.message || err.message || "Неизвестная ошибка."
          }`
        );
      } finally {
        setIsDeletingVisitId(null);
      }
    }
  }, []);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilterInput(e.target.value);
  };

  const filteredVisits = visits.filter((visit) => {
    const matchesStatus =
      selectedStatusFilter === "all" || visit.status === selectedStatusFilter;

    let matchesDate = true;
    if (dateFilterInput) {
      const visitDateString = visit.visitDate.split("T")[0];
      matchesDate = visitDateString === dateFilterInput;
    }

    return matchesStatus && matchesDate;
  });

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">История визитов</h3>
        <div className="flex items-center space-x-4">
          <Input
            type="date"
            value={dateFilterInput}
            onChange={handleDateInputChange}
            className="w-[220px] cursor-pointer"
            title="Фильтр по дате визита"
          />

          <Select
            onValueChange={(value: VisitStatus | "all") =>
              setSelectedStatusFilter(value)
            }
            defaultValue="all"
          >
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value={VisitStatus.COMPLETED}>Завершён</SelectItem>
              <SelectItem value={VisitStatus.SCHEDULED}>
                Запланирован
              </SelectItem>
              <SelectItem value={VisitStatus.CANCELED}>Отменён</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="cursor-pointer"
            onClick={handleOpenAddModal}
            disabled={isAddingVisit}
          >
            {isAddingVisit ? <Spinner size="large" /> : null}
            Создать новый визит
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[150px]">
                Дата визита
              </TableHead>
              <TableHead className="text-center">Диагноз</TableHead>
              <TableHead className="text-center w-[120px]">Статус</TableHead>
              <TableHead className="text-center">Лечение</TableHead>
              <TableHead className="text-center w-[200px]">Заметки</TableHead>
              <TableHead className="text-center w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisits && filteredVisits.length > 0 ? (
              filteredVisits
                .sort(
                  (a, b) =>
                    new Date(b.visitDate).getTime() -
                    new Date(a.visitDate).getTime()
                )
                .map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="text-center">
                      {formatVisitDate(visit.visitDate)}
                    </TableCell>
                    <TableCell className="text-center">
                      {visit.diagnosis}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={getStatusVariant(visit.status)}
                        className="justify-center"
                      >
                        {visit.status === VisitStatus.COMPLETED
                          ? "Завершён"
                          : visit.status === VisitStatus.SCHEDULED
                          ? "Запланирован"
                          : "Отменён"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {visit.treatment}
                    </TableCell>
                    <TableCell className="text-center max-w-[200px] whitespace-normal">
                      {visit.notes || "Нет"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditVisit(visit)}
                          title="Редактировать визит"
                          className="hover:bg-blue-100 text-blue-600 cursor-pointer"
                          disabled={!!isDeletingVisitId}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteVisit(visit.id)}
                          title="Удалить визит"
                          className="hover:bg-red-100 text-red-600 cursor-pointer"
                          disabled={
                            isDeletingVisitId === visit.id || isAddingVisit
                          }
                        >
                          {isDeletingVisitId === visit.id ? (
                            <Spinner size="large" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-gray-500"
                >
                  {selectedStatusFilter !== "all" || dateFilterInput
                    ? "Нет визитов с выбранными критериями фильтрации."
                    : "У этого пациента пока нет визитов."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddVisitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        patientId={patientId}
        onVisitAdded={handleAddVisit}
        error={addVisitError}
      />

      <EditVisitModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        visitToEdit={visitToEdit}
        onVisitUpdated={handleUpdateVisit}
        error={editVisitError}
      />
    </div>
  );
};
