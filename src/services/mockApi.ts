import { generateReceiptReference, generateDeliveryReference } from './referenceGenerator';

// Types
export type ReceiptStatus = 'draft' | 'ready' | 'done';
export type DeliveryStatus = 'draft' | 'waiting' | 'ready' | 'done';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  onHand: number;
  reserved: number;
  available: number;
  unit: string;
}

export interface ReceiptLine {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface Receipt {
  id: string;
  reference: string;
  status: ReceiptStatus;
  partner: string;
  scheduledDate: string;
  sourceDocument?: string;
  lines: ReceiptLine[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryLine {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  available: number;
  unit: string;
}

export interface Delivery {
  id: string;
  reference: string;
  status: DeliveryStatus;
  partner: string;
  scheduledDate: string;
  sourceDocument?: string;
  lines: DeliveryLine[];
  createdAt: string;
  updatedAt: string;
}

export interface MoveHistoryEntry {
  id: string;
  reference: string;
  product: string;
  type: 'in' | 'out';
  quantity: number;
  from: string;
  to: string;
  date: string;
  status: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  warehouseId: string;
  warehouseName: string;
  type: 'internal' | 'supplier' | 'customer';
  active: boolean;
}

// Mock data
const mockProducts: Product[] = [
  { id: '1', name: 'Laptop Dell XPS 15', sku: 'LAP-001', category: 'Electronics', onHand: 45, reserved: 5, available: 40, unit: 'Units' },
  { id: '2', name: 'Office Chair Ergonomic', sku: 'FUR-002', category: 'Furniture', onHand: 120, reserved: 20, available: 100, unit: 'Units' },
  { id: '3', name: 'Wireless Mouse Logitech', sku: 'ACC-003', category: 'Accessories', onHand: 200, reserved: 30, available: 170, unit: 'Units' },
  { id: '4', name: 'Monitor 27" 4K', sku: 'MON-004', category: 'Electronics', onHand: 60, reserved: 10, available: 50, unit: 'Units' },
  { id: '5', name: 'Desk Lamp LED', sku: 'LIG-005', category: 'Lighting', onHand: 85, reserved: 5, available: 80, unit: 'Units' },
];

const mockReceipts: Receipt[] = [
  {
    id: '1',
    reference: 'WH/IN/0001',
    status: 'draft',
    partner: 'Tech Suppliers Inc.',
    scheduledDate: '2025-11-25',
    sourceDocument: 'PO-2025-001',
    lines: [
      { id: '1', productId: '1', productName: 'Laptop Dell XPS 15', quantity: 20, unit: 'Units' },
      { id: '2', productId: '4', productName: 'Monitor 27" 4K', quantity: 15, unit: 'Units' },
    ],
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-20T10:00:00Z',
  },
  {
    id: '2',
    reference: 'WH/IN/0002',
    status: 'ready',
    partner: 'Office Furniture Co.',
    scheduledDate: '2025-11-23',
    sourceDocument: 'PO-2025-002',
    lines: [
      { id: '3', productId: '2', productName: 'Office Chair Ergonomic', quantity: 50, unit: 'Units' },
    ],
    createdAt: '2025-11-18T14:30:00Z',
    updatedAt: '2025-11-21T09:15:00Z',
  },
  {
    id: '3',
    reference: 'WH/IN/0003',
    status: 'done',
    partner: 'Accessories World',
    scheduledDate: '2025-11-20',
    lines: [
      { id: '4', productId: '3', productName: 'Wireless Mouse Logitech', quantity: 100, unit: 'Units' },
      { id: '5', productId: '5', productName: 'Desk Lamp LED', quantity: 40, unit: 'Units' },
    ],
    createdAt: '2025-11-15T08:00:00Z',
    updatedAt: '2025-11-20T16:45:00Z',
  },
  {
    id: '4',
    reference: 'WH/IN/0004',
    status: 'draft',
    partner: 'Global Electronics',
    scheduledDate: '2025-11-26',
    sourceDocument: 'PO-2025-003',
    lines: [
      { id: '6', productId: '4', productName: 'Monitor 27" 4K', quantity: 25, unit: 'Units' },
    ],
    createdAt: '2025-11-21T11:20:00Z',
    updatedAt: '2025-11-21T11:20:00Z',
  },
];

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    reference: 'WH/OUT/0001',
    status: 'draft',
    partner: 'ABC Corporation',
    scheduledDate: '2025-11-24',
    sourceDocument: 'SO-2025-001',
    lines: [
      { id: '1', productId: '1', productName: 'Laptop Dell XPS 15', quantity: 10, available: 40, unit: 'Units' },
      { id: '2', productId: '3', productName: 'Wireless Mouse Logitech', quantity: 20, available: 170, unit: 'Units' },
    ],
    createdAt: '2025-11-20T09:00:00Z',
    updatedAt: '2025-11-20T09:00:00Z',
  },
  {
    id: '2',
    reference: 'WH/OUT/0002',
    status: 'waiting',
    partner: 'XYZ Enterprises',
    scheduledDate: '2025-11-25',
    sourceDocument: 'SO-2025-002',
    lines: [
      { id: '3', productId: '1', productName: 'Laptop Dell XPS 15', quantity: 50, available: 40, unit: 'Units' },
    ],
    createdAt: '2025-11-19T13:30:00Z',
    updatedAt: '2025-11-21T10:00:00Z',
  },
  {
    id: '3',
    reference: 'WH/OUT/0003',
    status: 'ready',
    partner: 'Tech Startup LLC',
    scheduledDate: '2025-11-23',
    lines: [
      { id: '4', productId: '2', productName: 'Office Chair Ergonomic', quantity: 30, available: 100, unit: 'Units' },
      { id: '5', productId: '5', productName: 'Desk Lamp LED', quantity: 15, available: 80, unit: 'Units' },
    ],
    createdAt: '2025-11-17T15:00:00Z',
    updatedAt: '2025-11-22T11:30:00Z',
  },
  {
    id: '4',
    reference: 'WH/OUT/0004',
    status: 'done',
    partner: 'Retail Store Chain',
    scheduledDate: '2025-11-21',
    sourceDocument: 'SO-2025-003',
    lines: [
      { id: '6', productId: '4', productName: 'Monitor 27" 4K', quantity: 20, available: 50, unit: 'Units' },
    ],
    createdAt: '2025-11-16T10:00:00Z',
    updatedAt: '2025-11-21T14:20:00Z',
  },
];

const mockMoveHistory: MoveHistoryEntry[] = [
  { id: '1', reference: 'WH/IN/0003', product: 'Wireless Mouse Logitech', type: 'in', quantity: 100, from: 'Suppliers', to: 'WH/Stock', date: '2025-11-20', status: 'Done' },
  { id: '2', reference: 'WH/OUT/0004', product: 'Monitor 27" 4K', type: 'out', quantity: 20, from: 'WH/Stock', to: 'Customers', date: '2025-11-21', status: 'Done' },
  { id: '3', reference: 'WH/IN/0003', product: 'Desk Lamp LED', type: 'in', quantity: 40, from: 'Suppliers', to: 'WH/Stock', date: '2025-11-20', status: 'Done' },
  { id: '4', reference: 'WH/OUT/0003', product: 'Office Chair Ergonomic', type: 'out', quantity: 30, from: 'WH/Stock', to: 'Customers', date: '2025-11-22', status: 'Ready' },
];

const mockWarehouses: Warehouse[] = [
  { id: '1', name: 'Main Warehouse', code: 'WH-MAIN', address: '123 Industrial Blvd, City, State 12345', active: true },
  { id: '2', name: 'Secondary Warehouse', code: 'WH-SEC', address: '456 Storage Ave, City, State 12346', active: true },
];

const mockLocations: Location[] = [
  { id: '1', name: 'Stock', warehouseId: '1', warehouseName: 'Main Warehouse', type: 'internal', active: true },
  { id: '2', name: 'Receiving', warehouseId: '1', warehouseName: 'Main Warehouse', type: 'internal', active: true },
  { id: '3', name: 'Shipping', warehouseId: '1', warehouseName: 'Main Warehouse', type: 'internal', active: true },
  { id: '4', name: 'Suppliers', warehouseId: '1', warehouseName: 'Main Warehouse', type: 'supplier', active: true },
  { id: '5', name: 'Customers', warehouseId: '1', warehouseName: 'Main Warehouse', type: 'customer', active: true },
];

// Simulate API delay and error
const simulateDelay = (): Promise<void> => {
  const delay = Math.floor(Math.random() * 500) + 300;
  return new Promise(resolve => setTimeout(resolve, delay));
};

const simulateError = (): boolean => {
  return Math.random() < 0.05;
};

// API functions
export const getReceipts = async (): Promise<Receipt[]> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to fetch receipts');
  return [...mockReceipts];
};

