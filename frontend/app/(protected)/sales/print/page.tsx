import SalePrintPage from "./SalePrintPage";

interface SalePrintRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return [];
}

export default function Page({ params }: SalePrintRouteProps) {
  return <SalePrintPage params={params} />;
}
