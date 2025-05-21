export interface Item {
  id: string;
  name: string;
  cost: number;
}

export interface OtherCost {
  id: string;
  description: string;
  amount: number;
}

export interface User {
  uid: string;
  email: string | null;
}