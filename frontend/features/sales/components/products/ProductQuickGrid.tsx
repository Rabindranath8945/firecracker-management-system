"use client";

import { motion } from "framer-motion";
import { Flame, Package2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSaleStore } from "../../store/useSaleStore";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
}

const products: Product[] = [
  {
    id: "1",
    name: "Rocket",
    image: "",
    price: 20,
    stock: 125,
  },
  {
    id: "2",
    name: "Chocolate Bomb",
    image: "",
    price: 10,
    stock: 62,
  },
  {
    id: "3",
    name: "Flower Pot",
    image: "",
    price: 50,
    stock: 8,
  },
  {
    id: "4",
    name: "Spinner",
    image: "",
    price: 5,
    stock: 0,
  },
];

export function ProductQuickGrid() {
  const quantity = useSaleStore((s) => s.quantity);
  const addItem = useSaleStore((s) => s.addItem);
  const resetQuantity = useSaleStore((s) => s.resetQuantity);

  const handleSelect = (product: Product) => {
    if (product.stock <= 0) return;

    addItem({
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      discount: 0,
      total: quantity * product.price,
    });

    resetQuantity();
  };

  const getStockColor = (stock: number) => {
    if (stock <= 0) return "bg-red-500";

    if (stock <= 10) return "bg-yellow-500";

    return "bg-emerald-500";
  };

  return (
    <section className="space-y-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />

            <h2 className="text-lg font-bold">Frequently Sold</h2>
          </div>
        </div>

        <Badge
          className="
    gap-1
    rounded-full
    border-0
    bg-gradient-to-r
    from-orange-500
    via-amber-500
    to-yellow-500
    px-3
    py-1
    text-white
    shadow-sm
    hover:from-orange-600
    hover:via-amber-600
    hover:to-yellow-600
  "
        >
          <Flame className="h-3.5 w-3.5" />
          Popular
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <motion.div key={product.id} whileTap={{ scale: 0.96 }}>
            <Card className="rounded-3xl p-3 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Product Icon */}

                <div
                  className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-primary/10
            "
                >
                  <Package2 className="h-7 w-7 text-primary" />
                </div>

                {/* Product Details */}

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="line-clamp-1 text-sm font-semibold">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-primary">
                        ₹{product.price}
                      </p>
                    </div>

                    <Button
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      disabled={product.stock === 0}
                      onClick={() => handleSelect(product)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${getStockColor(
                        product.stock,
                      )}`}
                    />

                    <span className="text-xs text-muted-foreground">
                      {product.stock} Available
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
