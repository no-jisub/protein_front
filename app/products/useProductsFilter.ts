"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MAX_MULTI_SELECT, type SortKey } from "./productsFilterOptions";

export type ProductsFilterState = {
  query: string;
  sortKey: SortKey;
  price: string;
  protein: string;
  calories: string;
  taste: string;
  cooking: string[];
  form: string[];
  valueTop: boolean;
  lowSodium: boolean;
};

const defaultFilters: ProductsFilterState = {
  query: "",
  sortKey: "valueForMoney",
  price: "all",
  protein: "all",
  calories: "all",
  taste: "all",
  cooking: [],
  form: [],
  valueTop: false,
  lowSodium: false,
};

function parseMultiParam(value: string | null) {
  if (!value) {
    return [];
  }
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function buildMultiParam(values: string[]) {
  return values.length ? values.join(",") : null;
}

function toggleMultiValue(values: string[], value: string, maxCount: number) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }
  if (values.length >= maxCount) {
    return values;
  }
  return [...values, value];
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
}

function filtersEqual(a: ProductsFilterState, b: ProductsFilterState) {
  return (
    a.query === b.query &&
    a.sortKey === b.sortKey &&
    a.price === b.price &&
    a.protein === b.protein &&
    a.calories === b.calories &&
    a.taste === b.taste &&
    a.valueTop === b.valueTop &&
    a.lowSodium === b.lowSodium &&
    arraysEqual(a.cooking, b.cooking) &&
    arraysEqual(a.form, b.form)
  );
}

export function useProductsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialParamsRef = useRef<ProductsFilterState | null>(null);

  if (!initialParamsRef.current) {
    initialParamsRef.current = {
      ...defaultFilters,
      query: searchParams.get("query")?.trim() ?? "",
      sortKey: (searchParams.get("sort") as SortKey) ?? "valueForMoney",
      price: searchParams.get("price") ?? "all",
      protein: searchParams.get("protein") ?? "all",
      calories: searchParams.get("calories") ?? "all",
      taste: searchParams.get("taste") ?? "all",
      cooking: parseMultiParam(searchParams.get("cooking")),
      form: parseMultiParam(searchParams.get("form")),
      valueTop: searchParams.get("valueTop") === "true",
      lowSodium: searchParams.get("lowSodium") === "true",
    };
  }

  const initialFilters = initialParamsRef.current!;
  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.query);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    const setParam = (key: string, value: string | null) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    };

    Object.entries(updates).forEach(([key, value]) => {
      setParam(key, value);
    });

    const queryString = params.toString();
    router.replace(queryString ? `/products?${queryString}` : "/products");
  };

  const buildUrlUpdates = (updates: Partial<ProductsFilterState>) => {
    const next: Record<string, string | null> = {};
    if ("query" in updates) {
      next.query = updates.query?.trim() || null;
    }
    if ("sortKey" in updates) {
      next.sort = updates.sortKey ?? null;
    }
    if ("price" in updates) {
      next.price = updates.price ?? null;
    }
    if ("protein" in updates) {
      next.protein = updates.protein ?? null;
    }
    if ("calories" in updates) {
      next.calories = updates.calories ?? null;
    }
    if ("taste" in updates) {
      next.taste = updates.taste ?? null;
    }
    if ("cooking" in updates) {
      next.cooking = buildMultiParam(updates.cooking ?? []);
    }
    if ("form" in updates) {
      next.form = buildMultiParam(updates.form ?? []);
    }
    if ("valueTop" in updates) {
      next.valueTop = updates.valueTop ? "true" : null;
    }
    if ("lowSodium" in updates) {
      next.lowSodium = updates.lowSodium ? "true" : null;
    }
    return next;
  };

  const buildAllUrlUpdates = (next: ProductsFilterState) =>
    buildUrlUpdates({
      query: next.query,
      sortKey: next.sortKey,
      price: next.price,
      protein: next.protein,
      calories: next.calories,
      taste: next.taste,
      cooking: next.cooking,
      form: next.form,
      valueTop: next.valueTop,
      lowSodium: next.lowSodium,
    });

  const applyFilters = (next: ProductsFilterState, updates: Record<string, string | null>) => {
    if (!filtersEqual(filters, next)) {
      setFilters(next);
    }
    updateUrl(updates);
  };

  const updateFilters = (updates: Partial<ProductsFilterState>) => {
    const next = { ...filters, ...updates };
    applyFilters(next, buildUrlUpdates(updates));
  };

  const toggleCooking = (value: string) => {
    const next = {
      ...filters,
      cooking: toggleMultiValue(filters.cooking, value, MAX_MULTI_SELECT),
    };
    applyFilters(next, buildUrlUpdates({ cooking: next.cooking }));
  };

  const toggleForm = (value: string) => {
    const next = {
      ...filters,
      form: toggleMultiValue(filters.form, value, MAX_MULTI_SELECT),
    };
    applyFilters(next, buildUrlUpdates({ form: next.form }));
  };

  const applySearch = () => {
    const trimmed = searchInput.trim();
    const next = { ...filters, query: trimmed };
    applyFilters(next, buildUrlUpdates({ query: trimmed }));
  };

  const resetFilters = () => {
    if (searchInput) {
      setSearchInput("");
    }
    applyFilters(
      { ...defaultFilters },
      {
        query: null,
        sort: null,
        price: null,
        protein: null,
        calories: null,
        taste: null,
        cooking: null,
        form: null,
        valueTop: null,
        lowSodium: null,
      }
    );
  };

  const openMobile = () => {
    if (!filtersEqual(draftFilters, filters)) {
      setDraftFilters(filters);
    }
    setIsMobileOpen(true);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const updateDraftFilters = (updates: Partial<ProductsFilterState>) => {
    setDraftFilters((prev) => {
      const next = { ...prev, ...updates };
      return filtersEqual(prev, next) ? prev : next;
    });
  };

  const toggleDraftCooking = (value: string) => {
    updateDraftFilters({
      cooking: toggleMultiValue(draftFilters.cooking, value, MAX_MULTI_SELECT),
    });
  };

  const toggleDraftForm = (value: string) => {
    updateDraftFilters({
      form: toggleMultiValue(draftFilters.form, value, MAX_MULTI_SELECT),
    });
  };

  const resetDraftFilters = () => {
    if (!filtersEqual(draftFilters, defaultFilters)) {
      setDraftFilters(defaultFilters);
    }
  };

  const applyDraftFilters = () => {
    if (searchInput !== draftFilters.query) {
      setSearchInput(draftFilters.query);
    }
    applyFilters(draftFilters, buildAllUrlUpdates(draftFilters));
    setIsMobileOpen(false);
  };

  return {
    filters,
    searchInput,
    setSearchInput,
    applySearch,
    updateFilters,
    toggleCooking,
    toggleForm,
    resetFilters,
    isMobileOpen,
    openMobile,
    closeMobile,
    draftFilters,
    updateDraftFilters,
    toggleDraftCooking,
    toggleDraftForm,
    resetDraftFilters,
    applyDraftFilters,
    maxMultiSelect: MAX_MULTI_SELECT,
  };
}
