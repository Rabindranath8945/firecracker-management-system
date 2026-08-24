import api from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface AboutApplication {
  appName: string;
  version: string;
  environment: string;
  framework: string;
  database: string;
}

export interface AboutDeveloper {
  name: string;
  company: string;
  email: string;
  mobile: string;
  location: string;
  website: string;
}

export interface AboutStatus {
  database: "connected" | "disconnected" | "unknown";
  application: "healthy" | "unhealthy" | "unknown";
  license: "active" | "inactive" | "unknown";
  updates: "latest" | "available" | "unknown";
}

export interface AboutData {
  application: AboutApplication;
  developer: AboutDeveloper;
  status: AboutStatus;
}

interface AboutResponse {
  success: boolean;
  message: string;
  data: AboutData;
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

class AboutService {
  async getAbout(): Promise<AboutData> {
    const response = await api.get<AboutResponse>("/settings/about");

    return response.data.data;
  }

  async getSystemStatus(): Promise<AboutStatus> {
    const response = await api.get<AboutResponse>("/settings/about/status");

    return response.data.data.status;
  }
}

export const aboutService = new AboutService();
