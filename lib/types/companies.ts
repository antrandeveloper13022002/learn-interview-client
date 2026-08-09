// Confirmed 2026-08-06 (BE-51/52) — fixed enum, matches the backend's
// EmployeeSizeRange exactly.
export type EmployeeSizeRange = "UNDER_50" | "RANGE_50_200" | "RANGE_200_1000" | "RANGE_1000_5000" | "OVER_5000";

export type Company = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  website: string | null;
  employeeSizeRange: EmployeeSizeRange | null;
  province: { id: string; name: string } | null;
  industries: string[];
};

export type CompanyListResponse = {
  items: Company[];
  total: number;
  page: number;
  pageSize: number;
};

export type CompanyListParams = {
  q?: string;
  page?: number;
  pageSize?: number;
};
