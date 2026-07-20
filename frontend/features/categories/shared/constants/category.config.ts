export interface CategoryFormConfig {
  title: string;

  description: string;

  submitLabel: string;

  backHref: string;

  nameLabel: string;

  namePlaceholder: string;

  descriptionLabel: string;

  descriptionPlaceholder: string;

  showParentCategory: boolean;

  parentCategoryLabel: string;

  parentCategoryPlaceholder: string;
}

export const CATEGORY_CONFIG: Record<
  "category" | "subCategory",
  CategoryFormConfig
> = {
  category: {
    title: "New Category",

    description: "Create a new category to organize your products.",

    submitLabel: "Save Category",

    backHref: "/categories",

    nameLabel: "Category Name",

    namePlaceholder: "Enter category name",

    descriptionLabel: "Description",

    descriptionPlaceholder: "Enter category description",

    showParentCategory: false,

    parentCategoryLabel: "",

    parentCategoryPlaceholder: "",
  },

  subCategory: {
    title: "New Sub Category",

    description: "Create a new sub category under a category.",

    submitLabel: "Save Sub Category",

    backHref: "/categories",

    nameLabel: "Sub Category Name",

    namePlaceholder: "Enter sub category name",

    descriptionLabel: "Description",

    descriptionPlaceholder: "Enter sub category description",

    showParentCategory: true,

    parentCategoryLabel: "Parent Category",

    parentCategoryPlaceholder: "Select category",
  },
};
