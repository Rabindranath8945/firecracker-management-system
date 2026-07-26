import BusinessModel from "../../business/models/business.model.js";
import ProductModel from "../../product/models/product.model.js";
import CustomerModel from "../../customer/models/customer.model.js";
import SupplierModel from "../../supplier/models/supplier.model.js";
import SalesModel from "../../sales/models/sales.model.js";

class DashboardRepository {
  async getDashboard(ownerId: string) {
    /* -------------------------------------------------------------------------- */
    /*                              Business                                      */
    /* -------------------------------------------------------------------------- */

    const business = await BusinessModel.findOne({
      owner: ownerId,
    }).lean();

    /* -------------------------------------------------------------------------- */
    /*                                Counts                                      */
    /* -------------------------------------------------------------------------- */

    const [totalProducts, totalCustomers, totalSuppliers, totalSales] =
      await Promise.all([
        ProductModel.countDocuments(),
        CustomerModel.countDocuments(),
        SupplierModel.countDocuments(),
        SalesModel.countDocuments(),
      ]);

    return {
      business,

      totalProducts,

      totalCustomers,

      totalSuppliers,

      totalSales,
    };
  }
}

export default new DashboardRepository();
