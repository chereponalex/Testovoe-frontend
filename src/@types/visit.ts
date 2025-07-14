export enum VisitStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export interface Visit {
  id: string;
  patientId: string;
  visitDate: string;
  diagnosis: string;
  status: VisitStatus;
  treatment: string;
  notes?: string;
}
