
import { FileText, Users, ShoppingBag, ClipboardList, TrendingUp, Glasses } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  allowedRoles: string[];
}

export const MENU_ITEMS: MenuItem[] = [
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
    icon: ShoppingBag,
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
    icon: ClipboardList,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "sales",
    label: "Sales",
    path: "/admin/sales",
    icon: TrendingUp,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "lens-stock",
    label: "Lens Stock",
    path: "/admin/lens-stock",
    icon: Glasses,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
];
