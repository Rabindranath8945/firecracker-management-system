import SupplierDetailsPage from "@/features/suppliers/pages/SupplierDetailsPage";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierDetailsRoute({ params }: Props) {
  const { id } = await params;

  return <SupplierDetailsPage supplierId={id} />;
}
