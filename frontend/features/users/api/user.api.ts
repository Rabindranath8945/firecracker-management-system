import api from "@/lib/api";

export const userApi = {
  getMe() {
    return api.get("/users/me");
  },

  getEmployees() {
    return api.get("/users/employees");
  },

  getEmployee(id: string) {
    return api.get(`/users/employees/${id}`);
  },

  createEmployee(data: unknown) {
    return api.post("/users/employees", data);
  },

  updateEmployee(id: string, data: unknown) {
    return api.put(`/users/employees/${id}`, data);
  },

  toggleEmployeeStatus(id: string) {
    return api.patch(`/users/employees/${id}/status`);
  },

  deleteEmployee(id: string) {
    return api.delete(`/users/employees/${id}`);
  },

  updateAppLock(enabled: boolean) {
    return api.patch("/users/me/app-lock", {
      enabled,
    });
  },

  setCurrentBusiness(businessId: string) {
    return api.patch("/users/me/business", {
      businessId,
    });
  },

  completeOnboarding() {
    return api.patch("/users/me/onboarding");
  },
};
