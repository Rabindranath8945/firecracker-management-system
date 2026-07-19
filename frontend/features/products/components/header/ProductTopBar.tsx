"use client";

interface ProductTopBarProps {
  onAdd?: () => void;
}

export default function ProductTopBar() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Products</h1>
      <p className="text-sm text-muted-foreground">Manage your inventory</p>
    </div>
  );
}
