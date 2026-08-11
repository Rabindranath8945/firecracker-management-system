"use client";

import { UserCheck, UserRoundX, Users, Wallet } from "lucide-react";

import type { Customer } from "../../types/customer";

import StatCard from "@/features/shared/ui/cards/StatCard";

interface Props {
  customers: Customer[];
}

export default function CustomerSummary({ customers }: Props) {
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.isActive,
  ).length;

  const inactiveCustomers = totalCustomers - activeCustomers;

  const receivable = customers.reduce(
    (total, customer) => total + (customer.openingBalance ?? 0),
    0,
  );

  const cards = [
    {
      title: "Customers",
      value: totalCustomers,
      subtitle: "Total Customers",
      icon: <Users className="h-5 w-5" />,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Active",
      value: activeCustomers,
      subtitle: "Currently Active",
      icon: <UserCheck className="h-5 w-5" />,
      iconClassName: "bg-green-100 text-green-700",
    },
    {
      title: "Inactive",
      value: inactiveCustomers,
      subtitle: "Currently Inactive",
      icon: <UserRoundX className="h-5 w-5" />,
      iconClassName: "bg-rose-100 text-rose-700",
    },
    {
      title: "Receivable",
      value: `₹${receivable.toLocaleString("en-IN")}`,
      subtitle: "Outstanding Balance",
      icon: <Wallet className="h-5 w-5" />,
      iconClassName: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          icon={card.icon}
          iconClassName={card.iconClassName}
        />
      ))}
    </section>
  );
}
