"use client";

import { useMemo, useState } from "react";
import {
  FormProvider,
  useForm,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PurchaseSchema, type PurchaseForm } from "../schemas/purchase.schema";

import { MOCK_PRODUCTS } from "@/features/products/mock/products";
import type { Product } from "@/features/products/types/product.types";
import { MOCK_SUPPLIERS } from "@/features/suppliers/mock/suppliers";
import FrequentProducts from "./FrequentProducts";
import { FREQUENT_PRODUCTS } from "../mock/frequentProducts";

import PurchaseInfoCard from "./PurchaseInfoCard";
import InvoiceImportCard from "./InvoiceImportCard";
import NewPurchaseSearch from "./NewPurchaseSearch";
import PurchaseSearchItem from "./PurchaseSearchItem";
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
import InvoicePreviewSheet from "./InvoicePreviewSheet";
import { calculatePurchaseTotals } from "../utils/purchaseCalculation";
import PurchaseSuccessSheet from "./PurchaseSuccessSheet";
import QuickSupplierSheet from "@/features/suppliers/components/QuickSupplierSheet";

const OCR_PRODUCTS = [
  {
    name: "Rocket Deluxe",
    quantity: 10,
    price: 220,
    confidence: 98,
    matched: true,
  },
  {
    name: "Flower Pot Big",
    quantity: 15,
    price: 120,
    confidence: 95,
    matched: true,
  },
  {
    name: "Chocolate Bomb",
    quantity: 8,
    price: 180,
    confidence: 91,
    matched: true,
  },
  {
    name: "Sky Shot Deluxe",
    quantity: 5,
    price: 450,
    confidence: 62,
    matched: false,
  },
];

const EMPTY_EDITOR: PurchaseEditorValues = {
  quantity: 1,
  purchasePrice: 0,
  sellingPrice: 0,
  discount: 0,
  gstRate: 0,
};

function onInvalid(errors: FieldErrors<PurchaseForm>) {
  const firstError = Object.values(errors)[0];

  toast.error("Please complete all required fields.", {
    description:
      firstError?.message?.toString() ??
      "Some required information is missing.",
  });
}

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

