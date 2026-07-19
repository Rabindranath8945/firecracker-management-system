import EditCustomerPage from "@/features/customers/pages/EditCustomerPage";
import { customers } from "@/features/customers/services/customer.service";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerEditRoute({ params }: Props) {
  const { id } = await params;

  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    notFound();
  }

  return (
    <EditCustomerPage
      defaultValues={{
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pinCode: customer.pinCode,
        gstNo: customer.gstNo,
        openingBalance: customer.openingBalance,
        type: customer.type,
        isActive: customer.isActive,
      }}
    />
  );
}
