import { notFound } from "next/navigation";

import CustomerDetailsPage from "@/features/customers/pages/CustomerDetailsPage";
import CustomerService from "@/features/customers/services/customer.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailsRoute({ params }: Props) {
  const { id } = await params;

  try {
    const customer = await CustomerService.getCustomer(id);

    return <CustomerDetailsPage customer={customer} />;
  } catch {
    notFound();
  }
}