export default function PurchaseForm() {
  const methods = useForm<PurchaseForm>({
    resolver: zodResolver(PurchaseSchema),

    defaultValues: {
      supplierId: "",
      invoiceNo: "",
      purchaseDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      paymentStatus: "PAID",
      transportCharge: 0,
      paidAmount: 0,
      notes: "",
      items: [],
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const [search, setSearch] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [editor, setEditor] = useState<PurchaseEditorValues>(EMPTY_EDITOR);

  const [items, setItems] = useState<PurchaseLineItem[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [selectedSupplier, setSelectedSupplier] = useState<
    (typeof MOCK_SUPPLIERS)[number] | null
  >(null);

  const [supplierSheetOpen, setSupplierSheetOpen] = useState(false);

  const [quickSupplierOpen, setQuickSupplierOpen] = useState(false);

  const [processing, setProcessing] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const transportCharge =
    useWatch({
      control: methods.control,
      name: "transportCharge",
    }) ?? 0;

  const paymentStatus = useWatch({
    control: methods.control,
    name: "paymentStatus",
  });

  const paidAmount =
    useWatch({
      control: methods.control,
      name: "paidAmount",
    }) ?? 0;
  const totals = useMemo(() => {
    return calculatePurchaseTotals(items, transportCharge);
  }, [items, transportCharge]);

  const balanceAmount = Math.max(0, totals.grandTotal - paidAmount);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return [];

    const keyword = search.toLowerCase();

    return MOCK_PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword),
    );
  }, [search]);

  function openEditor(product: Product) {
    setSelectedProduct(product);

    setEditor({
      quantity: 1,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      discount: 0,
      gstRate: product.gst,
    });

    setEditingIndex(null);

    setEditorOpen(true);

    setSearch("");
  }

  function saveProduct() {
    if (!selectedProduct) return;

    const item: PurchaseLineItem = {
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      quantity: editor.quantity,
      purchasePrice: editor.purchasePrice,
      sellingPrice: editor.sellingPrice,
      discount: editor.discount,
      gstRate: editor.gstRate,
    };

    let updatedItems: PurchaseLineItem[];

    if (editingIndex === null) {
      updatedItems = [...items, item];
    } else {
      updatedItems = items.map((p, i) => (i === editingIndex ? item : p));
    }

    setItems(updatedItems);

    methods.setValue("items", updatedItems, {
      shouldValidate: true,
    });

    closeEditor();
  }

  function closeEditor() {
    setSelectedProduct(null);

    setEditingIndex(null);

    setEditor(EMPTY_EDITOR);

    setEditorOpen(false);

    setSearch("");
  }

  function removeProduct(index: number) {
    const updatedItems = items.filter((_, i) => i !== index);

    setItems(updatedItems);

    methods.setValue("items", updatedItems, {
      shouldValidate: true,
    });
  }

  function editProduct(index: number) {
    const item = items[index];

    if (!item) return;

    setEditingIndex(index);

    setSelectedProduct({
      _id: item.productId,
      name: item.productName,
      sku: item.sku,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      gst: item.gstRate,
      stock: 0,
      minimumStock: 0,
      category: "",
      unit: "",
      mrp: item.sellingPrice,
      status: "ACTIVE",
    });

    setEditor({
      quantity: item.quantity,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      discount: item.discount,
      gstRate: item.gstRate,
    });

    setEditorOpen(true);
  }

  async function onSubmit(data: PurchaseForm) {
    try {
      console.log("Saving Purchase...");

      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log(data);

      setSuccessOpen(true);
    } catch (error) {
      console.error(error);
    }
  }

  function handleInvalidSubmit(errors: FieldErrors<PurchaseForm>) {
    toast.error(getFirstErrorMessage(errors));
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
        className="space-y-6 pb-28"
      >
        <PurchaseInfoCard />

        <InvoiceImportCard
          onCamera={() => {
            setProcessing(true);

            setTimeout(() => {
              setProcessing(false);
              setPreviewOpen(true);
            }, 2500);
          }}
          onGallery={() => {
            console.log("Gallery Click");
          }}
        />
        <PurchaseSupplierCard
          supplier={selectedSupplier}
          onSelect={() => setSupplierSheetOpen(true)}
          onAdd={() => setQuickSupplierOpen(true)}
        />

        {selectedSupplier && (
          <SupplierInsights
            supplierName={selectedSupplier.name}
            lastPurchase="12 Jul 2026"
            totalPurchase={245600}
            pendingDue={selectedSupplier.due}
            totalBills={26}
          />
        )}

        {selectedSupplier && (
          <FrequentProducts
            products={FREQUENT_PRODUCTS}
            onSelect={(product) => {
              const found = MOCK_PRODUCTS.find((p) => p.sku === product.sku);

              if (found) {
                openEditor(found);
              }
            }}
          />
        )}

        <section className="space-y-5">
          <NewPurchaseSearch value={search} onChange={setSearch} />
          <PurchaseSummary
            products={totals.products}
            quantity={totals.quantity}
            total={totals.grandTotal}
          />

          {filteredProducts.length > 0 && (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <PurchaseSearchItem
                  key={product._id}
                  product={product}
                  onSelect={openEditor}
                />
              ))}
            </div>
          )}
          <PurchaseSupplierSheet
            open={supplierSheetOpen}
            suppliers={MOCK_SUPPLIERS}
            onClose={() => setSupplierSheetOpen(false)}
            onSelect={(supplier) => {
              setSelectedSupplier(supplier);

              methods.setValue("supplierId", supplier.id, {
                shouldValidate: true,
              });

              setSupplierSheetOpen(false);
            }}
          />

          <PurchaseEditorSheet
            open={editorOpen}
            product={selectedProduct}
            values={editor}
            editing={editingIndex !== null}
            onClose={closeEditor}
            onChange={(field, value) =>
              setEditor((prev) => ({
                ...prev,
                [field]: value,
              }))
            }
            onAdd={saveProduct}
          />

          <PurchaseProductTable
            items={items}
            onEdit={editProduct}
            onDelete={removeProduct}
          />
        </section>

        <TotalsCard totals={totals} />

        <PaymentCard grandTotal={totals.grandTotal} />

        <NotesCard />

        {!editorOpen && (
          <StickySaveBar
            total={totals.grandTotal}
            products={totals.products}
            disabled={items.length === 0}
          />
        )}

        <InvoiceProcessingDialog open={processing} />

        <InvoicePreviewSheet
          open={previewOpen}
          products={OCR_PRODUCTS}
          onClose={() => setPreviewOpen(false)}
          onImport={() => {
            setPreviewOpen(false);
            console.log("Import Products");
          }}
        />
        <QuickSupplierSheet
          open={quickSupplierOpen}
          onOpenChange={setQuickSupplierOpen}
          onSave={(supplier) => {
            const created = {
              id: crypto.randomUUID(),
              name: supplier.businessName,
              mobile: supplier.mobile,
              due: 0,
            };

            setSelectedSupplier(created);

            methods.setValue("supplierId", created.id);

            setQuickSupplierOpen(false);

            toast.success("Supplier created successfully");
          }}
          onMoreDetails={() => {
            toast.info("Supplier details page coming soon.");
          }}
        />
        <PurchaseSuccessSheet
          open={successOpen}
          invoiceNo="PUR-2026-000125"
          supplier={selectedSupplier?.name ?? ""}
          products={totals.products}
          grandTotal={totals.grandTotal}
          paidAmount={paidAmount}
          balanceAmount={balanceAmount}
          paymentStatus={paymentStatus}
          onOpenChange={setSuccessOpen}
          onPrint={() => {
            toast.info("Print feature coming soon.");
          }}
          onShare={() => {
            toast.info("Share feature coming soon.");
          }}
          onView={() => {
            toast.info(
              "Purchase details will be available after backend integration.",
            );
          }}
          onPayment={() => {
            toast.info("Payment module coming soon.");
          }}
          onNew={() => {
            setSuccessOpen(false);

            methods.reset({
              supplierId: "",
              invoiceNo: "",
              purchaseDate: new Date().toISOString().slice(0, 10),
              dueDate: "",
              paymentStatus: "PAID",
              transportCharge: 0,
              paidAmount: 0,
              notes: "",
              items: [],
            });

            setItems([]);
            setSelectedSupplier(null);
            setSelectedProduct(null);
            setEditor(EMPTY_EDITOR);
            setSearch("");

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });

            requestAnimationFrame(() => {
              methods.setFocus("supplierId");
            });
          }}
        />
      </form>
    </FormProvider>
  );
}
