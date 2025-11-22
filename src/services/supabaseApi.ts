import { supabase } from '../lib/supabase';
// Reference generation is now done inline with timestamps

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string;
  category?: { name: string };
  unit_of_measure: string;
  cost: number;
  selling_price: number;
  description?: string;
  image_url?: string;
  active: boolean;
}

export interface StockLevel {
  id: string;
  product_id: string;
  location_id: string;
  on_hand: number;
  reserved: number;
  available: number;
  product?: Product;
  location?: {
    id: string;
    name: string;
    warehouse?: { name: string };
  };
}

export interface Receipt {
  id: string;
  reference: string;
  status: 'draft' | 'ready' | 'done';
  partner: string;
  scheduled_date: string;
  source_document?: string;
  destination_location_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  receipt_lines?: ReceiptLine[];
}

export interface ReceiptLine {
  id: string;
  receipt_id: string;
  product_id: string;
  quantity: number;
  unit_of_measure: string;
  product?: Product;
}

export interface Delivery {
  id: string;
  reference: string;
  status: 'draft' | 'waiting' | 'ready' | 'done';
  partner: string;
  scheduled_date: string;
  source_document?: string;
  source_location_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  delivery_lines?: DeliveryLine[];
}

export interface DeliveryLine {
  id: string;
  delivery_id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  unit_of_measure: string;
  product?: Product;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  active: boolean;
}

