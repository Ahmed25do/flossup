import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Download,
  Eye,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from './AuthProvider';

interface SellerBalance {
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
}

interface Transaction {
  id: string;
  amount: number;
  commission_amount: number;
  net_amount: number;
  status: string;
  created_at: string;
  order_id?: string;
  course_id?: string;
  lab_request_id?: string;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  processed_at?: string;
}

const SellerDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [balance, setBalance] = useState<SellerBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer');
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSellerData();
    }
  }, [user]);

  const fetchSellerData = async () => {
    if (!supabase || !user) return;

    try {
      setLoading(true);

      // Fetch seller balance
      const { data: balanceData } = await supabase
        .from('seller_balances')
        .select('*')
        .eq('seller_id', user.id)
        .single();

      setBalance(balanceData);

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(transactionsData || []);

      // Fetch payouts
      const { data: payoutsData } = await supabase
        .from('payouts')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setPayouts(payoutsData || []);
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutRequest = async () => {
    if (!supabase || !user || !payoutAmount) return;

    const amount = parseFloat(payoutAmount);
    if (amount <= 0 || amount > (balance?.available_balance || 0)) {
      alert('Invalid payout amount');
      return;
    }

    try {
      const { error } = await supabase
        .from('payouts')
        .insert({
          seller_id: user.id,
          amount: amount,
          payment_method: payoutMethod,
          status: 'requested',
        });

      if (error) throw error;

      // Update available balance
      await supabase
        .from('seller_balances')
        .update({
          available_balance: (balance?.available_balance || 0) - amount,
        })
        .eq('seller_id', user.id);

      setShowPayoutModal(false);
      setPayoutAmount('');
      fetchSellerData();
    } catch (error) {
      console.error('Error requesting payout:', error);
      alert('Failed to request payout');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your earnings and payouts</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {balance?.available_balance?.toFixed(2) || '0.00'} EGP
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Balance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {balance?.pending_balance?.toFixed(2) || '0.00'} EGP
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-2xl font-semibold text-gray-900">
                {balance?.total_earned?.toFixed(2) || '0.00'} EGP
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Download className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Withdrawn</p>
              <p className="text-2xl font-semibold text-gray-900">
                {balance?.total_withdrawn?.toFixed(2) || '0.00'} EGP
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.amount.toFixed(2)} EGP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      -{transaction.commission_amount.toFixed(2)} EGP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {transaction.net_amount.toFixed(2)} EGP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout Section */}
        <div className="space-y-6">
          {/* Request Payout */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Payout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (Available: {balance?.available_balance?.toFixed(2) || '0.00'} EGP)
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  max={balance?.available_balance || 0}
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_wallet">Mobile Wallet</option>
                </select>
              </div>
              <button
                onClick={handlePayoutRequest}
                disabled={!payoutAmount || parseFloat(payoutAmount) <= 0 || parseFloat(payoutAmount) > (balance?.available_balance || 0)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Payout
              </button>
            </div>
          </div>

          {/* Recent Payouts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Payouts</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{payout.amount.toFixed(2)} EGP</p>
                      <p className="text-sm text-gray-600">
                        {new Date(payout.created_at).toLocaleDateString()} • {payout.payment_method}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </div>
                ))}
                {payouts.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No payouts yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;