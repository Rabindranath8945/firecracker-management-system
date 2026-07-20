import { notFound } from "next/navigation";

import EditSupplierPage from "@/features/suppliers/pages/EditSupplierPage";
import { suppliers } from "@/features/suppliers/services/supplier.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierEditRoute({ params }: Props) {
  const { id } = await params;

  const supplier = suppliers.find((item) => item.id === id);

  if (!supplier) {
    notFound();
  }

  return (
    <EditSupplierPage
      supplierId={supplier.id}
      defaultValues={{
        name: supplier.name,
        mobile: supplier.mobile,
        email: supplier.email,
        address: supplier.address,
        city: supplier.city,
        state: supplier.state,
        pinCode: supplier.pinCode,
        gstNo: supplier.gstNo,
        openingBalance: supplier.openingBalance,
        type: supplier.type,
        isActive: supplier.isActive,
      }}
    />
  );
}
