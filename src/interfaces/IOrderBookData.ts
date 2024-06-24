export type Price = string;
export type Quantity = string;

export type PriceQuantityPair = [Price, Quantity];

export interface IOrderBookData {
  bids?: PriceQuantityPair[];
  asks?: PriceQuantityPair[];
  market_id: string;
  sequence: number;
  timestamp: number;
}
