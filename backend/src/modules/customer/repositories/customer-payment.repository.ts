import { ClientSession } from "mongoose";

import CustomerPayment from "../models/customer-payment.model.js";
import { ICustomerPayment } from "../interfaces/customer-payment.interface.js";

class CustomerPaymentRepository {
  async create(data: ICustomerPayment, session?: ClientSession) {
    const [payment] = await CustomerPayment.create([data], {
      session,
    });

    return payment;
  }

  async findById(id: string) {
    return CustomerPayment.findById(id)
      .populate("customer", "customerCode name mobile")
      .populate("referenceSale", "saleNo invoiceNo grandTotal");
  }

  async findByCustomer(customerId: string, session?: ClientSession) {
    return CustomerPayment.find({
      customer: customerId,
      type: "DUE_COLLECTION",
    })
      .sort({
        createdAt: -1,
      })
      .session(session ?? null);
  }

  async getTotalCollected(
    customerId: string,
    session?: ClientSession,
  ): Promise<number> {
    const result = await CustomerPayment.aggregate([
      {
        $match: {
          customer: customerId,
          type: "DUE_COLLECTION",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]).session(session ?? null);

    return result[0]?.total ?? 0;
  }
}

export default new CustomerPaymentRepository();
