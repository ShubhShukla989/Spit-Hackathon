import { supabase } from '../lib/supabase';

export interface StockAlert {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  location_id: string;
  location_name: string;
  current_stock: number;
  min_quantity: number;
  max_quantity: number;
  shortage: number;
  suggested_order: number;
  preferred_vendor?: string;
  auto_replenish: boolean;
  severity: 'critical' | 'warning' | 'info';
}

/**
 * Get all active stock alerts based on reorder rules
 */
export const getStockAlerts = async (): Promise<StockAlert[]> => {
  try {
    // Call RPC function to get stock alerts
    const { data, error } = await supabase.rpc('rpc_get_stock_alerts');
    
    if (error) throw error;
    
    // Process and categorize alerts by severity
    const alerts = (data || []).map((alert: any) => {
      const shortage = alert.min_quantity - alert.current_stock;
      const suggestedOrder = alert.max_quantity - alert.current_stock;
      
      // Determine severity
      let severity: 'critical' | 'warning' | 'info' = 'info';
      if (alert.current_stock === 0) {
        severity = 'critical'; // Out of stock
      } else if (alert.current_stock < alert.min_quantity * 0.5) {
        severity = 'critical'; // Less than 50% of minimum
      } else if (alert.current_stock < alert.min_quantity) {
        severity = 'warning'; // Below minimum
      }
      
      return {
        ...alert,
        shortage,
        suggested_order: suggestedOrder,
        severity,
      };
    });
    
    // Sort by severity (critical first)
    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    throw error;
  }
};

/**
 * Get count of alerts by severity
 */
export const getAlertCounts = async () => {
  try {
    const alerts = await getStockAlerts();
    
    return {
      critical: alerts.filter(a => a.severity === 'critical').length,
      warning: alerts.filter(a => a.severity === 'warning').length,
      info: alerts.filter(a => a.severity === 'info').length,
      total: alerts.length,
    };
  } catch (error) {
    console.error('Error getting alert counts:', error);
    return { critical: 0, warning: 0, info: 0, total: 0 };
  }
};

/**
 * Mark alert as acknowledged (optional feature)
 */
export const acknowledgeAlert = async (alertId: string) => {
  try {
    // This could be implemented to track which alerts have been seen
    // For now, it's a placeholder
    console.log('Alert acknowledged:', alertId);
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    throw error;
  }
};
