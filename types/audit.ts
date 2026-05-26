// types/audit.ts
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  endpoint?: string | null;
  ip_address?: string | null;
  created_at: string;
  user?: {
    email: string;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
}