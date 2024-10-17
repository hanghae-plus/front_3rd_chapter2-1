export interface SaleEvent {
  probability: number;
  rate: number;
  checkInterval: number;
}

export interface Events {
  flashSale: SaleEvent;
  recommendedSale: SaleEvent;
}
