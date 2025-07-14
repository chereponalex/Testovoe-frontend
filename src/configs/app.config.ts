export type AppConfig = {
  apiPrefix: string;
  apiVersion1: string;
  BACKEND_URL: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  tourPath: string;
  enableMock: boolean;
};

const appConfig: AppConfig = {
  apiPrefix: "api",
  apiVersion1: "v1",
  BACKEND_URL: "http://localhost:3001",
  authenticatedEntryPath: `/`,
  unAuthenticatedEntryPath: "/",
  tourPath: "/",
  enableMock: false,
};

export default appConfig;
