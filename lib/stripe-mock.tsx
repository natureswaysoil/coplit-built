import React, { useState } from 'react';

export const Elements: React.FC<{ children: React.ReactNode; stripe?: any; options?: any }> = ({ children }) => <>{children}</>;

export const PaymentElement: React.FC<{ options?: any }> = () => <div />;

export const LinkAuthenticationElement: React.FC<{ options?: any; onChange?: (e: any) => void }> = ({ onChange }) => {
  const [email, setEmail] = useState('');
  return (
    <input
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        onChange?.({ value: { email: e.target.value } });
      }}
    />
  );
};

export const useStripe = () => ({
  confirmPayment: async (_opts?: any) => ({
    error: null,
    paymentIntent: { status: 'succeeded', id: 'pi_mock' },
  }),
});

export const useElements = () => ({
  getElement: (_type?: any) => null,
});
