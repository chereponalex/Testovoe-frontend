import { Patient } from "@/@types/patient";

const formatCellValue = (key: keyof Patient, value: any): string => {
  if (key === "id") {
    return String(value).substring(0, 8) + "...";
  }
  if (key === "dateOfBirth" || key === "createdAt" || key === "updatedAt") {
    try {
      return new Date(value).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
};

export default formatCellValue;
