'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSubscription,
  fetchPlans,
  subscribe,
  cancelSubscription,
  clearSubscriptionMessages,
} from '@/store/owner/subscriptionSlice';
import type { AppDispatch, RootState } from '@/store';

import PaymentModal from './PaymentModal';

// Plan type
type Plan = {
  id: number;
  name: string;
  price: number;
  duration_days: number | null;
  max_properties: number;
};

// Cancel confirmation modal
const CancelSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cancel Subscription</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Are you sure you want to cancel your subscription? <br />
          <strong>This action is irreversible and will not be refunded.</strong>
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            No, Keep It
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPlans = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data,
    loading,
    success,
    error,
    plans,
    plansLoading,
    plansError,
  } = useSelector((state: RootState) => state.subscription);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSubscription());
    dispatch(fetchPlans());
    return () => {
      dispatch(clearSubscriptionMessages());
    };
  }, [dispatch]);

  const handleSubscribe = (planId: number, method: 'stripe' | 'paypal') => {
    if (!loading) {
      dispatch(subscribe({ planId, paymentMethod: method }));
      setSelectedPlan(null);
    }
  };

  const handleSubscribeClick = (plan: Plan) => {
    if (plan.price > 0) {
      setSelectedPlan(plan);
    } else {
      handleSubscribe(plan.id, 'stripe');
    }
  };

  const handleCancelSubscription = () => {
    dispatch(cancelSubscription());
    setShowCancelModal(false);
  };

  return (
    <section className="my-8 bg-white rounded-lg shadow p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
        Subscription Plans
      </h2>

      {(loading || plansLoading) && (
        <p className="text-gray-600 text-center mb-4">Loading subscription details...</p>
      )}

      {!loading && !plansLoading && (
        <>
          {success && (
            <p className="text-green-600 font-medium mb-4 text-center">{success}</p>
          )}
          {error && (
            <p className="text-red-600 font-medium mb-4 text-center">{error}</p>
          )}
          {plansError && (
            <p className="text-red-600 font-medium mb-4 text-center">{plansError}</p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = data?.plan_id === plan.id;
              const disabled = loading || (data?.plan_id && !isCurrent);

              return (
                <div
                  key={plan.id}
                  className={`border rounded-xl p-6 flex flex-col items-center justify-between shadow-sm transition duration-300 ${
                    isCurrent
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:shadow-lg'
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2 capitalize">{plan.name} Plan</h3>
                  <p className="text-gray-600 mb-4">
                    {plan.price === 0 ? 'Free' : `${plan.price} MAD`}
                  </p>
                  <p className="text-gray-500 mb-4 text-center">
                    Duration: {plan.duration_days !== null ? `${plan.duration_days} days` : 'No expiration'}
                  </p>
                  <p className="text-gray-700 mb-6 text-center">
                    Add up to <strong>{plan.max_properties}</strong>{' '}
                    {plan.max_properties === 1 ? 'property' : 'properties'}
                  </p>

                  {isCurrent ? (
                    <>
                      <span className="inline-block w-full text-center bg-green-100 text-green-700 px-4 py-2 rounded font-medium mb-2">
                        Current Plan
                      </span>
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="text-sm text-red-600 underline hover:text-red-800"
                      >
                        Cancel Subscription
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleSubscribeClick(plan)}
                      disabled={!!disabled}
                      className={`w-full ${
                        disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      } text-white px-4 py-2 rounded transition`}
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {data?.plan_id && (
            <p className="text-yellow-600 mt-6 text-center text-sm">
              You already have an active subscription. To change your plan, please cancel your current subscription first.
            </p>
          )}
        </>
      )}

      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          onConfirm={handleSubscribe}
          loading={loading}
        />
      )}

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
      />
    </section>
  );
};

export default SubscriptionPlans;
