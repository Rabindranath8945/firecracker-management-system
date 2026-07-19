"use client";

import { useState } from "react";
import {
  CalendarDays,
  Phone,
  Search,
  UserRound,
  Wallet,
  Users,
} from "lucide-react";
import { Button } from "@base-ui/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomerSearchResult, SearchCustomer } from "./CustomerSearchResult";
import { useCustomerSearch } from "../../hooks/useCustomerSearch";

type Customer = {
  id?: string;
  name: string;
  phone: string;
  due?: number;
  lastVisit?: string;
  walkIn?: boolean;
};

export function CustomerSelector() {
  const { query, setQuery, customers, loading } = useCustomerSearch();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer>({
    name: "Walk-in Customer",
    phone: "Cash Sale",
    walkIn: true,
  });

  return (
    <Card className="rounded-3xl px-4 py-2 shadow-sm">
      {/* Header */}

      <div className="mt-1 flex items-center gap-2">
        <UserRound className="h-5 w-5 text-blue-600" />

        <h2 className="text-lg font-bold">Customer</h2>
      </div>

      {/* Search */}
      <div className="mt-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer..."
            className="
        h-11
        rounded-2xl
        border-slate-200
        bg-slate-50
        pl-12
      "
          />
        </div>

        <Button
          type="button"
          onClick={() => {
            setSelectedCustomer({
              id: "walk-in",
              name: "Walk-in Customer",
              phone: "Cash Sale",
              due: 0,
              lastVisit: "-",
              walkIn: true,
            });

            setQuery("");
          }}
          className={`
      rounded-full
      h-9
      px-4
      transition-all

      ${
        selectedCustomer.walkIn
          ? "bg-emerald-600 text-white hover:bg-emerald-600"
          : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }
    `}
        >
          Cash Sale
        </Button>
      </div>

      <CustomerSearchResult
        customers={customers}
        onSelect={(customer) => {
          setSelectedCustomer({
            ...customer,
            walkIn: false,
          });

          setQuery("");
        }}
      />

      {/* Customer Card */}

      <div
        className={`
          mt-1
          rounded-2xl
          border
          p-3
          transition-all

          ${
            selectedCustomer.walkIn
              ? "border-emerald-200 bg-emerald-50"
              : "border-blue-200 bg-blue-50"
          }
        `}
      >
        <div className="flex items-start">
          {/* Avatar */}

          <div
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full

              ${selectedCustomer.walkIn ? "bg-emerald-100" : "bg-blue-100"}
            `}
          >
            <UserRound
              className={`
                h-5
                w-5

                ${
                  selectedCustomer.walkIn ? "text-emerald-600" : "text-blue-600"
                }
              `}
            />
          </div>

          {/* Customer */}

          <div className="ml-3 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{selectedCustomer.name}</h3>

              <Badge
                className={
                  selectedCustomer.walkIn
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }
              >
                {selectedCustomer.walkIn ? "Default" : "Customer"}
              </Badge>
            </div>

            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />

              {selectedCustomer.phone}
            </div>
          </div>
        </div>

        {/* Customer Details */}

        {!selectedCustomer.walkIn && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-3 py-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-red-500" />

              <span className="text-xs text-muted-foreground">Due</span>

              <span className="font-semibold text-red-600">
                ₹{selectedCustomer.due ?? 0}
              </span>
            </div>

            <div className="h-5 w-px bg-border" />

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-500" />

              <span className="text-xs text-muted-foreground">
                {selectedCustomer.lastVisit}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Search Result comes here in next step */}
    </Card>
  );
}
