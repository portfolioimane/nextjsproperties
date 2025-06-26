'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentIntent, clearPaymentState } from '@/store/owner/paymentSlice';
import type { AppDispatch, RootState } from '@/store';

interface PaymentModalProps {
  plan: {
    id: number;
    name: string;
    price: number;
    duration_days: number | null;
    max_properties: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planId: number, paymentMethod: 'stripe' | 'paypal') => void;
  loading: boolean;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const StripeForm = ({
  plan,
  onConfirm,
  onClose,
}: {
  plan: PaymentModalProps['plan'];
  onConfirm: (planId: number, paymentMethod: 'stripe' | 'paypal') => void;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch<AppDispatch>();

  const { clientSecret, loading: intentLoading, error } = useSelector(
    (state: RootState) => state.payment
  );

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  useEffect(() => {
    if (plan.price > 0) {
      dispatch(createPaymentIntent({ planId: plan.id, amount: plan.price * 100 }));
    }
    return () => {
      dispatch(clearPaymentState());
    };
  }, [dispatch, plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmError('');
    if (!stripe || !elements || !clientSecret) return;

    setConfirmLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      setConfirmError(result.error.message || 'Payment failed.');
    } else if (result.paymentIntent?.status === 'succeeded') {
      onConfirm(plan.id, 'stripe');  // Pass payment method here
      onClose();
    }

    setConfirmLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
        <div className="p-2 border border-gray-300 rounded">
          <CardElement />
        </div>
      </div>

      {(error || confirmError) && (
        <p className="text-red-600 text-sm mb-2">{error || confirmError}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={intentLoading || confirmLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {intentLoading || confirmLoading ? 'Processing...' : `Pay ${plan.price} MAD`}
        </button>
      </div>
    </form>
  );
};

const PaypalForm = ({
  plan,
  onConfirm,
  onClose,
}: {
  plan: PaymentModalProps['plan'];
  onConfirm: (planId: number, paymentMethod: 'stripe' | 'paypal') => void;
  onClose: () => void;
}) => {
  // For now this is just a placeholder, you can implement actual PayPal flow later
  const handlePaypalClick = () => {
    // Simulate PayPal success (replace with real flow later)
    onConfirm(plan.id, 'paypal');
    onClose();
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg text-center text-sm text-gray-700 mb-4">
      <p>You'll be redirected to PayPal to complete your payment.</p>
      <p className="mt-2 text-blue-600 italic">(*Integration coming soon*)</p>
      <button
        onClick={handlePaypalClick}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Simulate PayPal Payment
      </button>
    </div>
  );
};

const PaymentModal = ({
  plan,
  isOpen,
  onClose,
  onConfirm,
  loading,
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Complete Payment</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close payment modal"
            >
              ×
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">{plan.name} Plan</h4>
            <p className="text-2xl font-bold text-blue-600 mb-1">{plan.price} MAD</p>
            <p className="text-sm text-gray-600">
              Duration: {plan.duration_days !== null ? `${plan.duration_days} days` : 'No expiration'}
            </p>
            <p className="text-sm text-gray-600">
              Up to {plan.max_properties} {plan.max_properties === 1 ? 'property' : 'properties'}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="mr-2"
                />
                Credit/Debit Card
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="mr-2"
                />
                PayPal
              </label>
            </div>
          </div>

          {paymentMethod === 'stripe' ? (
            <Elements stripe={stripePromise}>
              <StripeForm plan={plan} onConfirm={onConfirm} onClose={onClose} />
            </Elements>
          ) : (
            <PaypalForm plan={plan} onConfirm={onConfirm} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