export interface Location {
  id: string;
  warehouse_id: string;
  name: string;
  type: 'internal' | 'supplier' | 'customer';
  active: boolean;
  warehouse?: Warehouse;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq('active', true)
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const getStockLevels = async () => {
  const { data, error } = await supabase
    .from('stock_levels')
    .select(`
      *,
      product:products(id, name, sku, unit_of_measure, category:categories(name)),
      location:locations(id, name, warehouse:warehouses(name))
    `)
    .order('product(name)');
  
  if (error) throw error;
  return data || [];
};

export const getReceipts = async () => {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getReceipt = async (id: string) => {
  const { data, error } = await supabase
    .from('receipts')
    .select(`
      *,
      receipt_lines(
        *,
        product:products(id, name, sku, unit_of_measure)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createReceipt = async (receiptData: {
  partner: string;
  scheduled_date: string;
  location_id: string;
  source_document?: string;
  status?: string;
  lines: Array<{
    product_id: string;
    quantity: number;
    location_id?: string;
  }>;
}) => {
  // Generate unique reference based on timestamp
  const timestamp = Date.now();
  const reference = `WH/IN/${timestamp.toString().slice(-8)}`;
  
  // Create receipt header
  const { data: receipt, error: receiptError } = await supabase
    .from('receipts')
    .insert({
      reference: reference,
      partner: receiptData.partner,
      scheduled_date: receiptData.scheduled_date,
      destination_location_id: receiptData.location_id,
      source_document: receiptData.source_document || null,
      status: receiptData.status || 'draft',
    })
    .select()
    .single();
  
  if (receiptError) throw receiptError;
  
  // Create receipt lines
  if (receiptData.lines && receiptData.lines.length > 0) {
    const lines = receiptData.lines.map(line => ({
      receipt_id: receipt.id,
      product_id: line.product_id,
      quantity: line.quantity,
    }));
    
    const { error: linesError } = await supabase
      .from('receipt_lines')
      .insert(lines);
    
    if (linesError) throw linesError;
  }
  
  return receipt;
};

export const validateReceipt = async (receiptId: string) => {
  const { data, error } = await supabase.rpc('rpc_validate_receipt', {
    p_receipt_id: receiptId,
  });
  
  if (error) throw error;
  return data;
};

export const getDeliveries = async () => {
  const { data, error } = await supabase
    .from('delivery_orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getDelivery = async (id: string) => {
  const { data, error } = await supabase
    .from('delivery_orders')
    .select(`
      *,
      delivery_lines(
        *,
        product:products(id, name, sku, unit_of_measure)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createDelivery = async (deliveryData: {
  partner: string;
  scheduled_date: string;
  location_id: string;
  source_document?: string;
  status?: string;
  lines: Array<{
    product_id: string;
    quantity: number;
    location_id?: string;
  }>;
}) => {
  // Generate unique reference based on timestamp
  const timestamp = Date.now();
  const reference = `WH/OUT/${timestamp.toString().slice(-8)}`;
  
  // Create delivery header
  const { data: delivery, error: deliveryError } = await supabase
    .from('delivery_orders')
    .insert({
      reference: reference,
      partner: deliveryData.partner,
      scheduled_date: deliveryData.scheduled_date,
      source_location_id: deliveryData.location_id,
      source_document: deliveryData.source_document || null,
      status: deliveryData.status || 'draft',
    })
    .select()
    .single();
  
  if (deliveryError) throw deliveryError;
  
  // Create delivery lines
  if (deliveryData.lines && deliveryData.lines.length > 0) {
    const lines = deliveryData.lines.map(line => ({
      delivery_id: delivery.id,
      product_id: line.product_id,
      quantity: line.quantity,
    }));
    
    const { error: linesError } = await supabase
      .from('delivery_lines')
      .insert(lines);
    
    if (linesError) throw linesError;
  }
  
  return delivery;
};

export const reserveDeliveryStock = async (deliveryId: string) => {
  const { data, error } = await supabase.rpc('rpc_reserve_delivery_stock', {
    p_delivery_id: deliveryId,
  });
  
  if (error) throw error;
  return data;
};

export const validateDelivery = async (deliveryId: string) => {
  const { data, error } = await supabase.rpc('rpc_validate_delivery', {
    p_delivery_id: deliveryId,
  });
  
  if (error) throw error;
  return data;
};

export const getWarehouses = async () => {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('active', true)
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const getLocations = async () => {
  const { data, error } = await supabase
    .from('locations')
    .select('*, warehouse:warehouses(name)')
    .eq('active', true)
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const getDashboardKPIs = async () => {
  const { data, error } = await supabase.rpc('rpc_get_dashboard_kpis');
  
  if (error) throw error;
  return data;
};

export const getMoveHistory = async (filters?: {
  product_id?: string;
  location_id?: string;
  operation_type?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
}) => {
  try {
    // Fetch receipts with their lines
    const { data: receipts, error: receiptsError } = await supabase
      .from('receipts')
      .select(`
        id,
        reference,
        created_at,
        status,
        destination_location_id,
        receipt_lines (
          quantity,
          product:products (
            id,
            name,
            sku
          )
        )
      `)
      .eq('status', 'done')
      .order('created_at', { ascending: false })
      .limit(filters?.limit || 50);

    if (receiptsError) throw receiptsError;

    // Fetch deliveries with their lines
    const { data: deliveries, error: deliveriesError } = await supabase
      .from('delivery_orders')
      .select(`
        id,
        reference,
        created_at,
        status,
        source_location_id,
        delivery_lines (
          quantity,
          product:products (
            id,
            name,
            sku
          )
        )
      `)
      .eq('status', 'done')
      .order('created_at', { ascending: false })
      .limit(filters?.limit || 50);

    if (deliveriesError) throw deliveriesError;

    // Transform receipts to move history format
    const receiptMoves = (receipts || []).flatMap((receipt: any) =>
      (receipt.receipt_lines || []).map((line: any) => ({
        reference: receipt.reference,
        product_name: line.product?.name || 'Unknown',
        operation_type: 'receipt',
        quantity_change: line.quantity,
        location_name: 'Warehouse', // TODO: Get actual location name
        warehouse_name: 'Main Warehouse',
        created_at: receipt.created_at,
        created_by_name: 'System',
      }))
    );

    // Transform deliveries to move history format
    const deliveryMoves = (deliveries || []).flatMap((delivery: any) =>
      (delivery.delivery_lines || []).map((line: any) => ({
        reference: delivery.reference,
        product_name: line.product?.name || 'Unknown',
        operation_type: 'delivery',
        quantity_change: -line.quantity, // Negative for outgoing
        location_name: 'Warehouse',
        warehouse_name: 'Main Warehouse',
        created_at: delivery.created_at,
        created_by_name: 'System',
      }))
    );

    // Combine and sort by date
    const allMoves = [...receiptMoves, ...deliveryMoves].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return allMoves.slice(0, filters?.limit || 100);
  } catch (error) {
    console.error('Error fetching move history:', error);
    return [];
  }
};

export const createProduct = async (productData: {
  name: string;
  sku: string;
  category_id: string;
  unit_of_measure: string;
  cost: number;
  selling_price: number;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const createCategory = async (categoryData: {
  name: string;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, categoryData: Partial<Category>) => {
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const createWarehouse = async (warehouseData: {
  name: string;
  code: string;
  address?: string;
}) => {
  const { data, error } = await supabase
    .from('warehouses')
    .insert([warehouseData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateWarehouse = async (id: string, warehouseData: Partial<Warehouse>) => {
  const { data, error } = await supabase
    .from('warehouses')
    .update(warehouseData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createLocation = async (locationData: {
  warehouse_id: string;
  name: string;
  type: 'internal' | 'supplier' | 'customer';
}) => {
  const { data, error } = await supabase
    .from('locations')
    .insert([locationData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateLocation = async (id: string, locationData: Partial<Location>) => {
  const { data, error } = await supabase
    .from('locations')
    .update(locationData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};


export const getReorderRules = async () => {
  const { data, error } = await supabase
    .from('reorder_rules')
    .select(`
      *,
      product:products(id, name, sku),
      location:locations(id, name, warehouse:warehouses(name))
    `)
    .eq('active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createReorderRule = async (ruleData: {
  product_id: string;
  location_id?: string;
  min_quantity: number;
  max_quantity: number;
  preferred_vendor?: string;
  auto_replenish: boolean;
}) => {
  const { data, error } = await supabase
    .from('reorder_rules')
    .insert([ruleData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateReorderRule = async (id: string, ruleData: any) => {
  const { data, error } = await supabase
    .from('reorder_rules')
    .update(ruleData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteReorderRule = async (id: string) => {
  const { error } = await supabase
    .from('reorder_rules')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const createStockAdjustment = async (adjustmentData: {
  product_id: string;
  location_id: string;
  quantity_change: number;
  reason: string;
}) => {
  const { data, error } = await supabase.rpc('rpc_create_stock_adjustment', {
    p_product_id: adjustmentData.product_id,
    p_location_id: adjustmentData.location_id,
    p_quantity_change: adjustmentData.quantity_change,
    p_reason: adjustmentData.reason,
  });
  
  if (error) throw error;
  return data;
};
