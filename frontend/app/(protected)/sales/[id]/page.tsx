import SaleDetailsPage from "@/features/sales/pages/SaleDetailsPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <SaleDetailsPage saleId={id} />;
}
