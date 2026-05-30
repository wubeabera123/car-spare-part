"use client";

import { useState, useEffect } from "react";
import { Search, ShieldCheck, Truck, Wrench } from "lucide-react";

interface Make {
  id: string;
  name: string;
  slug: string;
}
interface VehicleModel {
  id: string;
  name: string;
  yearStart: number;
  yearEnd: number | null;
}

export function HeroVehicleSearch() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [selectedMake, setSelectedMake] = useState("");

  useEffect(() => {
    fetch("/api/vehicles/makes")
      .then((r) => r.json())
      .then(setMakes)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      return;
    }
    fetch(`/api/vehicles/models?makeId=${selectedMake}`)
      .then((r) => r.json())
      .then(setModels)
      .catch(() => {});
  }, [selectedMake]);

  const currentYear = new Date().getFullYear();

  return (
    <form
      action="/products"
      className="mt-8 grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur sm:grid-cols-[1fr_auto]"
    >
      <div className="grid gap-2 sm:grid-cols-3">
        <select
          name="make"
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
          className="h-12 rounded-lg bg-brand-800/80 px-3 text-sm focus-ring text-white"
        >
          <option value="">Select Make</option>
          {makes.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          name="model"
          className="h-12 rounded-lg bg-brand-800/80 px-3 text-sm focus-ring text-white"
          disabled={!selectedMake}
        >
          <option value="">Select Model</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          name="year"
          className="h-12 rounded-lg bg-brand-800/80 px-3 text-sm focus-ring text-white"
        >
          <option value="">Select Year</option>
          {Array.from({ length: 30 }).map((_, i) => {
            const y = currentYear - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent-600 px-6 font-medium hover:bg-accent-700 transition-colors focus-ring"
      >
        <Search className="h-4 w-4" />
        Find parts
      </button>
    </form>
  );
}
