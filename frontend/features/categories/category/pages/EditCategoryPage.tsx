"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, FolderTree, Save, Tag } from "lucide-react";

import SuccessSheet from "@/components/common/shared/sheets/SuccessSheet";
import ProgressDialog from "@/features/shared/ui/dialogs/ProgressDialog";

import CategoryService from "../services/category.service";

interface EditCategoryPageProps {
  categoryId: string;

  defaultValues: {
    name: string;
    description?: string;
    isActive: boolean;
  };
}

export default function EditCategoryPage({
  categoryId,
  defaultValues,
}: EditCategoryPageProps) {
  const router = useRouter();

  const [name, setName] = useState(defaultValues.name);
  const [description, setDescription] = useState(
    defaultValues.description ?? "",
  );
  const [isActive, setIsActive] = useState(defaultValues.isActive);

  const [loading, setLoading] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [updatedCategory, setUpdatedCategory] = useState<{
    name: string;
  } | null>(null);

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async function handleSubmit() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      setLoading(true);

      const category = await CategoryService.update(categoryId, {
        name: trimmedName,
        description: description.trim(),
        isActive,
      });

      setUpdatedCategory({
        name: category.name,
      });

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 lg:py-8">
          {/* ---------------------------------------------------------------- */}
          {/* Back                                                              */}
          {/* ---------------------------------------------------------------- */}

          <button
            type="button"
            onClick={() => router.push("/categories")}
            disabled={loading}
            className="
              mb-5
              inline-flex
              h-10
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              text-sm
              font-medium
              text-slate-700
              shadow-sm
              transition
              hover:border-slate-300
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </button>

          {/* ---------------------------------------------------------------- */}
          {/* Hero Header                                                       */}
          {/* ---------------------------------------------------------------- */}

          <section className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5">
              <FolderTree className="h-4 w-4 text-sky-600" />

              <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                Category Management
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Edit Category
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Update your category information and availability.
            </p>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Form Card                                                         */}
          {/* ---------------------------------------------------------------- */}

          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            {/* Card Header */}

            <div className="border-b border-slate-100 bg-gradient-to-br from-sky-50 via-white to-white px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                  <Tag className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Category Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Modify the details below.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}

            <div className="space-y-6 p-5 sm:p-7">
              {/* Category Name */}

              <div className="space-y-2">
                <label
                  htmlFor="category-name"
                  className="text-sm font-semibold text-slate-800"
                >
                  Category Name
                </label>

                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={loading}
                    placeholder="Enter category name"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      pl-11
                      pr-4
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-sky-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-sky-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />
                </div>
              </div>

              {/* Description */}

              <div className="space-y-2">
                <label
                  htmlFor="category-description"
                  className="text-sm font-semibold text-slate-800"
                >
                  Description
                </label>

                <textarea
                  id="category-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={loading}
                  rows={4}
                  placeholder="Write a short description..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-sky-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-sky-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>

              {/* ------------------------------------------------------------------ */
              /* Status                                                               */
              /* ------------------------------------------------------------------ */}

              <div
                className="
    flex
    items-center
    justify-between
    gap-4
    rounded-2xl
    border
    border-slate-200
    bg-slate-50
    px-4
    py-3
  "
              >
                {/* Status Information */}

                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        transition-colors
        ${
          isActive
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-200 text-slate-500"
        }
      `}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Active Category
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {isActive
                        ? "Products can use this category."
                        : "This category is currently disabled."}
                    </p>
                  </div>
                </div>

                {/* Switch */}

                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  aria-label="Toggle category status"
                  disabled={loading}
                  onClick={() => setIsActive((current) => !current)}
                  className={`
      relative
      flex
      h-7
      w-12
      shrink-0
      items-center
      rounded-full
      p-1
      transition-colors
      duration-200
      focus:outline-none
      focus:ring-4
      focus:ring-sky-500/20
      disabled:cursor-not-allowed
      disabled:opacity-60
      ${isActive ? "bg-sky-500" : "bg-slate-300"}
    `}
                >
                  <span
                    className={`
        block
        h-5
        w-5
        rounded-full
        bg-white
        shadow-md
        transition-transform
        duration-200
        ${isActive ? "translate-x-5" : "translate-x-0"}
      `}
                  />
                </button>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* Actions                                                       */}
              {/* ------------------------------------------------------------ */}

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => router.push("/categories")}
                  className="
                    h-12
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-6
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={loading || !name.trim()}
                  onClick={() => void handleSubmit()}
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-slate-900
                    to-slate-700
                    px-7
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-slate-900/15
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Updating..." : "Update Category"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* Progress                                                              */}
      {/* -------------------------------------------------------------------- */}

      <ProgressDialog
        open={loading}
        title="Updating Category"
        description="Please wait while we update the category."
      />

      {/* -------------------------------------------------------------------- */}
      {/* Success                                                               */}
      {/* -------------------------------------------------------------------- */}

      <SuccessSheet
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Category Updated Successfully"
        description="The category information has been updated."
        summary={[
          {
            label: "Category",
            value: updatedCategory?.name ?? name,
          },
          {
            label: "Status",
            value: isActive ? "Active" : "Inactive",
          },
        ]}
        primaryAction={{
          label: "Back to Categories",
          onClick: () => {
            setSuccessOpen(false);
            router.push("/categories");
          },
        }}
        secondaryActions={[
          {
            label: "Continue Editing",
            onClick: () => {
              setSuccessOpen(false);
            },
          },
        ]}
      />
    </>
  );
}
