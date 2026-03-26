import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.rainviewer.com/public/weather-maps.json", {
      // Evitar caching para obtener el frame más reciente
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("RainViewer API error status:", res.status);
      return NextResponse.json(
        { error: "Error fetching RainViewer maps" },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("RainViewer API fetch failed", err);
    return NextResponse.json(
      { error: "Failed to reach RainViewer API" },
      { status: 502 }
    );
  }
}
