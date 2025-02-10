import { format } from "date-fns";

interface BranchConfig {
  prefix: string;
  startNumber: number;
  fullName: string;
}

export const BRANCH_CONFIGS = {
  KD: {
    fullName: "Kelapa Dua",
    prefix: "KD",
    startNumber: 1,
  },
  GS: {
    fullName: "Gading Serpong",
    prefix: "GS",
    startNumber: 1,
  },
};

// Helper function to get the branch prefix. This version handles both full names and abbreviations.

export function getBranchPrefix(branch: string): string {
  // Direct matches
  if (branch === "Kelapa Dua" || branch === "kelapaduabranch") return "KD";
  if (branch === "Gading Serpong" || branch === "gadingserpongbranch")
    return "GS";

  // If it's already a prefix, return it
  if (branch === "KD" || branch === "GS") return branch;

  throw new Error(`Invalid branch name: ${branch}`);
}
// Helper function to get the full branch name
export function getFullBranchName(branch: string): string {
  const prefix = getBranchPrefix(branch);
  return BRANCH_CONFIGS[prefix]?.fullName || branch;
}

export async function generateInvoiceNumber(
  branch: string,
  supabase: any,
): Promise<string> {
  console.log("Generating invoice number for branch:", branch);
  try {
    const branchPrefix = getBranchPrefix(branch);
    const config = BRANCH_CONFIGS[branchPrefix];
    if (!config) {
      throw new Error(`Invalid branch: ${branch}`);
    }

    const currentDate = new Date();
    const monthYear = format(currentDate, "yyMM");

    const { data, error } = await supabase
      .from("invoices")
      .select("invoice_number, created_at")
      .eq("branch", config.fullName)
      .order("created_at", { ascending: false })
      .limit(1);

    let nextNumber = config.startNumber;

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("Error fetching latest invoice:", error);
      }
    } else if (data?.[0]?.invoice_number) {
      const currentNumber = parseInt(data[0].invoice_number.slice(-3), 10);
      if (!isNaN(currentNumber)) {
        nextNumber = currentNumber + 1;
      }
    }

    if (nextNumber > 999) nextNumber = 1;

    const invoiceNumber = `${config.prefix}${monthYear}${nextNumber.toString().padStart(3, "0")}`;
    console.log("Generated invoice number:", invoiceNumber);
    return invoiceNumber;
  } catch (error) {
    console.error("Invoice number generation error:", error);
    throw error;
  }
}
