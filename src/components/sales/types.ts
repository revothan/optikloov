
export type BranchCode = "GS" | "KD";

export interface BranchSales {
  GS: number;
  KD: number;
}

export interface SalesReportProps {
  userBranch?: BranchCode | "Admin";
  isAdmin?: boolean;
  dailyTarget: number;
}

export const branchMap = {
  GS: "Gading Serpong",
  KD: "Kelapa Dua",
} as const;
