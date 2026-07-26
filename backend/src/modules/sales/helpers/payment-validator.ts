import { CreateSaleInput } from "../validators/sales.validator.js";

type Payment = CreateSaleInput["payment"];

export function validatePayment(payment: Payment, paidAmount: number) {
  const paymentTotal =
    payment.cash + payment.upi + payment.card + payment.bank + payment.credit;

  if (Math.abs(paymentTotal - paidAmount) > 0.01) {
    throw new Error("Payment breakdown must equal Paid Amount.");
  }

  switch (payment.method) {
    case "CASH":
      if (
        payment.cash !== paidAmount ||
        payment.upi > 0 ||
        payment.card > 0 ||
        payment.bank > 0 ||
        payment.credit > 0
      ) {
        throw new Error("Invalid cash payment.");
      }
      break;

    case "UPI":
      if (
        payment.upi !== paidAmount ||
        payment.cash > 0 ||
        payment.card > 0 ||
        payment.bank > 0 ||
        payment.credit > 0
      ) {
        throw new Error("Invalid UPI payment.");
      }
      break;

    case "CARD":
      if (
        payment.card !== paidAmount ||
        payment.cash > 0 ||
        payment.upi > 0 ||
        payment.bank > 0 ||
        payment.credit > 0
      ) {
        throw new Error("Invalid card payment.");
      }
      break;

    case "BANK":
      if (
        payment.bank !== paidAmount ||
        payment.cash > 0 ||
        payment.upi > 0 ||
        payment.card > 0 ||
        payment.credit > 0
      ) {
        throw new Error("Invalid bank payment.");
      }
      break;

    case "CREDIT":
      if (
        payment.credit !== paidAmount ||
        payment.cash > 0 ||
        payment.upi > 0 ||
        payment.card > 0 ||
        payment.bank > 0
      ) {
        throw new Error("Invalid credit payment.");
      }
      break;

    case "MIXED":
      const activeMethods = [
        payment.cash,
        payment.upi,
        payment.card,
        payment.bank,
        payment.credit,
      ].filter((amount) => amount > 0);

      if (activeMethods.length < 2) {
        throw new Error("Mixed payment requires at least two payment methods.");
      }
      break;

    default:
      throw new Error("Invalid payment method.");
  }

  return true;
}
