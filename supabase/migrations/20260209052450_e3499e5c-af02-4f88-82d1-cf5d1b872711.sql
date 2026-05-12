-- Create audit_logs table for tracking all changes
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  old_data JSONB,
  new_data JSONB,
  changed_by TEXT,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  module TEXT,
  description TEXT
);

-- Create index for faster queries
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON public.audit_logs(record_id);
CREATE INDEX idx_audit_logs_changed_at ON public.audit_logs(changed_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_module ON public.audit_logs(module);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can view audit logs
CREATE POLICY "Authenticated users can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (true);

-- Policy: Anyone authenticated can insert audit logs
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Audit logs should not be updated or deleted
-- No UPDATE or DELETE policies