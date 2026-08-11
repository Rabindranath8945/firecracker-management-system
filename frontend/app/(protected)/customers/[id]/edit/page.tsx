import { notFound } from "next/navigation";

import EditCustomerPage from "@/features/customers/pages/EditCustomerPage";
import { getCustomer } from "@/features/customers/services/customer.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerEditRoute({ params }: Props) {
  const { id } = await params;

  try {
    const customer = await getCustomer(id);

    return (
      <EditCustomerPage
        customerId={customer._id}
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
  } catch {
    notFound();
  }
}
