"use client";

interface EditSaleClientProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditSaleClient({ params }: EditSaleClientProps) {
  return <div>Edit Sale</div>;
}
