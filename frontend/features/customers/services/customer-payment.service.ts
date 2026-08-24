import api from "@/lib/api";

export type CustomerPaymentMethod = "CASH" | "UPI" | "CARD" | "BANK";

export interface CreateCustomerPaymentData {
  amount: number;
  paymentMethod: CustomerPaymentMethod;
  referenceSale?: string;
  referenceInvoice?: string;
  notes?: string;
}

class CustomerPaymentService {
  async createDuePayment(customerId: string, data: CreateCustomerPaymentData) {
    const response = await api.post(
      `/customer-payments/${customerId}/due-payment`,
      data,
    );

    return response.data.data;
  }

  async getCustomerDue(customerId: string) {
    const response = await api.get(`/customer-payments/${customerId}/due`);

    return response.data.data;
  }

  async getCustomerPayments(customerId: string) {
    const response = await api.get(`/customer-payments/${customerId}/payments`);

    return response.data.data;
  }
}

export default new CustomerPaymentService();
