
import { createContext } from "react";

export interface UserProfile {
  role?: string;
  branch?: string;
}

export const UserProfileContext = createContext<UserProfile | null>(null);