export const getReceipt = async (id: string): Promise<Receipt | null> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to fetch receipt');
  return mockReceipts.find(r => r.id === id) || null;
};

export const createReceipt = async (data: Partial<Receipt>): Promise<Receipt> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to create receipt');
  
  const newReceipt: Receipt = {
    id: String(mockReceipts.length + 1),
    reference: generateReceiptReference(),
    status: 'draft',
    partner: data.partner || '',
    scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
    sourceDocument: data.sourceDocument,
    lines: data.lines || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockReceipts.push(newReceipt);
  return newReceipt;
};

export const validateReceipt = async (id: string): Promise<Receipt> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to validate receipt');
  
  const receipt = mockReceipts.find(r => r.id === id);
  if (!receipt) throw new Error('Receipt not found');
  
  if (receipt.status === 'draft') {
    receipt.status = 'ready';
  } else if (receipt.status === 'ready') {
    receipt.status = 'done';
  }
  
  receipt.updatedAt = new Date().toISOString();
  return receipt;
};

export const getDeliveries = async (): Promise<Delivery[]> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to fetch deliveries');
  return [...mockDeliveries];
};

export const getDelivery = async (id: string): Promise<Delivery | null> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to fetch delivery');
  return mockDeliveries.find(d => d.id === id) || null;
};

