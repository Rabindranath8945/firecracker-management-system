import EditSaleClient from "./EditSaleClient";

interface EditSaleRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return [];
}

export default function Page({ params }: EditSaleRouteProps) {
  return <EditSaleClient params={params} />;
}
