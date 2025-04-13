"use client";
import { useEffect, useState } from "react";

export function useShelters() {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    const fetchShelters = async () => {
      const res = await fetch("/api/shelters");
      const data = await res.json();
      setShelters(data);
    };

    fetchShelters();
  }, []);

  return shelters;
}
