import api from "@/lib/api";

export interface CreateSubCategoryDto {
  name: string;
  category: string;
}

class SubCategoryService {
  async getSubCategories() {
    const response = await api.get("/sub-categories");

    return response.data.data.items;
  }

  async getByCategory(categoryId: string) {
    const response = await api.get("/sub-categories", {
      params: {
        category: categoryId,
      },
    });

    return response.data.data.items;
  }

  async getSubCategory(id: string) {
    const response = await api.get(`/sub-categories/${id}`);

    return response.data.data;
  }

  async create(data: CreateSubCategoryDto) {
    const response = await api.post("/sub-categories", data);

    return response.data.data;
  }
}

export default new SubCategoryService();
