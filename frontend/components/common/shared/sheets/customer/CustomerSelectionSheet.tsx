"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  Sparkles,
  User,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCustomers } from "@/features/customers/hooks/useCustomers";
import type {
  Customer,
  CustomerFormData,
} from "@/features/customers/types/customer";

import CustomerService from "@/features/customers/services/customer.service";

import { useSaleStore } from "@/features/sales/store/useSaleStore";

import CustomerListItem from "./CustomerListItem";
import CustomerSearch from "./CustomerSearch";
import WalkInCustomerCard from "./WalkInCustomerCard";

interface CustomerSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerSelectionSheet({
  open,
  onOpenChange,
}: CustomerSelectionSheetProps) {
  const [search, setSearch] = useState("");

  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");

  const [nameMatch, setNameMatch] = useState<Customer | null>(null);
  const [mobileMatch, setMobileMatch] = useState<Customer | null>(null);

  const [checkingName, setCheckingName] = useState(false);
  const [checkingMobile, setCheckingMobile] = useState(false);

  const [savingCustomer, setSavingCustomer] = useState(false);
  const [error, setError] = useState("");

  const { customers, loading } = useCustomers({
    search,
    page: 1,
    limit: 100,
  });

  const {
    selectedCustomer,
    setSelectedCustomer,
    setPreviousDue,
    setCollectPreviousDue,
  } = useSaleStore();

  /* ---------------------------------------------------------------------- */
  /* Select Customer                                                         */
  /* ---------------------------------------------------------------------- */

  function selectCustomer(customer: Customer) {
    const due = customer.openingBalance ?? 0;

    setSelectedCustomer({
      _id: customer._id,
      name: customer.name,
      mobile: customer.mobile ?? "",
      dueAmount: due,
      lastVisit: "",
      walkIn: false,
    });

    setPreviousDue(due);
    setCollectPreviousDue(true);

    onOpenChange(false);
  }

  /* ---------------------------------------------------------------------- */
  /* Walk In                                                                 */
  /* ---------------------------------------------------------------------- */

  function selectWalkIn() {
    setSelectedCustomer(null);
    setPreviousDue(0);
    setCollectPreviousDue(false);

    onOpenChange(false);
  }

  /* ---------------------------------------------------------------------- */
  /* Open Quick Add                                                          */
  /* ---------------------------------------------------------------------- */

  function openQuickAdd() {
    setCustomerName("");
    setCustomerMobile("");

    setNameMatch(null);
    setMobileMatch(null);

    setError("");

    setQuickAddOpen(true);
  }

  /* ---------------------------------------------------------------------- */
  /* Close Quick Add                                                         */
  /* ---------------------------------------------------------------------- */

  function closeQuickAdd() {
    if (savingCustomer) return;

    setQuickAddOpen(false);

    setCustomerName("");
    setCustomerMobile("");

    setNameMatch(null);
    setMobileMatch(null);

    setError("");
  }

  /* ---------------------------------------------------------------------- */
  /* Check Name                                                              */
  /* ---------------------------------------------------------------------- */

  async function checkName(value: string) {
    const name = value.trim();

    if (name.length < 2) {
      setNameMatch(null);
      return;
    }

    const normalizedName = name.toLowerCase();

    // First check customers already loaded in the sheet
    const localMatch =
      customers.find(
        (customer) => customer.name.trim().toLowerCase() === normalizedName,
      ) ?? null;

    if (localMatch) {
      setNameMatch(localMatch);
      return;
    }

    // Fallback to backend search
    try {
      setCheckingName(true);

      const response = await CustomerService.getCustomers({
        search: name,
        page: 1,
        limit: 100,
      });

      const exactMatch =
        response.items.find(
          (customer) => customer.name.trim().toLowerCase() === normalizedName,
        ) ?? null;

      setNameMatch(exactMatch);
    } catch (error) {
      console.error("Customer name duplicate check failed:", error);
    } finally {
      setCheckingName(false);
    }
  }

  useEffect(() => {
    const name = customerName.trim();

    if (name.length < 2) {
      setNameMatch(null);
      setCheckingName(false);
      return;
    }

    setCheckingName(true);

    const timer = window.setTimeout(() => {
      void checkName(name);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [customerName, customers]);

  /* ---------------------------------------------------------------------- */
  /* Check Mobile                                                            */
  /* ---------------------------------------------------------------------- */

  async function checkMobile(value: string) {
    const mobile = value.trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileMatch(null);
      return;
    }

    // First check customers already loaded in the sheet
    const localMatch =
      customers.find((customer) => customer.mobile?.trim() === mobile) ?? null;

    if (localMatch) {
      setMobileMatch(localMatch);
      return;
    }

    // Fallback to backend search
    try {
      setCheckingMobile(true);

      const response = await CustomerService.getCustomers({
        search: mobile,
        page: 1,
        limit: 100,
      });

      const exactMatch =
        response.items.find((customer) => customer.mobile?.trim() === mobile) ??
        null;

      setMobileMatch(exactMatch);
    } catch (error) {
      console.error("Customer mobile duplicate check failed:", error);
    } finally {
      setCheckingMobile(false);
    }
  }

  useEffect(() => {
    const mobile = customerMobile.trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileMatch(null);
      setCheckingMobile(false);
      return;
    }

    setCheckingMobile(true);

    const timer = window.setTimeout(() => {
      void checkMobile(mobile);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [customerMobile, customers]);

  /* ---------------------------------------------------------------------- */
  /* Select Existing From Quick Add                                         */
  /* ---------------------------------------------------------------------- */

  function selectExistingCustomer(customer: Customer) {
    selectCustomer(customer);

    setQuickAddOpen(false);

    setCustomerName("");
    setCustomerMobile("");

    setNameMatch(null);
    setMobileMatch(null);
    setError("");
  }

  /* ---------------------------------------------------------------------- */
  /* Save Quick Customer                                                     */
  /* ---------------------------------------------------------------------- */

  async function handleQuickAdd() {
    const name = customerName.trim();
    const mobile = customerMobile.trim();

    setError("");

    if (!name) {
      setError("Customer name is required.");
      return;
    }

    if (name.length < 2) {
      setError("Customer name must contain at least 2 characters.");
      return;
    }

    if (!mobile) {
      setError("Mobile number is required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (mobileMatch) {
      setError("This mobile number already belongs to an existing customer.");
      return;
    }

    try {
      setSavingCustomer(true);

      const payload: CustomerFormData = {
        name,
        mobile,
        email: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        gstNo: "",
        openingBalance: 0,
        type: "CUSTOMER",
        isActive: true,
      };

      const createdCustomer = await CustomerService.createCustomer(payload);

      setSelectedCustomer({
        _id: createdCustomer._id,
        name: createdCustomer.name,
        mobile: createdCustomer.mobile,
        dueAmount: createdCustomer.openingBalance ?? 0,
        lastVisit: "",
        walkIn: false,
      });

      setPreviousDue(createdCustomer.openingBalance ?? 0);

      setCollectPreviousDue(true);

      setQuickAddOpen(false);
      onOpenChange(false);

      setCustomerName("");
      setCustomerMobile("");

      setNameMatch(null);
      setMobileMatch(null);
      setError("");
    } catch (error) {
      console.error("Quick customer creation failed:", error);

      setError(
        "Customer could not be created. This mobile number may already exist.",
      );
    } finally {
      setSavingCustomer(false);
    }
  }

  const duplicateChecking = checkingName || checkingMobile;

  const mobileValid = /^[6-9]\d{9}$/.test(customerMobile);

  const canSave =
    customerName.trim().length >= 2 &&
    mobileValid &&
    !mobileMatch &&
    !savingCustomer &&
    !duplicateChecking;

  return (
    <>
      {/* ================================================================== */}
      {/* CUSTOMER SELECTION SHEET                                           */}
      {/* ================================================================== */}

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-[32px] p-0">
          <SheetHeader className="border-b p-6">
            <SheetTitle className="text-xl">Select Customer</SheetTitle>

            <CustomerSearch value={search} onChange={setSearch} />
          </SheetHeader>

          <div className="px-4 pt-3">
            <WalkInCustomerCard onClick={selectWalkIn} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Loading customers...
                </p>
              </div>
            ) : customers.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center">
                <User className="mb-3 h-10 w-10 text-slate-300" />

                <p className="font-medium">No Customers Found</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first customer
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customers.map((customer: Customer) => (
                  <CustomerListItem
                    key={customer._id}
                    customer={customer}
                    selected={selectedCustomer?._id === customer._id}
                    onSelect={selectCustomer}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Add */}

          <div className="border-t bg-background p-4">
            <Button
              type="button"
              variant="outline"
              className="
                h-12
                w-full
                rounded-2xl
                border-violet-200
                text-violet-700
                hover:bg-violet-50
              "
              onClick={openQuickAdd}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ================================================================== */}
      {/* PREMIUM QUICK ADD CUSTOMER DIALOG                                  */}
      {/* ================================================================== */}

      <Dialog
        open={quickAddOpen}
        onOpenChange={(value) => {
          if (!value) {
            closeQuickAdd();
          }
        }}
      >
        <DialogContent
          className="
            w-[calc(100%-24px)]
            max-w-md
            overflow-hidden
            rounded-[28px]
            border
            p-0
            shadow-2xl
          "
        >
          {/* Header */}

          <div className="px-5 pb-2 pt-5">
            <DialogHeader className="text-left">
              <DialogTitle className="flex items-center gap-3 text-lg font-bold text-slate-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                  <User className="h-5 w-5 text-violet-700" />
                </span>

                <span>Add Customer</span>
              </DialogTitle>

              <DialogDescription className="pl-[52px] text-[11px] leading-5">
                Quickly add a customer for this sale. You can update more
                details later.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4 px-5 pb-5 pt-3">
            {/* ============================================================ */}
            {/* NAME                                                          */}
            {/* ============================================================ */}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="quick-customer-name"
                  className="text-xs font-bold text-slate-700"
                >
                  Customer Name
                </label>

                {customerName.trim().length >= 2 && !checkingName && (
                  <span
                    className={
                      nameMatch
                        ? "flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700"
                        : "flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700"
                    }
                  >
                    {nameMatch ? (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        Already exists
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Looks good
                      </>
                    )}
                  </span>
                )}
              </div>

              <Input
                id="quick-customer-name"
                value={customerName}
                onChange={(event) => {
                  setCustomerName(event.target.value);
                  setError("");
                }}
                placeholder="Enter customer name"
                autoFocus
                disabled={savingCustomer}
                className="
    h-11
    rounded-xl
    border-slate-200
    text-sm
    focus-visible:ring-violet-500
  "
              />

              {/* Existing name suggestion */}

              {nameMatch && (
                <div
                  className="
      rounded-2xl
      border
      border-amber-200
      bg-amber-50
      p-3
    "
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-amber-800">
                        This customer already exists.
                      </p>

                      <p className="mt-0.5 text-[10px] text-amber-700">
                        {nameMatch.name}
                        {nameMatch.mobile ? ` • ${nameMatch.mobile}` : ""}
                      </p>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => selectExistingCustomer(nameMatch)}
                        className="
            mt-1.5
            h-7
            px-2
            text-[10px]
            font-bold
            text-amber-800
            hover:bg-amber-100
          "
                      >
                        Select Existing Customer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* MOBILE                                                         */}
            {/* ============================================================ */}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="quick-customer-mobile"
                  className="text-xs font-bold text-slate-700"
                >
                  Mobile Number
                </label>

                {mobileValid && !checkingMobile && (
                  <span
                    className={
                      mobileMatch
                        ? "flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold text-red-600"
                        : "flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700"
                    }
                  >
                    {mobileMatch ? (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        Already exists
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Available
                      </>
                    )}
                  </span>
                )}
              </div>

              <Input
                id="quick-customer-mobile"
                value={customerMobile}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setCustomerMobile(value);
                  setError("");
                }}
                placeholder="10-digit mobile number"
                inputMode="numeric"
                maxLength={10}
                disabled={savingCustomer}
                className={`
                  h-11
                  rounded-xl
                  text-sm
                  focus-visible:ring-violet-500
                  ${
                    mobileMatch
                      ? "border-red-300 bg-red-50/30 focus-visible:ring-red-500"
                      : "border-slate-200"
                  }
                `}
              />

              {/* Existing mobile */}

              {mobileMatch && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-3
                  "
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-red-700">
                        This mobile number is already registered.
                      </p>

                      <p className="mt-0.5 text-[10px] text-red-600">
                        We found an existing customer with this number.
                      </p>

                      {/* Existing Customer */}

                      <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-red-100 bg-white p-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-700">
                          {mobileMatch.name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part.charAt(0))
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-900">
                            {mobileMatch.name}
                          </p>

                          <p className="text-[10px] text-slate-500">
                            {mobileMatch.mobile}
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => selectExistingCustomer(mobileMatch)}
                          className="
                            h-8
                            shrink-0
                            rounded-lg
                            border-violet-300
                            px-2.5
                            text-[10px]
                            font-bold
                            text-violet-700
                            hover:bg-violet-50
                          "
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* SUGGESTION                                                     */}
            {/* ============================================================ */}

            {(nameMatch || mobileMatch) && (
              <div
                className="
                  flex
                  items-start
                  gap-2.5
                  rounded-2xl
                  border
                  border-violet-200
                  bg-violet-50
                  p-3
                "
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                  <Sparkles className="h-4 w-4 text-violet-600" />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-violet-800">
                    Smart suggestion
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-violet-700">
                    {mobileMatch
                      ? "Select the existing customer above instead of creating a duplicate."
                      : "This name already exists. Check the existing customer before creating another one."}
                  </p>
                </div>
              </div>
            )}

            {/* Checking */}

            {duplicateChecking && (
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
                Checking customer details...
              </div>
            )}

            {/* Error */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* ============================================================ */}
            {/* SAVE                                                           */}
            {/* ============================================================ */}

            <Button
              type="button"
              disabled={!canSave}
              onClick={handleQuickAdd}
              className="
                h-12
                w-full
                rounded-xl
                bg-violet-600
                text-sm
                font-bold
                shadow-lg
                shadow-violet-200
                transition-all
                hover:bg-violet-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Plus className="mr-2 h-4 w-4" />

              {savingCustomer ? "Saving Customer..." : "Save Customer"}
            </Button>

            <p className="text-center text-[9px] text-slate-400">
              More customer details can be added later from the Customers
              module.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
