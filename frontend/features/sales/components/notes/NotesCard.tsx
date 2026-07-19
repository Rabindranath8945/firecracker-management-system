"use client";

import { FileText } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useSaleStore } from "@/features/sales/store/useSaleStore";

export function NotesCard() {
  const notes = useSaleStore((state) => state.notes);
  const setNotes = useSaleStore((state) => state.setNotes);

  return (
    <Card className="rounded-3xl p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-3">
          <FileText className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">Notes</h2>

          <p className="text-sm text-muted-foreground">
            Internal remarks for this sale
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sale-notes">Sale Notes</Label>

        <Textarea
          id="sale-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Example: Home delivery, customer requested gift packing..."
          rows={4}
          className="resize-none rounded-2xl"
        />
      </div>
    </Card>
  );
}
