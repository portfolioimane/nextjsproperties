'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSubscription,
  fetchPlans,
  subscribe,
  clearSubscriptionMessages,
} from '@/store/owner/subscriptionSlice';
import type { AppDispatch, RootState } from '@/store';

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

  useEffect(() => {
    dispatch(fetchSubscription());
    dispatch(fetchPlans());

    return () => {
      dispatch(clearSubscriptionMessages());
    };
  }, [dispatch]);

  // Note: now subscribe expects plan_id (number)
  const handleSubscribe = (planId: number) => {
    if (!loading) {
      dispatch(subscribe(planId));
    }
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
            <p className="text-green-600 font-medium mb-4 text-center animate-fadeIn">
              {success}
            </p>
          )}
          {error && (
            <p className="text-red-600 font-medium mb-4 text-center animate-fadeIn">
              {error}
            </p>
          )}
          {plansError && (
            <p className="text-red-600 font-medium mb-4 text-center animate-fadeIn">
              {plansError}
            </p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
  {plans.map((plan) => {
  const isCurrent = data?.plan_id === plan.id;

  return (
    <div
      key={plan.id}
      className={`border rounded-xl p-6 flex flex-col items-center justify-between shadow-sm
        transition-all duration-300
        ${isCurrent ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:shadow-lg'}
      `}
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
        <span className="inline-block w-full text-center bg-green-100 text-green-700 px-4 py-2 rounded font-medium">
          Current Plan
        </span>
      ) : (
        <button
          onClick={() => handleSubscribe(plan.id)}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
        >
          Subscribe
        </button>
      )}
    </div>
  );
})}

          </div>
        </>
      )}
    </section>
  );
};

export default SubscriptionPlans;
