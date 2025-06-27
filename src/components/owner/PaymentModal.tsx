'use client';

import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentIntent, verifyPaypalPayment, clearPaymentState } from '@/store/owner/paymentSlice';
import type { AppDispatch, RootState } from '@/store';

interface Plan {
  id: number;
  name: string;
  price: number;
  duration_days: number | null;
  max_properties: number;
}

interface PaymentModalProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planId: number, method: 'stripe' | 'paypal') => void;
  loading: boolean;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Helper: load PayPal SDK once
const loadPaypalSdk = (clientId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).paypal) {
      resolve(); // already loaded
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('PayPal SDK failed to load'));
    document.body.appendChild(script);
  });
};

const StripeForm = ({
  plan,
  onConfirm,
  onClose,
}: {
  plan: Plan;
  onConfirm: (id: number, method: 'stripe' | 'paypal') => void;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch<AppDispatch>();
  const { clientSecret, loading: intentLoading, error } = useSelector((s: RootState) => s.payment);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  useEffect(() => {
    dispatch(createPaymentIntent({ planId: plan.id, amount: plan.price * 100 }));
    return () => {
      dispatch(clearPaymentState());
    };
  }, [dispatch, plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmError('');
    if (!stripe || !elements || !clientSecret) return;

    setConfirmLoading(true);
    const res = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (res.error) {
      setConfirmError(res.error.message || 'Payment failed.');
    } else if (res.paymentIntent?.status === 'succeeded') {
      onConfirm(plan.id, 'stripe');
      onClose();
    }
    setConfirmLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-medium mb-2">Card Information</label>
      <div className="p-2 border rounded mb-4">
        <CardElement />
      </div>
      {(error || confirmError) && <p className="text-red-600 mb-2">{error || confirmError}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 border rounded">
          Cancel
        </button>
        <button
          type="submit"
          disabled={intentLoading || confirmLoading}
          className="flex-1 bg-blue-600 text-white rounded"
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
  plan: Plan;
  onConfirm: (id: number, method: 'stripe' | 'paypal') => void;
  onClose: () => void;
}) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
    loadPaypalSdk(clientId)
      .then(() => setSdkReady(true))
      .catch((err) => {
        console.error(err);
        alert('Failed to load PayPal SDK');
      });
  }, []);

  useEffect(() => {
    if (!sdkReady) return;
    if (!paypalRef.current) return;

    // Clear previous buttons if any (important on re-renders)
    paypalRef.current.innerHTML = '';

    const buttons = (window as any).paypal.Buttons({
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: plan.price.toString() } }],
        });
      },
      onApprove: async (_data: any, actions: any) => {
        const details = await actions.order.capture();
        console.log('PayPal payment approved, details:', details);

        const orderID = details.id;
        const resultAction = await dispatch(verifyPaypalPayment({ orderID }));

        if (verifyPaypalPayment.fulfilled.match(resultAction)) {
          onConfirm(plan.id, 'paypal');
          onClose();
        } else {
          alert('PayPal payment verification failed on server.');
        }
      },
      onError: (err: any) => {
        console.error('PayPal Error:', err);
        alert('PayPal payment failed');
      },
    });

    buttons.render(paypalRef.current);

    return () => {
      if (paypalRef.current) paypalRef.current.innerHTML = '';
      // Do NOT remove the script tag to avoid zoid destroyed errors
    };
  }, [sdkReady, plan, onConfirm, onClose, dispatch]);

  return <div ref={paypalRef} className="mb-4" />;
};

const PaymentModal = ({ plan, isOpen, onClose, onConfirm, loading }: PaymentModalProps) => {
  const [method, setMethod] = useState<'stripe' | 'paypal'>('stripe');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg max-w-md w-full overflow-auto">
        <div className="p-6">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl">Complete Payment</h3>
            <button onClick={onClose} aria-label="Close modal" className="text-2xl font-bold">
              ×
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h4 className="font-medium">{plan.name} Plan</h4>
            <p className="text-2xl text-blue-600">{plan.price} MAD</p>
            <p className="text-sm text-gray-600">
              Duration: {plan.duration_days ?? 'No expiration'} days
            </p>
            <p className="text-sm text-gray-600">Up to {plan.max_properties} properties</p>
          </div>
          <div className="mb-4 flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={method === 'stripe'}
                onChange={() => setMethod('stripe')}
                name="paymentMethod"
              />
              Stripe
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={method === 'paypal'}
                onChange={() => setMethod('paypal')}
                name="paymentMethod"
              />
              PayPal
            </label>
          </div>
          {method === 'stripe' ? (
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
