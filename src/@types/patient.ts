import { Visit } from "./visit";

export interface PatientDetail {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  visits: Visit[];
}

export interface CreatePatientPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
