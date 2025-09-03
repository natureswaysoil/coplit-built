export type StripeConfig = { apiVersion?: string };

export interface PaymentIntent {
  id: string;
  client_secret?: string | null;
  amount_received?: number;
  metadata?: Record<string, any>;
  last_payment_error?: { message?: string };
  latest_charge?: string | null;
}

export interface Event {
  type: string;
  data: { object: any };
}

export class Stripe {
  constructor(secret: string, config?: StripeConfig) {}

  customers = {
    search: async (_: any) => ({ data: [] as any[] }),
    list: async (_: any) => ({ data: [] as any[] }),
    create: async (_: any) => ({ id: '' }),
    update: async (_id: string, _data: any) => ({})
  };

  promotionCodes = {
    list: async (_: any) => ({ data: [] as any[] })
  };

  tax = {
    calculations: {
      create: async (_: any) => ({
        id: '',
        amount_subtotal: 0,
        tax_amount_exclusive: 0,
        amount_total: 0
      }),
      retrieve: async (id: string) => ({
        id,
        amount_subtotal: 0,
        tax_amount_exclusive: 0,
        amount_total: 0
      })
    }
  };

  paymentIntents = {
    create: async (_: any) => ({ id: '', client_secret: '' }),
    update: async (_id: string, _data: any) => ({ id: '', client_secret: '' })
  };

  webhooks = {
    constructEvent: (_body: any, _sig: string, _secret: string): Event => ({
      type: '',
      data: { object: {} }
    })
  };
}

export namespace Stripe {
  export type LatestApiVersion = string;
  export type Event = import('./stripe-stub').Event;
  export type PaymentIntent = import('./stripe-stub').PaymentIntent;
}

export default Stripe;
