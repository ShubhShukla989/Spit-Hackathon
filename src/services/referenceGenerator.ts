let receiptCounter = 1;
let deliveryCounter = 1;

export const generateReceiptReference = (): string => {
  const ref = `WH/IN/${String(receiptCounter).padStart(4, '0')}`;
  receiptCounter++;
  return ref;
};

export const generateDeliveryReference = (): string => {
  const ref = `WH/OUT/${String(deliveryCounter).padStart(4, '0')}`;
  deliveryCounter++;
  return ref;
};

export const resetCounters = (): void => {
  receiptCounter = 1;
  deliveryCounter = 1;
};
