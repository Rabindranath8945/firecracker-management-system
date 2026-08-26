import SaleSharePage from "./SaleSharePage";

interface SaleShareRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return [];
}

export default function Page({ params }: SaleShareRouteProps) {
  return <SaleSharePage params={params} />;
}
