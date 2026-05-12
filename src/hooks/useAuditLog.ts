import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export type AuditAction = 'create' | 'update' | 'delete';

interface AuditLogEntry {
  tableName: string;
  recordId: string;
  action: AuditAction;
  oldData?: Json | null;
  newData?: Json | null;
  module?: string;
  description?: string;
  changedBy?: string;
}

/**
 * Hook for logging audit entries to the database
 */
export function useAuditLog() {
  /**
   * Log an audit entry
   */
  const logAudit = async ({
    tableName,
    recordId,
    action,
    oldData = null,
    newData = null,
    module,
    description,
    changedBy = 'system',
  }: AuditLogEntry): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from('audit_logs').insert([{
        table_name: tableName,
        record_id: recordId,
        action,
        old_data: oldData,
        new_data: newData,
        module,
        description,
        changed_by: changedBy,
        user_agent: navigator.userAgent,
      }]);

      if (error) {
        console.error('Failed to log audit entry:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Audit log error:', err);
      return { success: false, error: 'Failed to create audit log' };
    }
  };

  /**
   * Log a create action
   */
  const logCreate = (
    tableName: string,
    recordId: string,
    newData: Json,
    module?: string,
    changedBy?: string
  ) => {
    return logAudit({
      tableName,
      recordId,
      action: 'create',
      newData,
      module,
      description: `Created new ${tableName} record`,
      changedBy,
    });
  };

  /**
   * Log an update action
   */
  const logUpdate = (
    tableName: string,
    recordId: string,
    oldData: Json,
    newData: Json,
    module?: string,
    changedBy?: string
  ) => {
    return logAudit({
      tableName,
      recordId,
      action: 'update',
      oldData,
      newData,
      module,
      description: `Updated ${tableName} record`,
      changedBy,
    });
  };

  /**
   * Log a delete action
   */
  const logDelete = (
    tableName: string,
    recordId: string,
    oldData: Json,
    module?: string,
    changedBy?: string
  ) => {
    return logAudit({
      tableName,
      recordId,
      action: 'delete',
      oldData,
      module,
      description: `Deleted ${tableName} record`,
      changedBy,
    });
  };

  return {
    logAudit,
    logCreate,
    logUpdate,
    logDelete,
  };
}
