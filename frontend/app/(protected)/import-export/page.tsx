"use client";

import {
  Download,
  FileSpreadsheet,
  Package,
  ShoppingCart,
  Truck,
  Upload,
} from "lucide-react";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ImportExportService from "@/features/import-export/services/import-export.service";
import BusinessService from "@/features/business/services/business.service";

import type {
  ExportEntity,
  ImportEntity,
} from "@/features/import-export/types/import-export.types";

interface ModuleConfig {
  entity: ImportEntity;
  label: string;
  description: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  importEnabled: boolean;
  exportEnabled: boolean;
}

const MODULES: ModuleConfig[] = [
  {
    entity: "PRODUCT",
    label: "Products",
    description: "Import or export your product catalog.",
    icon: Package,
    importEnabled: true,
    exportEnabled: true,
  },
  {
    entity: "SALE",
    label: "Sales",
    description: "Import or export sales transaction data.",
    icon: ShoppingCart,
    importEnabled: true,
    exportEnabled: true,
  },
  {
    entity: "PURCHASE",
    label: "Purchases",
    description: "Import or export purchase transaction data.",
    icon: Truck,
    importEnabled: true,
    exportEnabled: true,
  },
];

export default function ImportExportPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /* ------------------------------------------------------------------------ */
  /* CURRENT BUSINESS                                                         */
  /* ------------------------------------------------------------------------ */

  const { data: business, isLoading: businessLoading } = useQuery({
    queryKey: ["current-business"],
    queryFn: BusinessService.getCurrent,
  });

  const businessId = business?.id;

  /* ------------------------------------------------------------------------ */
  /* BUSINESS REQUIREMENT                                                     */
  /* ------------------------------------------------------------------------ */

  const requiresBusiness = (entity: ImportEntity | ExportEntity) =>
    entity === "SALE" || entity === "PURCHASE";

  /* ------------------------------------------------------------------------ */
  /* IMPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleImport = async (entity: ImportEntity, file: File) => {
    try {
      setLoading(`import-${entity}`);
      setMessage(null);
      setError(null);

      if (requiresBusiness(entity) && !businessId) {
        throw new Error("No active business is selected.");
      }

      const result = await ImportExportService.importFile(
        entity,
        file,
        businessId,
      );

      const data = result?.data ?? result;

      setMessage(
        `${entity} import completed. ` +
          `${data?.imported ?? 0} imported, ` +
          `${data?.skipped ?? 0} skipped, ` +
          `${data?.failed ?? 0} failed.`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to import ${entity}.`,
      );
    } finally {
      setLoading(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* EXPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleExport = async (entity: ExportEntity) => {
    try {
      setLoading(`export-${entity}`);
      setMessage(null);
      setError(null);

      if (requiresBusiness(entity) && !businessId) {
        throw new Error("No active business is selected.");
      }

      const blob = await ImportExportService.exportData(entity, businessId);

      const url = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = url;

      anchor.download = `${entity.toLowerCase()}s.xlsx`;

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      window.URL.revokeObjectURL(url);

      setMessage(`${entity} exported successfully.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to export ${entity}.`,
      );
    } finally {
      setLoading(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* FILE PICKER                                                              */
  /* ------------------------------------------------------------------------ */

  const openFilePicker = (entity: ImportEntity) => {
    if (requiresBusiness(entity) && !businessId) {
      setError("No active business is selected.");

      return;
    }

    fileInputRefs.current[entity]?.click();
  };

  /* ------------------------------------------------------------------------ */
  /* LOADING                                                                  */
  /* ------------------------------------------------------------------------ */

  if (businessLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading business...</div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-card">
              <FileSpreadsheet size={22} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold">Import & Export</h1>

              <p className="text-sm text-muted-foreground">
                Manage your ERP data using Excel files.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {business && (
          <div className="mb-5 rounded-lg border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">Current Business</p>

            <p className="font-medium">{business.name}</p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module) => {
            const Icon = module.icon;

            const importLoading = loading === `import-${module.entity}`;

            const exportLoading = loading === `export-${module.entity}`;

            const needsBusiness = requiresBusiness(module.entity);

            const disabled = loading !== null || (needsBusiness && !businessId);

            return (
              <div
                key={module.entity}
                className="rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h2 className="font-semibold">{module.label}</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>

                <input
                  ref={(element) => {
                    fileInputRefs.current[module.entity] = element;
                  }}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      void handleImport(module.entity, file);
                    }

                    event.target.value = "";
                  }}
                />

                <div className="grid grid-cols-2 gap-3">
                  {module.importEnabled && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => openFilePicker(module.entity)}
                      className="flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Upload size={16} />

                      {importLoading ? "Importing..." : "Import"}
                    </button>
                  )}

                  {module.exportEnabled && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        void handleExport(module.entity as ExportEntity)
                      }
                      className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Download size={16} />

                      {exportLoading ? "Exporting..." : "Export"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border bg-card p-5">
          <div className="flex gap-3">
            <FileSpreadsheet size={19} className="mt-0.5 shrink-0" />

            <div>
              <h3 className="text-sm font-semibold">Excel Import / Export</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Use the exported Excel file as the template when importing data
                back into the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
