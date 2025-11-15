"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// Map di-load hanya di browser, aman dari SSR
const TrackingMap = dynamic(() => import("@/components/TrackingMap"), {
  ssr: false,
});

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const trackingId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!trackingId) return;

    const loadData = async () => {
      try {
        const res = await fetch(`/api/tracking?id=${trackingId}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [trackingId]);

  if (!trackingId) {
    return <p className="p-4">Tracking ID tidak ditemukan.</p>;
  }

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Tracking Detail</h1>

      <div className="border p-4 rounded-lg">
        <p><strong>ID:</strong> {trackingId}</p>
        <p><strong>Status:</strong> {data?.status}</p>
        <p><strong>Alamat:</strong> {data?.address}</p>
      </div>
      {/* Map aman */}
      <TrackingMap lat={data?.lat || 0} lng={data?.lng || 0} />
    </div>
  );
}