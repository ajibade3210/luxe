import type { ReactNode } from "react";

// User and authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: "admin" | "user";
}

export interface AuthSession {
  user: User;
  expiresAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  studioName?: string;
  studioSlug?: string;
  avatarUrl?: string;
}

export interface AuthHeaderProps {
  rightAction?: ReactNode;
  mode?: "login" | "signup";
  claimSlug?: string;
}
