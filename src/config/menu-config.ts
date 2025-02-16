
import {
  BarChart3,
  FileText,
  Package,
  Users,
  Briefcase,
  Crown,
  Album,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    id: "sales",
    label: "Sales",
    path: "/admin/sales",
    icon: BarChart3,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "invoices",
    label: "Invoices",
    path: "/admin/invoices",
    icon: FileText,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: Package,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: Users,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "job-orders",
    label: "Job Orders",
    path: "/admin/job-orders",
    icon: Briefcase,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "leaderboard",
    label: "PIC Leaderboard",
    path: "/admin/leaderboard",
    icon: Crown,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "lens-stock",
    label: "Lens Stock",
    path: "/admin/lens-stock",
    icon: Album,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
];
