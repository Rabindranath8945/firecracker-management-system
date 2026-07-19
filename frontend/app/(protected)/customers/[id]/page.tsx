import CustomerDetailsPage from "@/features/customers/pages/CustomerDetailsPage";
import { customers } from "@/features/customers/services/customer.service";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailsRoute({ params }: Props) {
  const { id } = await params;

  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    notFound();
  }

  return <CustomerDetailsPage customer={customer} />;
}
