"use client";

import {
  MAX_MULTI_SELECT,
  caloriesOptions,
  cookingOptions,
  formOptions,
  priceOptions,
  proteinOptions,
  sortLabels,
  tasteOptions,
} from "./productsFilterOptions";
import type { ProductsFilterState } from "./useProductsFilter";

type ProductsFilterProps = {
  filters: ProductsFilterState;
  searchInput: string;
  resultsCount: number;
  isMobileOpen: boolean;
  draftFilters: ProductsFilterState;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onChange: (updates: Partial<ProductsFilterState>) => void;
  onToggleCooking: (value: string) => void;
  onToggleForm: (value: string) => void;
  onReset: () => void;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
  onDraftChange: (updates: Partial<ProductsFilterState>) => void;
  onDraftToggleCooking: (value: string) => void;
  onDraftToggleForm: (value: string) => void;
  onDraftReset: () => void;
  onApply: () => void;
};

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`flex items-center justify-between gap-3 rounded-full border px-3 py-2 text-xs font-semibold transition ${
        checked ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]" : "border-black/20 text-black/70"
      }`}
    >
      <span>{label}</span>
      <span
        className={`relative h-4 w-8 rounded-full transition ${
          checked ? "bg-[#e16b4b]" : "bg-black/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
            checked ? "left-4" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export default function ProductsFilter({
  filters,
  searchInput,
  resultsCount,
  isMobileOpen,
  draftFilters,
  onSearchInputChange,
  onSearchSubmit,
  onChange,
  onToggleCooking,
  onToggleForm,
  onReset,
  onOpenMobile,
  onCloseMobile,
  onDraftChange,
  onDraftToggleCooking,
  onDraftToggleForm,
  onDraftReset,
  onApply,
}: ProductsFilterProps) {
  const cookingLimitReached = filters.cooking.length >= MAX_MULTI_SELECT;
  const formLimitReached = filters.form.length >= MAX_MULTI_SELECT;
  const draftCookingLimitReached = draftFilters.cooking.length >= MAX_MULTI_SELECT;
  const draftFormLimitReached = draftFilters.form.length >= MAX_MULTI_SELECT;

  return (
    <>
      <div className="flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={onOpenMobile}
          className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold transition hover:border-black/50"
          aria-label="필터 열기"
        >
          필터
        </button>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
          {resultsCount} items
        </span>
      </div>

      <div className="hidden items-start lg:flex">
        <aside className="w-[240px]">
          <div className="sticky top-6 rounded-2xl border border-black/10 bg-white p-4 text-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">필터</p>
              <button
                type="button"
                onClick={onReset}
                className="text-xs font-semibold text-black/60 transition hover:text-[#e16b4b]"
              >
                초기화
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSearchSubmit();
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  검색
                </label>
                <input
                  value={searchInput}
                  onChange={(event) => onSearchInputChange(event.target.value)}
                  placeholder="제품명/브랜드 검색"
                  className="h-10 w-full rounded-full border border-black/15 bg-white px-4 text-sm font-semibold text-black/70 focus:border-black/40 focus:outline-none"
                  aria-label="제품명 또는 브랜드 검색"
                />
                <button
                  type="submit"
                  className="h-9 rounded-full border border-black/20 px-4 text-xs font-semibold transition hover:border-black/50"
                >
                  검색
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  정렬
                </label>
                <select
                  value={filters.sortKey}
                  onChange={(event) => onChange({ sortKey: event.target.value as ProductsFilterState["sortKey"] })}
                  className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                  aria-label="정렬 기준"
                >
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  가격
                </label>
                <select
                  value={filters.price}
                  onChange={(event) => onChange({ price: event.target.value })}
                  className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                  aria-label="가격 필터"
                >
                  {priceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  단백질
                </label>
                <select
                  value={filters.protein}
                  onChange={(event) => onChange({ protein: event.target.value })}
                  className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                  aria-label="단백질 필터"
                >
                  {proteinOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  칼로리
                </label>
                <select
                  value={filters.calories}
                  onChange={(event) => onChange({ calories: event.target.value })}
                  className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                  aria-label="칼로리 필터"
                >
                  {caloriesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  Taste
                </label>
                <select
                  value={filters.taste}
                  onChange={(event) => onChange({ taste: event.target.value })}
                  className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                  aria-label="Taste 필터"
                >
                  {tasteOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  조리 방식
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/70">
                  {cookingOptions.map((option) => {
                    const checked = filters.cooking.includes(option.value);
                    const disabled = !checked && cookingLimitReached;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                          checked
                            ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]"
                            : "border-black/15"
                        } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleCooking(option.value)}
                          disabled={disabled}
                          className="h-3.5 w-3.5 rounded border-black/30"
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] text-black/40">Up to {MAX_MULTI_SELECT}</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  제품 형태
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/70">
                  {formOptions.map((option) => {
                    const checked = filters.form.includes(option.value);
                    const disabled = !checked && formLimitReached;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                          checked
                            ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]"
                            : "border-black/15"
                        } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleForm(option.value)}
                          disabled={disabled}
                          className="h-3.5 w-3.5 rounded border-black/30"
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] text-black/40">Up to {MAX_MULTI_SELECT}</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  비교 필터
                </label>
                <div className="grid gap-2">
                  <Toggle
                    label="가성비 TOP"
                    checked={filters.valueTop}
                    onChange={() => onChange({ valueTop: !filters.valueTop })}
                  />
                  <Toggle
                    label="저나트륨"
                    checked={filters.lowSodium}
                    onChange={() => onChange({ lowSodium: !filters.lowSodium })}
                  />
                </div>
              </div>
            </form>
          </div>
        </aside>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
        aria-hidden={!isMobileOpen}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white p-5 shadow-2xl transition-transform duration-300 lg:hidden ${
          isMobileOpen ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">필터</p>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-full border border-black/20 px-3 py-1 text-xs font-semibold"
            aria-label="필터 닫기"
          >
            닫기
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">검색</label>
            <input
              value={draftFilters.query}
              onChange={(event) => onDraftChange({ query: event.target.value })}
              placeholder="제품명/브랜드 검색"
              className="h-10 w-full rounded-full border border-black/15 bg-white px-4 text-sm font-semibold text-black/70 focus:border-black/40 focus:outline-none"
              aria-label="제품명 또는 브랜드 검색"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">정렬</label>
            <select
              value={draftFilters.sortKey}
              onChange={(event) =>
                onDraftChange({ sortKey: event.target.value as ProductsFilterState["sortKey"] })
              }
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="정렬 기준"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">가격</label>
            <select
              value={draftFilters.price}
              onChange={(event) => onDraftChange({ price: event.target.value })}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="가격 필터"
            >
              {priceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              단백질
            </label>
            <select
              value={draftFilters.protein}
              onChange={(event) => onDraftChange({ protein: event.target.value })}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="단백질 필터"
            >
              {proteinOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">칼로리</label>
            <select
              value={draftFilters.calories}
              onChange={(event) => onDraftChange({ calories: event.target.value })}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="칼로리 필터"
            >
              {caloriesOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Taste</label>
            <select
              value={draftFilters.taste}
              onChange={(event) => onDraftChange({ taste: event.target.value })}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="Taste 필터"
            >
              {tasteOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              조리 방식
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/70">
              {cookingOptions.map((option) => {
                const checked = draftFilters.cooking.includes(option.value);
                const disabled = !checked && draftCookingLimitReached;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                      checked
                        ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]"
                        : "border-black/15"
                    } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onDraftToggleCooking(option.value)}
                      disabled={disabled}
                      className="h-3.5 w-3.5 rounded border-black/30"
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-black/40">Up to {MAX_MULTI_SELECT}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              제품 형태
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/70">
              {formOptions.map((option) => {
                const checked = draftFilters.form.includes(option.value);
                const disabled = !checked && draftFormLimitReached;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                      checked
                        ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]"
                        : "border-black/15"
                    } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onDraftToggleForm(option.value)}
                      disabled={disabled}
                      className="h-3.5 w-3.5 rounded border-black/30"
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-black/40">Up to {MAX_MULTI_SELECT}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              비교 필터
            </label>
            <div className="grid gap-2">
              <Toggle
                label="가성비 TOP"
                checked={draftFilters.valueTop}
                onChange={() => onDraftChange({ valueTop: !draftFilters.valueTop })}
              />
              <Toggle
                label="저나트륨"
                checked={draftFilters.lowSodium}
                onChange={() => onDraftChange({ lowSodium: !draftFilters.lowSodium })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onDraftReset}
              className="h-10 flex-1 rounded-full border border-black/20 px-4 font-semibold transition hover:border-black/50"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={onApply}
              className="h-10 flex-1 rounded-full bg-[#e16b4b] px-4 font-semibold text-white transition hover:opacity-90"
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
