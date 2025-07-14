import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { CreatePatientPayload, PatientDetail } from "@/@types/patient";
import { MdModeEditOutline } from "react-icons/md";
import { Button } from "../ui/button";
import { EditPatientModal } from "./EditPatientModal";
import { updatePatient } from "@/api/patient/updatePatient";
import formatDateTime from "@/utils/formatDateTime";

interface PatientDetailsCardProps {
  patient: PatientDetail;
  onPatientDataChanged: () => Promise<void>;
}

export const PatientDetailsCard: React.FC<PatientDetailsCardProps> = ({
  patient,
  onPatientDataChanged,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  if (!patient) {
    return null;
  }

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
    setEditError(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handlePatientUpdated = useCallback(
    async (patientId: string, updatedData: Partial<CreatePatientPayload>) => {
      setEditError(null);
      try {
        await updatePatient(updatedData, patientId);
        await onPatientDataChanged();
        alert("Данные пациента успешно обновлены!");
      } catch (err: any) {
        console.error("Ошибка при обновлении пациента:", err);
        const errorDetail =
          err.response?.data?.message || err.message || "Неизвестная ошибка.";

        let userMessage = "Произошла ошибка при обновлении пациента.";
        if (Array.isArray(errorDetail)) {
          userMessage = errorDetail.join(". ");
        } else if (typeof errorDetail === "string") {
          userMessage = errorDetail;
        }
        setEditError(userMessage);
        throw new Error(userMessage);
      }
    },
    []
  );

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <div className="relative">
          <div>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              {patient.firstName} {patient.lastName}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Детали пациента
            </CardDescription>
          </div>
          <Button
            className="cursor-pointer absolute top-[0] right-[0]"
            variant="ghost"
            size="icon"
            onClick={handleOpenEditModal}
            aria-label={`Редактировать пациента ${patient.firstName} ${patient.lastName}`}
          >
            <MdModeEditOutline className="h-5 w-5" />{" "}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-500">ID:</span>
          <span className="text-base break-all">{patient.id}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-500">Email:</span>
          <span className="text-base">{patient.email}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-500">
            Номер телефона:
          </span>
          <span className="text-base">{patient.phoneNumber}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-500">
            Дата рождения:
          </span>
          <span className="text-base">
            {formatDateTime(patient.dateOfBirth)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-500">
            Дата регистрации:
          </span>
          <span className="text-base">{formatDateTime(patient.createdAt)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-500">
            Последнее обновление:
          </span>
          <span className="text-base">{formatDateTime(patient.updatedAt)}</span>
        </div>
      </CardContent>

      {patient && (
        <EditPatientModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          patient={patient}
          onPatientUpdated={handlePatientUpdated}
          error={editError}
        />
      )}
    </Card>
  );
};
