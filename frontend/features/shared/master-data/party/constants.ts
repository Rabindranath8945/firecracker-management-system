import { PartyEntity, PartyType } from "./types/party";

export interface PartyConfig {
  entity: PartyEntity;

  singular: string;

  plural: string;

  title: string;

  editTitle: string;

  description: string;

  saveButton: string;

  updateButton: string;

  deleteButton: string;

  nameLabel: string;

  numberLabel: string;

  primaryType: PartyType;

  primaryTypeLabel: string;

  primaryTypeDescription: string;

  secondaryType: PartyType;

  secondaryTypeLabel: string;

  secondaryTypeDescription: string;
}

export const PARTY_CONFIG: Record<PartyEntity, PartyConfig> = {
  customer: {
    entity: "customer",

    singular: "Customer",

    plural: "Customers",

    title: "New Customer",

    editTitle: "Edit Customer",

    description:
      "Create a customer profile for sales, invoices and payment tracking.",

    saveButton: "Save Customer",

    updateButton: "Update Customer",

    deleteButton: "Delete Customer",

    nameLabel: "Customer Name",

    numberLabel: "Customer ID",

    primaryType: "CUSTOMER",

    primaryTypeLabel: "Customer",

    primaryTypeDescription: "Used for sales, invoices and customer reports.",

    secondaryType: "BOTH",

    secondaryTypeLabel: "Customer + Supplier",

    secondaryTypeDescription: "Can purchase and supply products.",
  },

  supplier: {
    entity: "supplier",

    singular: "Supplier",

    plural: "Suppliers",

    title: "New Supplier",

    editTitle: "Edit Supplier",

    description:
      "Create a supplier profile for purchases, payments and inventory management.",

    saveButton: "Save Supplier",

    updateButton: "Update Supplier",

    deleteButton: "Delete Supplier",

    nameLabel: "Supplier Name",

    numberLabel: "Supplier ID",

    primaryType: "SUPPLIER",

    primaryTypeLabel: "Supplier",

    primaryTypeDescription: "Used for purchases, supplier bills and payments.",

    secondaryType: "BOTH",

    secondaryTypeLabel: "Supplier + Customer",

    secondaryTypeDescription: "Can purchase and supply products.",
  },
};
