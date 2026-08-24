"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FormProvider,
  useForm,
  useWatch,
  type FieldErrors,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSupplierBalance } from "@/features/suppliers/hook/useSupplierBalance";
import type { CreatePurchaseRequest } from "../types/purchase.types";

import { PurchaseSchema, type PurchaseForm } from "../schemas/purchase.schema";
import { useCreateSupplier } from "@/features/suppliers/hook/useCreateSupplier";

import { usePurchaseOCR } from "../hooks/usePurchaseOCR";
import { useCreatePurchase } from "../hooks/useCreatePurchase";
import { SuccessSheet } from "@/components/common/shared/sheets";
import type { Product } from "@/features/products/types/product.types";
import { useProducts } from "@/features/products/hooks/useProducts";

import { useSuppliers } from "@/features/suppliers/hook/useSuppliers";
import type { Supplier } from "@/features/suppliers/types/supplier.type";

import FrequentProducts from "./FrequentProducts";

import PurchaseInfoCard from "./PurchaseInfoCard";
import InvoiceImportCard from "./InvoiceImportCard";
import NewPurchaseSearch from "./NewPurchaseSearch";
import PurchaseSearchItem from "./PurchaseSearchItem";
import QuickProductSheet from "./QuickProductSheet";

import PurchaseEditorSheet from "./PurchaseEditorSheet";
import type { PurchaseEditorValues } from "./PurchaseProductEditor";

import PurchaseProductTable, {
  type PurchaseLineItem,
} from "./PurchaseProductTable";

import TotalsCard from "./TotalsCard";
import PaymentCard from "./PaymentCard";
import NotesCard from "./NotesCard";
import StickySaveBar from "./StickySaveBar";

import PurchaseSummary from "./NewPurchaseSummary";

import PurchaseSupplierCard from "./PurchaseSupplierCard";
import PurchaseSupplierSheet from "./PurchaseSupplierSheet";
import SupplierInsights from "./SupplierInsights";

import InvoiceProcessingDialog from "./InvoiceProcessingDialog";

import { calculatePurchaseTotals } from "../utils/purchaseCalculation";

import QuickSupplierSheet from "@/features/suppliers/components/QuickSupplierSheet";

/* -------------------------------------------------------------------------- */
/*                               EMPTY EDITOR                                 */
/* -------------------------------------------------------------------------- */

const EMPTY_EDITOR: PurchaseEditorValues = {
  quantity: 1,
  purchasePrice: 0,
  sellingPrice: 0,
  discount: 0,
  gstRate: 0,
};

/* -------------------------------------------------------------------------- */
/*                              FORM ERROR HELPER                             */
/* -------------------------------------------------------------------------- */

function getFirstErrorMessage(errors: FieldErrors<PurchaseForm>): string {
  for (const value of Object.values(errors)) {
    if (
      value &&
      typeof value === "object" &&
      "message" in value &&
      typeof value.message === "string"
    ) {
      return value.message;
    }
  }

  return "Please complete all required fields.";
}

/* -------------------------------------------------------------------------- */
/*                               PURCHASE FORM                                */
/* -------------------------------------------------------------------------- */