export const createDelivery = async (data: Partial<Delivery>): Promise<Delivery> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to create delivery');
  
  const newDelivery: Delivery = {
    id: String(mockDeliveries.length + 1),
    reference: generateDeliveryReference(),
    status: 'draft',
    partner: data.partner || '',
    scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
    sourceDocument: data.sourceDocument,
    lines: data.lines || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockDeliveries.push(newDelivery);
  return newDelivery;
};

export const validateDelivery = async (id: string): Promise<Delivery> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to validate delivery');
  
  const delivery = mockDeliveries.find(d => d.id === id);
  if (!delivery) throw new Error('Delivery not found');
  
  // Check if any line has insufficient stock
  const hasInsufficientStock = delivery.lines.some(line => line.quantity > line.available);
  
  if (delivery.status === 'draft') {
    delivery.status = hasInsufficientStock ? 'waiting' : 'ready';
  } else if (delivery.status === 'waiting') {
    delivery.status = hasInsufficientStock ? 'waiting' : 'ready';
  } else if (delivery.status === 'ready') {
    delivery.status = 'done';
  }
  
  delivery.updatedAt = new Date().toISOString();
  return delivery;
};

export const getProducts = async (): Promise<Product[]> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to fetch products');
  return [...mockProducts];
};

export const getStockLevels = async (): Promise<Product[]> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to fetch stock levels');
  return [...mockProducts];
};

export const adjustStock = async (productId: string, adjustment: number): Promise<Product> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to adjust stock');
  
  const product = mockProducts.find(p => p.id === productId);
  if (!product) throw new Error('Product not found');
  
  product.onHand += adjustment;
  product.available = product.onHand - product.reserved;
  
  return product;
};

export const getMoveHistory = async (): Promise<MoveHistoryEntry[]> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to fetch move history');
  return [...mockMoveHistory];
};

export const getWarehouses = async (): Promise<Warehouse[]> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to fetch warehouses');
  return [...mockWarehouses];
};

export const getLocations = async (): Promise<Location[]> => {
  await simulateDelay();
  if (simulateError()) throw new Error('Failed to fetch locations');
  return [...mockLocations];
};
