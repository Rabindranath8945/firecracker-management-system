import { IBusiness } from "../interfaces/business.interface.js";

export function toBusinessDto(business: IBusiness) {
  return {
    id: business._id.toString(),

    businessId: business.businessId,

    name: business.name,

    type: business.type,

    owner: business.owner,

    logo: business.logo,

    phone: business.phone,

    email: business.email,

    address: business.address,

    status: business.status,

    isActive: business.isActive,

    createdBy: business.createdBy,

    updatedBy: business.updatedBy,

    createdAt: business.createdAt,

    updatedAt: business.updatedAt,
  };
}