export default function PurchaseForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ------------------------------------------------------------------------ */
  /* Mutations                                                                */
  /* ------------------------------------------------------------------------ */

  const createPurchase = useCreatePurchase();

  const createSupplier = useCreateSupplier();

  const purchaseOCR = usePurchaseOCR();

  /* ------------------------------------------------------------------------ */
  /* File inputs                                                              */
  /* ------------------------------------------------------------------------ */

  const cameraInputRef = useRef<HTMLInputElement>(null);

  const galleryInputRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------------------ */
  /* Form                                                                     */
  /* ------------------------------------------------------------------------ */

  const methods = useForm<PurchaseForm>({
    resolver: zodResolver(PurchaseSchema),

    defaultValues: {
      supplierId: "",

      invoiceNo: "",

      purchaseDate: new Date().toISOString().slice(0, 10),

      dueDate: "",

      paymentStatus: "PAID",

      paymentMethod: "CASH",

      transportCharge: 0,

      paidAmount: 0,

      notes: "",

      items: [],
    },
  });

  const { handleSubmit, control, setValue, reset } = methods;

  /* ------------------------------------------------------------------------ */
  /* OCR state                                                                */
  /* ------------------------------------------------------------------------ */

  const [ocrText, setOcrText] = useState("");

  /* ------------------------------------------------------------------------ */
  /* OCR handlers                                                             */
  /* ------------------------------------------------------------------------ */

  function handleCameraClick() {
    cameraInputRef.current?.click();
  }

  function handleGalleryClick() {
    galleryInputRef.current?.click();
  }

  async function handleOCRFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const response = await purchaseOCR.mutateAsync(file);

      const text = response.data.data.text;

      setOcrText(text);

      toast.success("Invoice scanned successfully.");
    } catch (error) {
      console.error("Invoice OCR failed:", error);

      const message =
        error instanceof Error ? error.message : "Failed to scan invoice.";

      toast.error(message);
    } finally {
      event.target.value = "";
    }
  }

  // Product Editor Sheet

  const [editing, setEditing] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Suppliers                                                                */
  /* ------------------------------------------------------------------------ */

  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const { data: supplierBalance, isLoading: supplierBalanceLoading } =
    useSupplierBalance(selectedSupplier?._id);

  /* ------------------------------------------------------------------------ */
  /* Products                                                                 */
  /* ------------------------------------------------------------------------ */

  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: 1,
    limit: 100,
  });

  const products: Product[] = useMemo(() => {
    return productsData?.items ?? [];
  }, [productsData]);

  /* ------------------------------------------------------------------------ */
  /* Search                                                                   */
  /* ------------------------------------------------------------------------ */

  const [search, setSearch] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Product editor                                                           */
  /* ------------------------------------------------------------------------ */

  const [editorOpen, setEditorOpen] = useState(false);

  const [newProductOpen, setNewProductOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [editor, setEditor] = useState<PurchaseEditorValues>(EMPTY_EDITOR);

  const [items, setItems] = useState<PurchaseLineItem[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Supplier                                                                 */
  /* ------------------------------------------------------------------------ */

  const [supplierSheetOpen, setSupplierSheetOpen] = useState(false);

  const [quickSupplierOpen, setQuickSupplierOpen] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Purchase UI state                                                        */
  /* ------------------------------------------------------------------------ */

  const [processing, setProcessing] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [createdPurchaseNo, setCreatedPurchaseNo] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Watched values                                                           */
  /* ------------------------------------------------------------------------ */

  const transportCharge =
    useWatch({
      control,
      name: "transportCharge",
    }) ?? 0;

  const paidAmount =
    useWatch({
      control,
      name: "paidAmount",
    }) ?? 0;

  const paymentStatus = useWatch({
    control,
    name: "paymentStatus",
  });

  /* ------------------------------------------------------------------------ */
  /* Purchase totals                                                          */
  /* ------------------------------------------------------------------------ */

  const totals = useMemo(() => {
    return calculatePurchaseTotals(items, Number(transportCharge) || 0);
  }, [items, transportCharge]);

  const balanceAmount = Math.max(
    0,
    totals.grandTotal - Number(paidAmount || 0),
  );

  /* ------------------------------------------------------------------------ */
  /* Supplier adapter                                                         */
  /* ------------------------------------------------------------------------ */

  const sheetSuppliers = suppliers.map((supplier) => ({
    _id: supplier._id,
    name: supplier.name,
    mobile: supplier.mobile,
    supplierCode: supplier.supplierCode,
    currentDue: Number(supplier.currentDue ?? 0),
  }));

  /* ------------------------------------------------------------------------ */
  /* Product search                                                           */
  /* ------------------------------------------------------------------------ */

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return [];
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.productCode.toLowerCase().includes(keyword)
      );
    });
  }, [products, search]);

  /* ------------------------------------------------------------------------ */
  /* Open product editor                                                      */
  /* ------------------------------------------------------------------------ */

  function handleAddNewProduct() {
    setNewProductOpen(true);
  }

  function handleNewProductCreated(product: Product) {
    setNewProductOpen(false);

    openEditor(product);

    void queryClient.invalidateQueries({
      queryKey: ["products"],
    });
  }

  function openEditor(product: Product) {
    setSelectedProduct(product);

    setEditor({
      quantity: 1,

      purchasePrice: Number(product.purchasePrice ?? 0),

      sellingPrice: Number(product.sellingPrice ?? 0),

      discount: 0,

      gstRate: Number(product.tax ?? 0),
    });

    setEditingIndex(null);

    setEditorOpen(true);

    setSearch("");
  }

  /* ------------------------------------------------------------------------ */
  /* Close product editor                                                     */
  /* ------------------------------------------------------------------------ */

  function closeEditor() {
    setSelectedProduct(null);

    setEditingIndex(null);

    setEditor(EMPTY_EDITOR);

    setEditorOpen(false);

    setSearch("");
  }

  /* ------------------------------------------------------------------------ */
  /* Save product line                                                        */
  /* ------------------------------------------------------------------------ */

  function saveProduct() {
    if (!selectedProduct) {
      return;
    }

    if (editor.quantity <= 0) {
      toast.error("Quantity must be greater than zero.");
      return;
    }

    if (editor.purchasePrice < 0) {
      toast.error("Purchase price cannot be negative.");
      return;
    }

    const item: PurchaseLineItem = {
      productId: selectedProduct._id,

      productName: selectedProduct.name,

      sku: selectedProduct.productCode,

      quantity: editor.quantity,

      purchasePrice: editor.purchasePrice,

      sellingPrice: editor.sellingPrice,

      discount: editor.discount,

      gstRate: editor.gstRate,

      image: selectedProduct.image,
    };

    const updatedItems =
      editingIndex === null
        ? [...items, item]
        : items.map((existingItem, index) =>
            index === editingIndex ? item : existingItem,
          );

    setItems(updatedItems);

    setValue("items", updatedItems, {
      shouldValidate: true,
      shouldDirty: true,
    });

    closeEditor();
  }

  /* ------------------------------------------------------------------------ */
  /* Remove product                                                           */
  /* ------------------------------------------------------------------------ */

  function removeProduct(index: number) {
    const updatedItems = items.filter((_, itemIndex) => itemIndex !== index);

    setItems(updatedItems);

    setValue("items", updatedItems, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Edit product                                                             */
  /* ------------------------------------------------------------------------ */

  function editProduct(index: number) {
    const item = items[index];

    if (!item) {
      return;
    }

    const product = products.find(
      (currentProduct) => currentProduct._id === item.productId,
    );

    if (!product) {
      toast.error("Product is no longer available.");
      return;
    }

    setEditingIndex(index);

    setSelectedProduct(product);

    setEditor({
      quantity: item.quantity,

      purchasePrice: item.purchasePrice,

      sellingPrice: item.sellingPrice,

      discount: item.discount,

      gstRate: item.gstRate,
    });

    setEditorOpen(true);
  }

  /* ------------------------------------------------------------------------ */
  /* Supplier selection                                                       */
  /* ------------------------------------------------------------------------ */

  function handleSupplierSelect(supplierId: string) {
    const supplier = suppliers.find((item) => item._id === supplierId);

    if (!supplier) {
      toast.error("Supplier not found.");
      return;
    }

    setSelectedSupplier(supplier);

    setValue("supplierId", supplier._id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSupplierSheetOpen(false);
  }

  /* ------------------------------------------------------------------------ */
  /* Invalid submit                                                           */
  /* ------------------------------------------------------------------------ */

  function handleInvalidSubmit(formErrors: FieldErrors<PurchaseForm>) {
    toast.error(getFirstErrorMessage(formErrors));
  }

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                    */
  /* ------------------------------------------------------------------------ */

  async function onSubmit(data: PurchaseForm) {
    if (!selectedSupplier) {
      toast.error("Please select a supplier.");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one product.");
      return;
    }

    try {
      setProcessing(true);

      const purchaseData: CreatePurchaseRequest = {
        supplierId: data.supplierId,

        purchaseDate: data.purchaseDate,

        paymentMethod: data.paymentMethod,

        transportCharge: Number(data.transportCharge || 0),

        paidAmount: Number(data.paidAmount || 0),

        items: items.map((item) => ({
          productId: item.productId,

          quantity: Number(item.quantity),

          purchasePrice: Number(item.purchasePrice),

          sellingPrice: Number(item.sellingPrice),

          discount: Number(item.discount),

          gstRate: Number(item.gstRate),
        })),
      };

      if (data.dueDate?.trim()) {
        purchaseData.dueDate = data.dueDate.trim();
      }

      if (data.notes?.trim()) {
        purchaseData.notes = data.notes.trim();
      }

      const response = await createPurchase.mutateAsync(purchaseData);

      const createdPurchase = response.data.data;

      if (!createdPurchase?._id) {
        throw new Error(
          "Purchase was created but the server response is invalid.",
        );
      }

      setCreatedPurchaseNo(createdPurchase.purchaseNo);

      await queryClient.invalidateQueries({
        queryKey: ["purchase", createdPurchase._id],
      });

      toast.success("Purchase created successfully.");

      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to create purchase:", error);

      const message =
        error instanceof Error ? error.message : "Failed to create purchase.";

      toast.error(message);
    } finally {
      setProcessing(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Reset                                                                    */
  /* ------------------------------------------------------------------------ */

  function resetPurchaseForm() {
    reset({
      supplierId: "",

      invoiceNo: "",

      purchaseDate: new Date().toISOString().slice(0, 10),

      dueDate: "",

      paymentStatus: "PAID",

      paymentMethod: "CASH",

      transportCharge: 0,

      paidAmount: 0,

      notes: "",

      items: [],
    });

    setItems([]);

    setSelectedSupplier(null);

    setSelectedProduct(null);

    setEditingIndex(null);

    setEditor(EMPTY_EDITOR);

    setSearch("");

    setCreatedPurchaseNo("");

    setOcrText("");

    setSuccessOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
        className="space-y-6 pb-32"
      >
        {/* ------------------------------------------------------------------ */}
        {/* Hidden OCR inputs                                                   */}
        {/* ------------------------------------------------------------------ */}

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="hidden"
          onChange={handleOCRFile}
        />

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleOCRFile}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Purchase Information                                                */}
        {/* ------------------------------------------------------------------ */}

        <PurchaseInfoCard />

        {/* ------------------------------------------------------------------ */}
        {/* AI Invoice Scanner                                                  */}
        {/* ------------------------------------------------------------------ */}

        <InvoiceImportCard
          onCamera={handleCameraClick}
          onGallery={handleGalleryClick}
          loading={purchaseOCR.isPending}
          disabled={processing || purchaseOCR.isPending}
        />

        {/* ------------------------------------------------------------------ */}
        {/* OCR Result                                                          */}
        {/* ------------------------------------------------------------------ */}

        {ocrText && (
          <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <div className="flex items-center justify-between border-b border-emerald-200 px-5 py-4 dark:border-emerald-500/20">
              <div>
                <h2 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  OCR Result
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Raw text detected from the invoice.
                </p>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                Google Vision
              </span>
            </div>

            <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap p-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {ocrText}
            </pre>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Supplier                                                            */}
        {/* ------------------------------------------------------------------ */}

        <PurchaseSupplierCard
          supplier={selectedSupplier}
          loading={suppliersLoading}
          onSelect={() => {
            setSupplierSheetOpen(true);
          }}
          onAddNew={() => {
            setQuickSupplierOpen(true);
          }}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Supplier Insights                                                   */}
        {/* ------------------------------------------------------------------ */}

        {selectedSupplier && (
          <>
            {supplierBalanceLoading ? (
              <div className="rounded-3xl border bg-card p-5 text-sm text-muted-foreground">
                Loading supplier balance...
              </div>
            ) : supplierBalance ? (
              <SupplierInsights
                supplier={selectedSupplier}
                balance={supplierBalance}
              />
            ) : null}
          </>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Product Search                                                      */}
        {/* ------------------------------------------------------------------ */}

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">Add Products</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Search products or choose from frequently purchased items.
            </p>
          </div>

          <NewPurchaseSearch
            value={search}
            onChange={setSearch}
            onAddProduct={handleAddNewProduct}
            loading={productsLoading}
          />

          {/* Search Results */}

          {search.trim() && (
            <div className="space-y-2">
              {filteredProducts.length === 0 ? (
                <div className="rounded-3xl border border-dashed bg-muted/20 p-8 text-center">
                  <p className="font-semibold">No Product Found</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try another product name or code.
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <PurchaseSearchItem
                    key={product._id}
                    product={product}
                    onSelect={() => openEditor(product)}
                  />
                ))
              )}
            </div>
          )}

          {/* Frequently Purchased */}

          {!search.trim() && (
            <FrequentProducts products={products} onSelect={openEditor} />
          )}
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Products                                                           */}
        {/* ------------------------------------------------------------------ */}

        <PurchaseProductTable
          items={items}
          onEdit={editProduct}
          onDelete={removeProduct}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Purchase Summary                                                   */}
        {/* ------------------------------------------------------------------ */}

        <PurchaseSummary
          products={items.length}
          quantity={items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0,
          )}
          total={totals.grandTotal}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Totals                                                             */}
        {/* ------------------------------------------------------------------ */}

        <TotalsCard totals={totals} />

        {/* ------------------------------------------------------------------ */}
        {/* Payment                                                             */}
        {/* ------------------------------------------------------------------ */}
        <PaymentCard supplierCurrentDue={selectedSupplier?.currentDue ?? 0} />

        {/* ------------------------------------------------------------------ */}
        {/* Notes                                                              */}
        {/* ------------------------------------------------------------------ */}

        <NotesCard />

        {/* ------------------------------------------------------------------ */}
        {/* Save                                                                */}
        {/* ------------------------------------------------------------------ */}

        <StickySaveBar
          total={totals.grandTotal}
          products={items.length}
          disabled={processing || createPurchase.isPending}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Product Editor                                                      */}
        {/* ------------------------------------------------------------------ */}

        <PurchaseEditorSheet
          open={editorOpen}
          editing={editing}
          product={selectedProduct}
          values={editor}
          onChange={(field, value) => {
            setEditor((prev) => ({
              ...prev,
              [field]: value,
            }));
          }}
          onClose={closeEditor}
          onAdd={saveProduct}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Supplier Selector                                                   */}
        {/* ------------------------------------------------------------------ */}

        <PurchaseSupplierSheet
          open={supplierSheetOpen}
          suppliers={sheetSuppliers}
          selectedSupplierId={selectedSupplier?._id ?? ""}
          onClose={() => setSupplierSheetOpen(false)}
          onSelect={(supplier) => {
            handleSupplierSelect(supplier._id);
          }}
          onClear={() => {
            setValue("supplierId", "", {
              shouldValidate: true,
              shouldDirty: true,
            });

            setSelectedSupplier(null);
          }}
        />

        <QuickProductSheet
          open={newProductOpen}
          onOpenChange={setNewProductOpen}
          onCreated={handleNewProductCreated}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Quick Supplier                                                      */}
        {/* ------------------------------------------------------------------ */}

        <QuickSupplierSheet
          open={quickSupplierOpen}
          onOpenChange={setQuickSupplierOpen}
          loading={createSupplier.isPending}
          onSave={async (data) => {
            try {
              const supplier = await createSupplier.mutateAsync(data);

              setSelectedSupplier(supplier);

              setValue("supplierId", supplier._id, {
                shouldValidate: true,
                shouldDirty: true,
              });

              setQuickSupplierOpen(false);
            } catch (error) {
              console.error("Failed to create supplier:", error);
            }
          }}
          onMoreDetails={() => {
            setQuickSupplierOpen(false);
          }}
        />

        {/* ------------------------------------------------------------------ */}
        {/* OCR Processing                                                      */}
        {/* ------------------------------------------------------------------ */}

        <InvoiceProcessingDialog open={purchaseOCR.isPending} />

        {/* ------------------------------------------------------------------ */}
        {/* Purchase Success                                                    */}
        {/* ------------------------------------------------------------------ */}

        <SuccessSheet
          open={successOpen}
          onOpenChange={(open) => {
            setSuccessOpen(open);

            if (!open) {
              router.replace("/purchases");
            }
          }}
          title="Purchase Created"
          description="Your purchase has been successfully recorded."
          summary={[
            {
              label: "Purchase Number",
              value: createdPurchaseNo || "—",
            },
            {
              label: "Products",
              value: String(items.length),
            },
            {
              label: "Total Amount",
              value: `₹${totals.grandTotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
            },
          ]}
          status={[
            {
              label: "Inventory",
              value: "Updated",
              color: "success",
            },
            {
              label: "Payment",
              value: paymentStatus,
              color:
                paymentStatus === "PAID"
                  ? "success"
                  : paymentStatus === "PARTIAL"
                    ? "warning"
                    : "error",
            },
          ]}
          primaryAction={{
            label: "New Purchase",
            onClick: () => {
              setSuccessOpen(false);
              resetPurchaseForm();
            },
          }}
          secondaryActions={[
            {
              label: "View Purchase",
              onClick: () => {
                if (!createdPurchaseNo) {
                  return;
                }

                setSuccessOpen(false);

                router.push(
                  `/purchases?search=${encodeURIComponent(createdPurchaseNo)}`,
                );
              },
            },
          ]}
        />
      </form>
    </FormProvider>
  );
}
