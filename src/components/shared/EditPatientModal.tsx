import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreatePatientPayload, Patient } from "@/@types/patient";
import formatDateToYYYYMMDD from "@/utils/formatDateToYYYYMMDD";

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onPatientUpdated: (
    patientId: string,
    updatedData: Partial<CreatePatientPayload>
  ) => Promise<void>;
  error: string | null;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onPatientUpdated,
  error,
}) => {
  const [formData, setFormData] = useState<CreatePatientPayload>({
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: formatDateToYYYYMMDD(patient.dateOfBirth),
    phoneNumber: patient.phoneNumber,
    email: patient.email,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: formatDateToYYYYMMDD(patient.dateOfBirth),
        phoneNumber: patient.phoneNumber,
        email: patient.email,
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onPatientUpdated(patient.id, formData);
      onClose();
    } catch (err) {
      console.error("Error updating patient in modal:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать пациента</DialogTitle>
          <DialogDescription>
            Измените данные пациента и сохраните.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              Имя
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Фамилия
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateOfBirth" className="text-left">
              Дата рождения
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Телефон
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center col-span-full">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
