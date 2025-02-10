// adminPermissions.ts
export const isSuperAdmin = (role: string | null) => role === "admin";

export const getBranchFromRole = (role: string | null) => {
  switch (role) {
    case "gadingserpongbranch":
      return "Gading Serpong";
    case "kelapaduabranch":
      return "Kelapa Dua";
    default:
      return null;
  }
};

export const getBranchPrefix = (branch: string) => {
  switch (branch) {
    case "Gading Serpong":
      return "GS";
    case "Kelapa Dua":
      return "KD";
    default:
      return null;
  }
};

export const getBranchName = (branchCode: string) => {
  switch (branchCode) {
    case "GS":
      return "Gading Serpong";
    case "KD":
      return "Kelapa Dua";
    default:
      return branchCode;
  }
};

export const getBranchCode = (branchName: string) => {
  switch (branchName) {
    case "Gading Serpong":
      return "GS";
    case "Kelapa Dua":
      return "KD";
    default:
      return branchName;
  }
};
