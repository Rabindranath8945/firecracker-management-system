"use client";
import { useState } from "react";
import { toast } from "sonner";

import { useBusiness } from "@/features/business/hooks/useBusiness";
import { useJoinRequest } from "@/features/join-request/hooks/useJoinRequest";

import type { Business } from "@/features/business/types/business.types";

import Image from "next/image";
import { ArrowLeft, QrCode, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JoinBusinessSearchPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [business, setBusiness] = useState<Business | null>(null);

  const { searchBusiness } = useBusiness();

  const { createRequest } = useJoinRequest();

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.error("Please enter a Business ID or Business Name.");

      return;
    }

    try {
      setLoading(true);

      const result = await searchBusiness(search);

      setBusiness(result);
    } catch (error) {
      console.error(error);

      setBusiness(null);

      toast.error("Business not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    if (!business) return;

    try {
      await createRequest({
        businessId: business.id,
      });

      router.push("/join-business/request-sent");
    } catch (error) {
      console.error(error);

      toast.error("Unable to send join request.");
    }
  };

  const handleScanQr = () => {
    toast.info("QR Scanner coming soon.");
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      {/* Background */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-28 -top-20 h-72 w-72 rotate-12 rounded-[80px] bg-sky-100/70 blur-sm" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 -rotate-12 rounded-[80px] bg-sky-100/70 blur-sm" />

        <div className="absolute left-5 top-40 h-20 w-20 rotate-12 border border-sky-200 opacity-60 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />

        <div className="absolute bottom-40 right-5 h-20 w-20 rotate-12 border border-sky-200 opacity-60 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />
      </div>

      {/* Back */}

      <button
        onClick={() => router.back()}
        className="relative z-10 ml-6 mt-8 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white"
      >
        <ArrowLeft className="h-5 w-5 text-slate-700" />
      </button>

      {/* Content */}

      <div className="relative z-10 flex flex-1 flex-col px-8">
        <div className="mt-2 flex flex-col items-center">
          <Image
            src="/onehub.png"
            alt="OneHub"
            width={170}
            height={170}
            priority
          />

          <h1 className="mt-8 text-center text-4xl font-bold text-slate-900">
            Find your Business
          </h1>

          <p className="mt-3 max-w-sm text-center text-base leading-7 text-slate-500">
            Search using a Business ID or Business Name. You can also scan the
            QR code shared by your owner.
          </p>
        </div>

        {/* Search */}

        <div className="mt-12 space-y-5">
          <Input
            placeholder="Business ID or Business Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 rounded-2xl"
          />

          <Button
            className="h-14 w-full rounded-2xl text-base"
            onClick={handleSearch}
            disabled={loading}
          >
            <Search className="mr-2 h-5 w-5" />

            {loading ? "Searching..." : "Search Business"}
          </Button>
        </div>

        {/* Divider */}

        <div className="my-10 flex items-center">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="mx-4 text-sm text-slate-400">OR</span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* QR */}

        <Button
          variant="outline"
          className="h-14 rounded-2xl border-sky-200 text-base"
          onClick={handleScanQr}
        >
          <QrCode className="mr-2 h-5 w-5 text-sky-600" />
          Scan Business QR
        </Button>
        {business && (
          <div className="mt-8 rounded-3xl border border-sky-100 bg-sky-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Business Found</p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {business.name}
                </h2>
              </div>

              <div className="rounded-2xl bg-sky-100 p-3">🏢</div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Business ID
                </p>

                <p className="font-medium">{business.businessId}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p>{business.phone || "-"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Address
                </p>

                <p>{business.address || "-"}</p>
              </div>
            </div>

            <Button
              className="mt-8 h-14 w-full rounded-2xl"
              onClick={handleJoinRequest}
            >
              Send Join Request
            </Button>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-sky-100 bg-sky-50 p-5">
          <h3 className="font-semibold text-slate-900">How do I join?</h3>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li>• Ask your owner for the Business ID.</li>
            <li>• Or scan the Business QR code.</li>
            <li>• Send a join request.</li>
            <li>• Wait for owner approval.</li>
          </ul>
        </div>

        <div className="flex-1" />

        <footer className="pb-8 text-center">
          <p className="text-sm text-slate-500">Version 1.0.0</p>

          <div className="mt-2 flex items-center justify-center gap-1 text-sm">
            <span className="text-slate-500">Built with</span>

            <span className="text-red-500">❤️</span>

            <span className="text-slate-500">by</span>

            <span className="font-semibold text-sky-600">
              Mahendra Tech Solutions
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
