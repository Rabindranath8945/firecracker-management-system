import { Types } from "mongoose";

import CustomerRepository from "../repositories/customer.repository.js";
import CustomerPaymentRepository from "../repositories/customer-payment.repository.js";

import type { CustomerPaymentMethod } from "../interfaces/customer-payment.interface.js";

interface CreateCustomerPaymentInput {
  customerId: string;
  amount: number;
  paymentMethod: CustomerPaymentMethod;
  referenceSale?: string;
  referenceInvoice?: string;
  notes?: string;
}

class CustomerPaymentService {
  /* ------------------------------------------------------------------------ */
  /* Create Due Payment                                                       */
  /* ------------------------------------------------------------------------ */

  async create(data: CreateCustomerPaymentInput, userId: string) {
    /* ---------------------------------------------------------------------- */
    /* Validate User                                                          */
    /* ---------------------------------------------------------------------- */

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Customer                                                      */
    /* ---------------------------------------------------------------------- */

    if (!Types.ObjectId.isValid(data.customerId)) {
      throw new Error("Invalid customer id.");
    }

    const customer = await CustomerRepository.findById(data.customerId);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    if (!customer.isActive) {
      throw new Error("Customer is inactive.");
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Amount                                                        */
    /* ---------------------------------------------------------------------- */

    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      throw new Error("Payment amount must be greater than zero.");
    }

    /* ---------------------------------------------------------------------- */
    /* Current Outstanding Due                                                */
    /* ---------------------------------------------------------------------- */

    const currentDue = Math.max(0, customer.openingBalance ?? 0);

    if (currentDue <= 0) {
      throw new Error("Customer has no outstanding due.");
    }

    if (data.amount > currentDue) {
      throw new Error(
        `Payment amount cannot exceed outstanding due of ₹${currentDue}.`,
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Reference Sale                                                         */
    /* ---------------------------------------------------------------------- */

    let referenceSale: Types.ObjectId | null = null;

    if (data.referenceSale) {
      if (!Types.ObjectId.isValid(data.referenceSale)) {
        throw new Error("Invalid reference sale id.");
      }

      referenceSale = new Types.ObjectId(data.referenceSale);
    }

    /* ---------------------------------------------------------------------- */
    /* Create Payment History                                                 */
    /* ---------------------------------------------------------------------- */

    const payment = await CustomerPaymentRepository.create({
      customer: new Types.ObjectId(data.customerId),

      amount: data.amount,

      paymentMethod: data.paymentMethod,

      type: "DUE_COLLECTION",

      referenceSale,

      referenceInvoice: data.referenceInvoice ?? "",

      notes: data.notes ?? "",

      createdBy: new Types.ObjectId(userId),
    });

    /* ---------------------------------------------------------------------- */
    /* Update Customer Outstanding Due                                        */
    /* ---------------------------------------------------------------------- */

    const remainingDue = Math.max(0, currentDue - data.amount);

    await CustomerRepository.update(data.customerId, {
      openingBalance: remainingDue,

      updatedBy: new Types.ObjectId(userId),
    });

    /* ---------------------------------------------------------------------- */
    /* Return                                                                 */
    /* ---------------------------------------------------------------------- */

    return {
      payment,

      previousDue: currentDue,

      collectedAmount: data.amount,

      remainingDue,
    };
  }

  /* ------------------------------------------------------------------------ */
  /* Payment History                                                          */
  /* ------------------------------------------------------------------------ */

  async getCustomerPayments(customerId: string) {
    if (!Types.ObjectId.isValid(customerId)) {
      throw new Error("Invalid customer id.");
    }

    const customer = await CustomerRepository.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return CustomerPaymentRepository.findByCustomer(customerId);
  }

  /* ------------------------------------------------------------------------ */
  /* Current Customer Due                                                     */
  /* ------------------------------------------------------------------------ */

  async getCustomerDue(customerId: string) {
    if (!Types.ObjectId.isValid(customerId)) {
      throw new Error("Invalid customer id.");
    }

    const customer = await CustomerRepository.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    const currentDue = Math.max(0, customer.openingBalance ?? 0);

    return {
      openingBalance: currentDue,
      totalCollected: 0,
      remainingDue: currentDue,
    };
  }
}

export default new CustomerPaymentService();
