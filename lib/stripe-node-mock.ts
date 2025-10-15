export default class Stripe {
  constructor(_key: string, _opts?: any) {}
  paymentIntents = {
    create: async (_opts: any) => ({ client_secret: 'pi_mock_secret' }),
  };
}
