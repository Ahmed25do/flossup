import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Building, Shield, AlertCircle } from 'lucide-react';
import { paymobService, PaymentRequest, calculateCommission, calculateNetAmount } from '../lib/paymob';
import { supabase } from '../lib/supabase';
import { useAuthContext } from './AuthProvider';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
  amount: number;
  currency?: string;
  orderId?: string;
  sellerId?: string;
  commissionRate?: number;
  title: string;
  description: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency = 'EGP',
  orderId,
  sellerId,
  commissionRate = 5,
  title,
  description,
}) => {
  const { user, profile } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const commission = calculateCommission(amount, commissionRate);
  const netAmount = calculateNetAmount(amount, commissionRate);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  const fetchPaymentMethods = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handlePayment = async () => {
    if (!user || !profile) {
      setError('Please sign in to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create transaction record
      if (supabase) {
        const { data: transaction, error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            seller_id: sellerId,
            order_id: orderId,
            amount: amount,
            currency: currency,
            commission_rate: commissionRate,
            commission_amount: commission,
            net_amount: sellerId ? netAmount : amount,
            payment_method: selectedMethod,
            status: 'pending',
          })
          .select()
          .single();

        if (transactionError) throw transactionError;
        setTransactionId(transaction.id);
      }

      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        amount: amount,
        currency: currency,
        orderId: orderId || `order_${Date.now()}`,
        userId: user.id,
        sellerId: sellerId,
        commissionRate: commissionRate,
        billingData: {
          firstName: profile.full_name?.split(' ')[0] || 'User',
          lastName: profile.full_name?.split(' ').slice(1).join(' ') || 'Name',
          email: profile.email,
          phoneNumber: profile.phone || '01000000000',
          city: profile.location?.split(',')[0] || 'Cairo',
          country: 'EG',
        },
      };

      // Process payment with Paymob
      const paymentResponse = await paymobService.processPayment(paymentRequest);

      if (paymentResponse.success && paymentResponse.iframeUrl) {
        setIframeUrl(paymentResponse.iframeUrl);
        setShowIframe(true);
        
        // Update transaction with Paymob details
        if (supabase && transactionId) {
          await supabase
            .from('transactions')
            .update({
              paymob_transaction_id: paymentResponse.transactionId,
              status: 'processing',
              payment_data: {
                payment_token: paymentResponse.paymentToken,
                iframe_url: paymentResponse.iframeUrl,
              },
            })
            .eq('id', transactionId);
        }
      } else {
        throw new Error(paymentResponse.error || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleIframeMessage = (event: MessageEvent) => {
    // Handle payment completion messages from Paymob iframe
    if (event.origin !== 'https://accept.paymob.com') return;

    try {
      const data = JSON.parse(event.data);
      if (data.type === 'payment_success') {
        handlePaymentSuccess();
      } else if (data.type === 'payment_error') {
        setError('Payment failed. Please try again.');
        setShowIframe(false);
      }
    } catch (error) {
      console.error('Error parsing iframe message:', error);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (supabase && transactionId) {
        // Update transaction status
        await supabase
          .from('transactions')
          .update({ status: 'completed' })
          .eq('id', transactionId);

        // Create commission record if there's a seller
        if (sellerId) {
          await supabase
            .from('commissions')
            .insert({
              transaction_id: transactionId,
              seller_id: sellerId,
              amount: commission,
              rate: commissionRate,
              status: 'collected',
              collected_at: new Date().toISOString(),
            });
        }
      }

      onSuccess(transactionId);
      onClose();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  useEffect(() => {
    if (showIframe) {
      window.addEventListener('message', handleIframeMessage);
      return () => window.removeEventListener('message', handleIframeMessage);
    }
  }, [showIframe, transactionId]);

  if (!isOpen) return null;

  const paymentMethodIcons = {
    card: CreditCard,
    wallet: Smartphone,
    bank_transfer: Building,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {!showIframe ? (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}

              <div>
                <p className="text-gray-600 mb-4">{description}</p>
                
                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">{amount} {currency}</span>
                  </div>
                  {sellerId && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Platform Fee ({commissionRate}%):</span>
                        <span className="text-red-600">-{commission} {currency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Seller Receives:</span>
                        <span className="text-green-600">{netAmount} {currency}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = paymentMethodIcons[method.type as keyof typeof paymentMethodIcons] || CreditCard;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedMethod === method.type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.type}
                          checked={selectedMethod === method.type}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="sr-only"
                        />
                        <Icon className="h-5 w-5 text-gray-600 mr-3" />
                        <span className="font-medium text-gray-900">{method.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Secure Payment</h4>
                  <p className="text-sm text-blue-700">
                    Your payment is processed securely through Paymob. We don't store your payment information.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !selectedMethod}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  `Pay ${amount} ${currency}`
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="h-[600px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
              <button
                onClick={() => {
                  setShowIframe(false);
                  onClose();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <iframe
              src={iframeUrl}
              className="w-full h-full border-0"
              title="Payment"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;