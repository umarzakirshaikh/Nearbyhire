import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, Briefcase, CheckCircle, XCircle, Star, MessageSquare, Loader2, Zap } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatCurrency';

export default function BusinessDashboard({ onOpenChat }) {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('candidates'); // candidates | post | listings

  // Data states
  const [applicants, setApplicants] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review & Complete Modal
  const [completingApp, setCompletingApp] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState('Punctual, professional, and completed the shift perfectly!');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // New Job Post Form State
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    category: 'Cafe & Restaurant',
    wageAmount: '',
    wageRateType: 'per_day',
    isUrgent: true,
    shiftTime: 'Evening Shift (5 hrs)',
    durationHours: 5,
    address: user?.businessProfile?.address || 'Market Area',
    city: user?.businessProfile?.city || 'Mumbai',
    requirements: 'Customer friendly, punctual, basic English',
    positionsAvailable: 1
  });
  const [posting, setPosting] = useState(false);
  const [postMessage, setPostMessage] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'BUSINESS') {
        const [appRes, jobRes] = await Promise.all([
          api.get('/applications/business/all'),
          api.get('/jobs/my/listings')
        ]);
        if (appRes.data.success) setApplicants(appRes.data.data);
        if (jobRes.data.success) setMyJobs(jobRes.data.data);
      } else {
        // If student, load student's submitted applications
        const myAppRes = await api.get('/applications/my');
        if (myAppRes.data.success) setApplicants(myAppRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load business data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.patch(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleCompleteGig = async () => {
    if (!completingApp) return;
    setReviewSubmitting(true);

    try {
      const res = await api.post(`/applications/${completingApp._id}/complete-and-review`, {
        rating,
        reviewFeedback
      });

      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((app) =>
            app._id === completingApp._id
              ? { ...app, status: 'completed', rating, reviewFeedback, isPaid: true }
              : app
          )
        );
        setCompletingApp(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete gig');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostMessage('');

    try {
      const res = await api.post('/jobs', {
        ...newJob,
        requirements: newJob.requirements.split(',').map((r) => r.trim()).filter(Boolean)
      });

      if (res.data.success) {
        setPostMessage('🎉 Gig published successfully!');
        setNewJob({
          title: '',
          description: '',
          category: 'Cafe & Restaurant',
          wageAmount: '',
          wageRateType: 'per_day',
          isUrgent: false,
          shiftTime: 'Flexible',
          durationHours: 4,
          address: user?.businessProfile?.address || '',
          city: user?.businessProfile?.city || 'Mumbai',
          requirements: '',
          positionsAvailable: 1
        });
        fetchDashboardData();
        setTimeout(() => {
          setActiveSubTab('listings');
          setPostMessage('');
        }, 1200);
      }
    } catch (err) {
      setPostMessage(err.response?.data?.message || 'Failed to publish gig');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to remove this gig posting?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setMyJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  return (
    <div className="pb-24 max-w-md mx-auto px-4 pt-3">
      {/* Header Info */}
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {user?.role === 'BUSINESS' ? 'Employer Hub' : 'My Applied Gigs'}
        </h1>
        <p className="text-xs text-slate-500">
          {user?.role === 'BUSINESS'
            ? `${user?.businessProfile?.companyName || 'Store Manager'} • Manage shifts & talent`
            : 'Track status of your applications and chat with employers'}
        </p>
      </div>

      {/* Sub Tabs for Business */}
      {user?.role === 'BUSINESS' && (
        <div className="bg-slate-200/80 p-1 rounded-2xl flex mb-4">
          <button
            onClick={() => setActiveSubTab('candidates')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 ${
              activeSubTab === 'candidates' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Applicants ({applicants.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('post')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 ${
              activeSubTab === 'post' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post a Gig</span>
          </button>
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 ${
              activeSubTab === 'listings' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>My Posts ({myJobs.length})</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading data...</p>
        </div>
      ) : user?.role === 'BUSINESS' && activeSubTab === 'post' ? (
        /* Post a Gig Form */
        <form onSubmit={handleCreateJob} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3.5">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Publish Hyperlocal Employment Opening
          </h3>

          {postMessage && (
            <div className={`p-3 rounded-2xl text-xs font-bold ${
              postMessage.includes('🎉') ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}>
              {postMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Title
            </label>
            <input
              type="text"
              required
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              placeholder="e.g. Evening Counter Staff / Cashier"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newJob.category}
                onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Cafe & Restaurant">Cafe & Restaurant</option>
                <option value="Retail & Store">Retail & Store</option>
                <option value="Event Management">Event Management</option>
                <option value="Delivery & Logistics">Delivery & Logistics</option>
                <option value="Tutoring & Education">Tutoring & Education</option>
                <option value="Warehouse & Moving">Warehouse & Moving</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Urgency Flag
              </label>
              <button
                type="button"
                onClick={() => setNewJob({ ...newJob, isUrgent: !newJob.isUrgent })}
                className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                  newJob.isUrgent
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{newJob.isUrgent ? 'Urgent Need' : 'Normal'}</span>
              </button>
            </div>
          </div>

          {/* Wage in INR */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Wage in ₹ (INR)
              </label>
              <input
                type="number"
                required
                min={100}
                value={newJob.wageAmount}
                onChange={(e) => setNewJob({ ...newJob, wageAmount: e.target.value })}
                placeholder="e.g. 700"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Payment Type
              </label>
              <select
                value={newJob.wageRateType}
                onChange={(e) => setNewJob({ ...newJob, wageRateType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="per_day">per day shift</option>
                <option value="per_hour">per hour</option>
                <option value="fixed">fixed total</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Shift Timing / Hours
            </label>
            <input
              type="text"
              value={newJob.shiftTime}
              onChange={(e) => setNewJob({ ...newJob, shiftTime: e.target.value })}
              placeholder="e.g. 4:00 PM – 9:00 PM (5 hrs)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              required
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              placeholder="Describe tasks and responsibilities..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Requirements (comma separated)
            </label>
            <input
              type="text"
              value={newJob.requirements}
              onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
              placeholder="e.g. Punctual, basic computer knowledge"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={posting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition shadow-sm text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Publish Gig Now</span>}
          </button>
        </form>
      ) : user?.role === 'BUSINESS' && activeSubTab === 'listings' ? (
        /* My Job Listings */
        <div className="space-y-3">
          {myJobs.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-10">No active postings yet.</p>
          ) : (
            myJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {job.category}
                    </span>
                    {job.isUrgent && (
                      <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                  <p className="text-xs font-extrabold text-emerald-700 mt-0.5">
                    {formatINR(job.wage.amount)} / {job.wage.rateType.replace('per_', '')}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Candidate / Applications List */
        <div className="space-y-3">
          {applicants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                {user?.role === 'BUSINESS'
                  ? 'No students have applied yet. Post an urgent gig to attract applicants!'
                  : 'You have not applied for any gigs yet.'}
              </p>
            </div>
          ) : (
            applicants.map((app) => {
              const isBiz = user?.role === 'BUSINESS';
              const counterpart = isBiz ? app.student : app.employer;

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3"
                >
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-slate-900">
                          {counterpart?.name || 'Applicant'}
                        </h4>
                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            app.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Applied for: <span className="font-semibold text-slate-700">{app.job?.title}</span>
                      </p>
                    </div>

                    {/* Reliability & Rating Score (For Student Candidate) */}
                    {isBiz && counterpart?.reliabilityScore && (
                      <div className="text-right">
                        <div className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-2 py-0.5 rounded-lg border border-emerald-200">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{counterpart.rating || 5.0}</span>
                        </div>
                        <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                          {counterpart.reliabilityScore}% Reliable
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cover Note */}
                  {app.coverNote && (
                    <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 italic">
                      "{app.coverNote}"
                    </div>
                  )}

                  {/* Skills / College tags */}
                  {isBiz && counterpart?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {counterpart.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onOpenChat(app)}
                      className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center space-x-1.5 py-1 px-2.5 rounded-xl hover:bg-slate-50 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chat Live</span>
                    </button>

                    {isBiz && app.status === 'applied' && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleStatusChange(app._id, 'rejected')}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, 'accepted')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-sm transition"
                        >
                          Accept Candidate
                        </button>
                      </div>
                    )}

                    {isBiz && app.status === 'accepted' && (
                      <button
                        onClick={() => setCompletingApp(app)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-sm transition flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Complete & Pay ₹</span>
                      </button>
                    )}

                    {app.status === 'completed' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Paid {formatINR(app.paidAmount || app.job?.wage?.amount)}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Review & Complete Modal */}
      {completingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-extrabold text-slate-900 text-base">
              Complete Gig & Pay Student
            </h3>
            <p className="text-xs text-slate-500">
              Confirm shift completion for <span className="font-bold text-slate-700">{completingApp.student?.name}</span>.
              This will automatically credit <span className="font-bold text-emerald-700">{formatINR(completingApp.job?.wage?.amount)}</span> to their ₹ INR wallet.
            </p>

            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Rate Student Performance
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition active:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Employer Review Feedback
              </label>
              <textarea
                rows={2}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCompletingApp(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteGig}
                disabled={reviewSubmitting}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1"
              >
                {reviewSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Release ₹ Payment</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
