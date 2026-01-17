export type SortKey = "valueForMoney" | "priceAsc" | "proteinDesc" | "caloriesAsc";

export type Option = {
  value: string;
  label: string;
};

export const sortLabels: Record<SortKey, string> = {
  valueForMoney: "가성비 높은순",
  priceAsc: "가격 낮은순",
  proteinDesc: "단백질 높은순",
  caloriesAsc: "칼로리 낮은순",
};

export const categoryLabels: Record<string, string> = {
  chicken: "닭가슴살",
  protein: "단백질",
  zero: "제로 식품",
};

export const priceOptions: Option[] = [
  { value: "all", label: "가격 전체" },
  { value: "under20000", label: "2만원 미만" },
  { value: "20000-30000", label: "2~3만원" },
  { value: "over30000", label: "3만원 이상" },
];

export const proteinOptions: Option[] = [
  { value: "all", label: "단백질 전체" },
  { value: "20", label: "20g+" },
  { value: "23", label: "23g+" },
  { value: "25", label: "25g+" },
  { value: "30", label: "30g+" },
];

export const caloriesOptions: Option[] = [
  { value: "all", label: "칼로리 전체" },
  { value: "120", label: "120kcal-" },
  { value: "150", label: "150kcal-" },
  { value: "180", label: "180kcal-" },
];

export const cookingOptions: Option[] = [
  { value: "grilled", label: "Grilled" },
  { value: "smoked", label: "Smoked" },
  { value: "sous-vide", label: "Sous-vide" },
  { value: "steamed", label: "Steamed" },
];

export const formOptions: Option[] = [
  { value: "slice", label: "Slice" },
  { value: "steak", label: "Steak" },
  { value: "cube", label: "Cube" },
  { value: "sausage", label: "Sausage" },
];

export const tasteOptions: Option[] = [
  { value: "all", label: "Taste 전체" },
  { value: "plain", label: "Plain" },
  { value: "spicy", label: "Spicy" },
  { value: "smoky", label: "Smoky" },
  { value: "herb", label: "Herb" },
];

export const MAX_MULTI_SELECT = 2;

export function getOptionLabel(options: Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}
