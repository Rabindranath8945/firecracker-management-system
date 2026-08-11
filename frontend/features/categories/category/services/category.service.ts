import api from "@/lib/api";

export interface CreateCategoryDto {
  name: string;
}

class CategoryService {
  async getCategories() {
    const response = await api.get("/categories");

    return response.data.data.items;
  }

  async getCategory(id: string) {
    const response = await api.get(`/categories/${id}`);

    return response.data.data;
  }

  async create(data: CreateCategoryDto) {
    const response = await api.post("/categories", data);

    return response.data.data;
  }
}

export default new CategoryService();
