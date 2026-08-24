import api from "@/lib/api";

import {
  getCustomers as getOfflineCustomers,
  getCustomerById as getOfflineCustomerById,
  saveCustomers,
  deleteCustomer as deleteOfflineCustomer,
} from "@/libs/offline/store/offline.storage";

import { addToSyncQueue } from "@/libs/offline/sync/sync.queue";

import type {
  Customer,
  CustomerFormData,
  CustomerListResponse,
} from "../types/customer";

/* -------------------------------------------------------------------------- */
/* QUERY PARAMETERS                                                           */
/* -------------------------------------------------------------------------- */

export interface GetCustomersParams {
  search?: string;
  status?: "ALL" | "ACTIVE" | "INACTIVE";
  sort?: string;
  page?: number;
  limit?: number;
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

function createOfflineId(): string {
  return `offline-customer-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function createOfflineCustomer(payload: CustomerFormData): Customer {
  const now = new Date().toISOString();

  return {
    _id: createOfflineId(),

    customerCode: `OFF-${Date.now()}`,

    name: payload.name,

    mobile: payload.mobile,

    type: payload.type,

    openingBalance: payload.openingBalance ?? 0,

    creditLimit: 0,

    notes: "",

    isActive: payload.isActive ?? true,

    createdAt: now,

    updatedAt: now,

    ...(payload.email
      ? {
          email: payload.email,
        }
      : {}),

    ...(payload.address
      ? {
          address: payload.address,
        }
      : {}),

    ...(payload.gstNo
      ? {
          gstNo: payload.gstNo,
        }
      : {}),
  };
}

/* -------------------------------------------------------------------------- */
/* LOCAL FILTERING                                                            */
/* -------------------------------------------------------------------------- */

function filterOfflineCustomers(
  customers: Customer[],
  params: GetCustomersParams,
): Customer[] {
  const search = params.search?.trim().toLowerCase() ?? "";

  let result = [...customers];

  /* Search */

  if (search) {
    result = result.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(search) ||
        customer.customerCode.toLowerCase().includes(search) ||
        customer.mobile.toLowerCase().includes(search)
      );
    });
  }

  /* Status */

  if (params.status === "ACTIVE") {
    result = result.filter((customer) => customer.isActive);
  }

  if (params.status === "INACTIVE") {
    result = result.filter((customer) => !customer.isActive);
  }

  /* Sort */

  switch (params.sort) {
    case "NAME_DESC":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "NEWEST":
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;

    case "OLDEST":
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      break;

    default:
      result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

class CustomerService {
  /* ---------------------------------------------------------------------- */
  /* GET ALL CUSTOMERS                                                      */
  /* ---------------------------------------------------------------------- */

  async getCustomers(
    params: GetCustomersParams = {},
  ): Promise<CustomerListResponse> {
    /* -------------------------------------------------------------------- */
    /* OFFLINE                                                               */
    /* -------------------------------------------------------------------- */

    if (isOffline()) {
      const customers = await getOfflineCustomers();

      const filtered = filterOfflineCustomers(customers, params);

      const page = params.page ?? 1;
      const limit = params.limit ?? 20;

      const total = filtered.length;

      const start = (page - 1) * limit;

      const items = filtered.slice(start, start + limit);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
          hasNextPage: start + limit < total,
          hasPreviousPage: page > 1,
        },
      };
    }

    /* -------------------------------------------------------------------- */
    /* ONLINE                                                                */
    /* -------------------------------------------------------------------- */

    const response = await api.get("/customers", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,

        search:
          params.search && params.search.trim().length > 0
            ? params.search.trim()
            : undefined,

        isActive:
          params.status === undefined || params.status === "ALL"
            ? undefined
            : params.status === "ACTIVE",

        sort:
          params.sort && params.sort !== "NAME_ASC" ? params.sort : undefined,
      },
    });

    const data = response.data.data as CustomerListResponse;

    /*
     * Keep SQLite updated whenever
     * fresh server data arrives.
     */
    await saveCustomers(data.items);

    return data;
  }

  /* ---------------------------------------------------------------------- */
  /* GET CUSTOMER BY ID                                                     */
  /* ---------------------------------------------------------------------- */

  async getCustomer(id: string): Promise<Customer> {
    if (isOffline()) {
      const customer = await getOfflineCustomerById(id);

      if (!customer) {
        throw new Error("Customer not found offline.");
      }

      return customer;
    }

    const response = await api.get(`/customers/${id}`);

    const customer = response.data.data as Customer;

    await saveCustomers([customer]);

    return customer;
  }

  /* ---------------------------------------------------------------------- */
  /* CREATE CUSTOMER                                                        */
  /* ---------------------------------------------------------------------- */

  async createCustomer(payload: CustomerFormData): Promise<Customer> {
    /* -------------------------------------------------------------------- */
    /* OFFLINE                                                               */
    /* -------------------------------------------------------------------- */

    if (isOffline()) {
      const customer = createOfflineCustomer(payload);

      await saveCustomers([customer]);

      await addToSyncQueue("CUSTOMER", "CREATE", payload, customer._id);

      return customer;
    }

    /* -------------------------------------------------------------------- */
    /* ONLINE                                                                */
    /* -------------------------------------------------------------------- */

    try {
      const response = await api.post("/customers", payload);

      const customer = response.data.data as Customer;

      await saveCustomers([customer]);

      return customer;
    } catch (error) {
      /*
       * If the network disappears between
       * navigator.onLine and the request,
       * save the customer locally instead.
       */

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        const customer = createOfflineCustomer(payload);

        await saveCustomers([customer]);

        await addToSyncQueue("CUSTOMER", "CREATE", payload, customer._id);

        return customer;
      }

      throw error;
    }
  }

  /* ---------------------------------------------------------------------- */
  /* UPDATE CUSTOMER                                                        */
  /* ---------------------------------------------------------------------- */

  async updateCustomer(
    id: string,
    payload: CustomerFormData,
  ): Promise<Customer> {
    /* -------------------------------------------------------------------- */
    /* OFFLINE                                                               */
    /* -------------------------------------------------------------------- */

    if (isOffline()) {
      const existing = await getOfflineCustomerById(id);

      if (!existing) {
        throw new Error("Customer not found offline.");
      }

      const updated: Customer = {
        ...existing,

        name: payload.name ?? existing.name,

        mobile: payload.mobile ?? existing.mobile,

        type: payload.type ?? existing.type,

        openingBalance: payload.openingBalance ?? existing.openingBalance,

        isActive: payload.isActive ?? existing.isActive,

        updatedAt: new Date().toISOString(),

        ...(payload.email !== undefined
          ? {
              email: payload.email,
            }
          : {}),

        ...(payload.address !== undefined
          ? {
              address: payload.address,
            }
          : {}),

        ...(payload.gstNo !== undefined
          ? {
              gstNo: payload.gstNo,
            }
          : {}),
      };

      await saveCustomers([updated]);

      await addToSyncQueue("CUSTOMER", "UPDATE", payload, id);

      return updated;
    }

    /* -------------------------------------------------------------------- */
    /* ONLINE                                                                */
    /* -------------------------------------------------------------------- */

    try {
      const response = await api.put(`/customers/${id}`, payload);

      const customer = response.data.data as Customer;

      await saveCustomers([customer]);

      return customer;
    } catch (error) {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        const existing = await getOfflineCustomerById(id);

        if (!existing) {
          throw new Error("Customer not found offline.");
        }

        const updated: Customer = {
          ...existing,
          ...payload,
          _id: existing._id,
          customerCode: existing.customerCode,
          updatedAt: new Date().toISOString(),
        };

        await saveCustomers([updated]);

        await addToSyncQueue("CUSTOMER", "UPDATE", payload, id);

        return updated;
      }

      throw error;
    }
  }

  /* ---------------------------------------------------------------------- */
  /* DELETE CUSTOMER                                                        */
  /* ---------------------------------------------------------------------- */

  async deleteCustomer(id: string): Promise<void> {
    /* -------------------------------------------------------------------- */
    /* OFFLINE                                                               */
    /* -------------------------------------------------------------------- */

    if (isOffline()) {
      await deleteOfflineCustomer(id);

      await addToSyncQueue("CUSTOMER", "DELETE", {}, id);

      return;
    }

    /* -------------------------------------------------------------------- */
    /* ONLINE                                                                */
    /* -------------------------------------------------------------------- */

    try {
      await api.delete(`/customers/${id}`);

      await deleteOfflineCustomer(id);
    } catch (error) {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        await deleteOfflineCustomer(id);

        await addToSyncQueue("CUSTOMER", "DELETE", {}, id);

        return;
      }

      throw error;
    }
  }
}

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default new CustomerService();
