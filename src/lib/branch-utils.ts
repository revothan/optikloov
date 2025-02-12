
export function normalizeBranchName(branch: string): string {
  const branchMap = {
    gadingserpongbranch: "Gading Serpong",
    kelapaduabranch: "Kelapa Dua",
    gs: "Gading Serpong",
    kd: "Kelapa Dua",
    "Gading Serpong": "Gading Serpong",
    "Kelapa Dua": "Kelapa Dua",
  };

  return branchMap[branch.toLowerCase()] || branch;
}

export function getBranchPrefix(branch: string): string {
  return branch === "Gading Serpong"
    ? "GS"
    : branch === "Kelapa Dua"
      ? "KD"
      : branch;
}
