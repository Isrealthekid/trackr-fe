"use client";

import { useEffect, useRef } from "react";
import type { LatLngBoundsExpression, Map as LeafletMap, Marker } from "leaflet";
import {
  allVehicles,
  statusColor,
  statusLabel,
  type Vehicle,
} from "@/data";

interface LiveMapProps {
  vehicles?: Vehicle[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  height?: string;
  showPolygons?: { id: string; color: string; polygon: [number, number][] }[];
  focusBounds?: [number, number][];
  markerSize?: "sm" | "md";
}

export function LiveMap({
  vehicles = allVehicles,
  selectedId,
  onSelect,
  height = "100%",
  showPolygons,
  focusBounds,
  markerSize = "md",
}: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});

  useEffect(() => {
    let map: LeafletMap | null = null;
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
        worldCopyJump: true,
      }).setView([7.5, 6.5], 6);

      // Free OpenStreetMap tiles via Carto's dark variant (free for prototyping).
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      mapRef.current = map;

      // Polygons (geofences)
      if (showPolygons) {
        showPolygons.forEach((p) => {
          L.polygon(p.polygon, {
            color: p.color,
            weight: 2,
            fillColor: p.color,
            fillOpacity: 0.08,
          }).addTo(map!);
        });
      }

      // Markers
      vehicles.forEach((v) => {
        const color = statusColor(v.status);
        const size = markerSize === "sm" ? 12 : 14;
        const icon = L.divIcon({
          className: "",
          html: `<div class="veh-marker" style="color:${color};background:${color};width:${size}px;height:${size}px"></div>`,
          iconSize: [size + 4, size + 4],
          iconAnchor: [(size + 4) / 2, (size + 4) / 2],
        });
        const marker = L.marker([v.lat, v.lng], { icon, title: v.plate }).addTo(
          map!
        );
        marker.bindPopup(
          `<div style="min-width:180px">
            <div style="font-family:var(--font-dm-mono);font-size:11px;color:#94a3b8">${v.id}</div>
            <div style="font-weight:600;margin-top:2px">${v.nickname} — ${v.plate}</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px">${v.driver}</div>
            <div style="display:flex;justify-content:space-between;gap:8px;margin-top:8px;font-size:11px;color:#cbd5e1">
              <span>${v.speed} km/h</span><span>${v.fuel}% fuel</span>
            </div>
            <div style="margin-top:6px;font-size:10px;color:${color};text-transform:uppercase;letter-spacing:0.08em;font-weight:600">${statusLabel(v.status)}</div>
          </div>`,
          { closeButton: false }
        );
        marker.on("click", () => onSelect?.(v.id));
        markersRef.current[v.id] = marker;
      });

      // Fit bounds
      if (focusBounds && focusBounds.length > 0) {
        map.fitBounds(focusBounds as LatLngBoundsExpression, {
          padding: [60, 60],
          maxZoom: 14,
        });
      } else if (vehicles.length > 0) {
        const bounds = L.latLngBounds(
          vehicles.map((v) => [v.lat, v.lng] as [number, number])
        );
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 });
      }
    })();
    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fly when selection changes
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const v = vehicles.find((x) => x.id === selectedId);
    if (!v) return;
    mapRef.current.flyTo([v.lat, v.lng], 13, { duration: 0.8 });
    markersRef.current[selectedId]?.openPopup();
  }, [selectedId, vehicles]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%" }}
      className="rounded-xl overflow-hidden border border-border-soft"
    />
  );
}
