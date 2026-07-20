import { notFound } from "next/navigation";

import SupplierDetailsPage from "@/features/suppliers/pages/SupplierDetailsPage";
import { suppliers } from "@/features/suppliers/services/supplier.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierDetailsRoute({ params }: Props) {
  const { id } = await params;

  const supplier = suppliers.find((item) => item.id === id);

  if (!supplier) {
    notFound();
  }

  return <SupplierDetailsPage supplier={supplier} />;
}
