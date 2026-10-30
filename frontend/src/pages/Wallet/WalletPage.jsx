import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Smartphone, ShieldCheck, Loader2, X, CheckCircle, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { formatINR } from '../../utils/formatCurrency';
import { useAuth } from '../../context/AuthContext';

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Withdrawal Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState(user?.wallet?.payoutDetails?.upiId || 'student@upi');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [balRes, txRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet/transactions')
      ]);

      if (balRes.data.success) {
        setWallet(balRes.data.data);
        if (balRes.data.data.payoutDetails?.upiId) {
          setUpiId(balRes.data.data.payoutDetails.upiId);
        }
      }
      if (txRes.data.success) {
        setTransactions(txRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawError('');
    const amt = parseFloat(withdrawAmount);

    if (!amt || amt <= 0) {
      setWithdrawError('Please enter a valid withdrawal amount');
      return;
    }

    if (amt > (wallet?.balance || 0)) {
      setWithdrawError(`Amount exceeds available balance of ${formatINR(wallet?.balance || 0)}`);
      return;
    }

    setWithdrawing(true);

    try {
      const res = await api.post('/wallet/withdraw', {
        amount: amt,
        upiId
      });

      if (res.data.success) {
        setWithdrawSuccess(true);
        fetchWalletData();
        setTimeout(() => {
          setShowWithdrawModal(false);
          setWithdrawSuccess(false);
          setWithdrawAmount('');
        }, 1800);
      }
    } catch (err) {
      setWithdrawError(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="pb-24 max-w-md mx-auto px-4 pt-3">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>₹ Virtual Wallet</span>
          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
            INR Active
          </span>
        </h1>
        <p className="text-xs text-slate-500">
          Instant payouts for your completed local gigs
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your balance & transactions...</p>
        </div>
      ) : (
        <>
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-slate-900 rounded-3xl p-6 text-white shadow-xl mb-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-emerald-200">
                Available Withdrawable Balance
              </span>
              <span className="inline-flex items-center space-x-1 text-[11px] bg-emerald-900/60 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Verified</span>
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-4xl font-black tracking-tight">
                {formatINR(wallet?.balance || 0)}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-emerald-600/50">
              <div>
                <p className="text-[11px] text-emerald-200">Total Lifetime Earnings</p>
                <p className="font-extrabold text-sm text-white">
                  {formatINR(wallet?.totalEarnings || 0)}
                </p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={(wallet?.balance || 0) <= 0}
                  className="bg-white hover:bg-emerald-50 text-slate-900 text-xs font-extrabold py-2 px-3.5 rounded-xl shadow-sm transition active:scale-95 disabled:opacity-40"
                >
                  Withdraw to UPI
                </button>
              </div>
            </div>
          </div>

          {/* Quick Payout Rails Banner */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Supported Payout Rails</p>
                <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM UPI</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              Zero Fees
            </span>
          </div>

          {/* Transactions Ledger */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-extrabold text-sm text-slate-900">
                Recent Ledger Activity
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {transactions.length} entries
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <p className="text-xs text-slate-500">No transactions recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => {
                  const isCredit = tx.type === 'credit';
                  return (
                    <div
                      key={tx._id}
                      className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownRight className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {tx.description}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`font-black text-xs ${
                            isCredit ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {isCredit ? '+' : '-'} {formatINR(tx.amount)}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Instant UPI Withdrawal
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Amount in ₹ (INR)
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  max={wallet?.balance || 0}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount (e.g. 500)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {/* Quick select chips */}
                <div className="flex gap-1.5 mt-2">
                  {[200, 500, 1000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWithdrawAmount(String(val))}
                      className="text-[11px] font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-slate-700"
                    >
                      ₹{val}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(String(wallet?.balance || 0))}
                    className="text-[11px] font-bold bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg text-emerald-800"
                  >
                    All (Max)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your UPI ID (VPA)
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or username@okaxis"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={withdrawing || withdrawSuccess}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs transition shadow-sm flex items-center justify-center space-x-2 ${
                  withdrawSuccess
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                }`}
              >
                {withdrawing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : withdrawSuccess ? (
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Transferred to {upiId}!</span>
                  </span>
                ) : (
                  <span>Confirm Instant Transfer</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
