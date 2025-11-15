"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// Map hanya berjalan di client
const TrackingMap = dynamic(() => import("@/components/TrackingMap"), {
  ssr: false,
});

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const trackingId = searchParams.get("id");

  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!trackingId) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/tracking?id=${trackingId}`);
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [trackingId]);

  if (!trackingId) return <p>Tracking ID tidak ditemukan.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Tracking Detail</h1>

      <div className="border p-4 rounded-lg">
        <p><strong>ID:</strong> {trackingId}</p>
        <p><strong>Status:</strong> {status?.status}</p>
        <p><strong>Alamat:</strong> {status?.address}</p>
      </div>

      <TrackingMap lat={status?.lat || 0} lng={status?.lng || 0} />
    </div>
  );
}
