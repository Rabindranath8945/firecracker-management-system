import { getSupplier } from "@/features/suppliers/services/supplier.service";
import SupplierDetailsPage from "@/features/suppliers/pages/SupplierDetailsPage";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierDetailsRoute({ params }: Props) {
  const { id } = await params;

  try {
    const supplier = await getSupplier(id);

    return <SupplierDetailsPage supplier={supplier} />;
  } catch {
    notFound();
  }
}
