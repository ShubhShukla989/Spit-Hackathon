import { create } from 'zustand';
import type { Receipt, Delivery, Product, MoveHistoryEntry, Warehouse, Location } from '../services/mockApi';

interface DataState {
  receipts: Receipt[];
  deliveries: Delivery[];
  products: Product[];
  moveHistory: MoveHistoryEntry[];
  warehouses: Warehouse[];
  locations: Location[];
  setReceipts: (receipts: Receipt[]) => void;
  setDeliveries: (deliveries: Delivery[]) => void;
  setProducts: (products: Product[]) => void;
  setMoveHistory: (history: MoveHistoryEntry[]) => void;
  setWarehouses: (warehouses: Warehouse[]) => void;
  setLocations: (locations: Location[]) => void;
}

export const useDataStore = create<DataState>((set) => ({
  receipts: [],
  deliveries: [],
  products: [],
  moveHistory: [],
  warehouses: [],
  locations: [],
  
  setReceipts: (receipts) => set({ receipts }),
  setDeliveries: (deliveries) => set({ deliveries }),
  setProducts: (products) => set({ products }),
  setMoveHistory: (history) => set({ moveHistory: history }),
  setWarehouses: (warehouses) => set({ warehouses }),
  setLocations: (locations) => set({ locations }),
}));
