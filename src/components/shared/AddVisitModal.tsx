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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VisitStatus } from "@/@types/visit";
import getCurrentDateTimeLocal from "@/utils/currentDatetoLocal";

interface VisitFormData {
  visitDate: string;
  diagnosis: string;
  status: VisitStatus;
  treatment: string;
  notes?: string;
}

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onVisitAdded: (
    newVisitData: VisitFormData,
    patientId: string
  ) => Promise<void>;
  error: string | null;
}

export const AddVisitModal: React.FC<AddVisitModalProps> = ({
  isOpen,
  onClose,
  patientId,
  onVisitAdded,
  error,
}) => {
  const [formData, setFormData] = useState<VisitFormData>({
    visitDate: "",
    diagnosis: "",
    status: VisitStatus.SCHEDULED,
    treatment: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDateTime, setMinDateTime] = useState<string>("");
  const [localValidationError, setLocalValidationError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        visitDate: "",
        diagnosis: "",
        status: VisitStatus.SCHEDULED,
        treatment: "",
        notes: "",
      });
      setMinDateTime("");
      setLocalValidationError(null);
    } else {
      const currentFormattedDateTime = getCurrentDateTimeLocal();
      setMinDateTime(currentFormattedDateTime);
      setFormData((prev) => ({ ...prev, visitDate: currentFormattedDateTime }));
      setLocalValidationError(null);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (id === "visitDate") {
      const selectedDate = new Date(value);
      const currentMoment = new Date(getCurrentDateTimeLocal());

      if (selectedDate < currentMoment) {
        setLocalValidationError(
          "Время визита не может быть в прошлом. Выберите будущее время."
        );
      } else {
        setLocalValidationError(null);
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: VisitStatus) => {
    setFormData((prevData) => ({
      ...prevData,
      status: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalValidationError(null);

    const selectedDate = new Date(formData.visitDate);
    const currentMoment = new Date(getCurrentDateTimeLocal());

    if (selectedDate < currentMoment) {
      setLocalValidationError(
        "Время визита не может быть в прошлом. Выберите будущее время."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await onVisitAdded(formData, patientId);
      onClose();
    } catch (err) {
      console.error("Ошибка при добавлении визита в модалке:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = error || localValidationError;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Создать новый визит</DialogTitle>
          <DialogDescription>
            Заполните данные для нового визита пациента.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="visitDate" className="text-right">
              Дата и время
            </Label>
            <Input
              id="visitDate"
              type="datetime-local"
              value={formData.visitDate}
              onChange={handleChange}
              className="col-span-3"
              min={minDateTime}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="diagnosis" className="text-right">
              Диагноз
            </Label>
            <Input
              id="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Статус
            </Label>
            <Select value={formData.status} onValueChange={handleSelectChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VisitStatus.SCHEDULED}>
                  Запланирован
                </SelectItem>
                <SelectItem value={VisitStatus.COMPLETED}>Завершён</SelectItem>
                <SelectItem value={VisitStatus.CANCELED}>Отменён</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="treatment" className="text-right">
              Лечение
            </Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Заметки
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Дополнительные заметки (необязательно)"
            />
          </div>

          {displayError && (
            <p className="text-red-500 text-sm text-center col-span-full">
              {displayError}
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
              disabled={isSubmitting || !!localValidationError}
            >
              {isSubmitting ? "Сохранение..." : "Создать визит"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
