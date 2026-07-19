export function useCreateSupplier() {
  async function createSupplier(data: any) {
    console.log(data);

    return {
      id: crypto.randomUUID(),
      businessName: data.businessName,
      contactPerson: data.contactPerson,
      mobile: data.mobile,
      due: 0,
    };
  }

  return { createSupplier };
}
