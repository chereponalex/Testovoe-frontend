import { PatientDetail } from "@/@types/patient";
import { getPatientById } from "@/api/patient/getPatientById";
import { getAllVisitsByPatient } from "@/api/visit/getAllVisitsByPatient";
import { PatientDetailsCard } from "@/components/shared/PatientDetailsCard";
import { VisitsList } from "@/components/shared/VisitsList";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Visit } from "@/@types/visit";
import { Spinner } from "@/components/ui/spinner";

const PatientPage = () => {
  const [patientData, setPatientData] = useState<PatientDetail | null>(null);
  const [patientVisits, setPatientVisits] = useState<Visit[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  const fetchAllPatientData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (id) {
        const res = await getPatientById(id);
        if (res.data) {
          setPatientData(res.data);
          setPatientVisits(res.data.visits || []);
        }
      }
    } catch (e: any) {
      console.error("Не удалось загрузить все данные пациента", e);
      const errorMessage =
        e.response?.data?.message ||
        e.message ||
        "Не удалось загрузить данные пациента.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const refreshPatientVisits = useCallback(async () => {
    try {
      if (id) {
        const res = await getAllVisitsByPatient(id);
        if (res.data) {
          setPatientVisits(res.data);
        }
      }
    } catch (e: any) {
      console.error("Не удалось обновить визиты пациента", e);
    }
  }, [id]);

  useEffect(() => {
    fetchAllPatientData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 max-w-4xl mx-auto">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Alert variant="destructive" className="flex">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Ошибка!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center text-gray-500">
        Данные пациента не найдены.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Информация о пациенте
      </h1>
      <PatientDetailsCard
        patient={patientData}
        onPatientDataChanged={fetchAllPatientData}
      />
      <VisitsList
        visits={patientVisits}
        patientId={patientData.id}
        onVisitAdded={refreshPatientVisits}
        onVisitsRefreshed={refreshPatientVisits}
      />
    </div>
  );
};

export default PatientPage;
