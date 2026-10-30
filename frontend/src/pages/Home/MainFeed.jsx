import React, { useState, useEffect } from 'react';
import { Search, Zap, SlidersHorizontal, MapPin, Sparkles, X, CheckCircle, Loader2 } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import JobCard from '../../components/cards/JobCard';
import { formatINR } from '../../utils/formatCurrency';

const CATEGORIES = [
  'All',
  'Cafe & Restaurant',
  'Retail & Store',
  'Event Management',
  'Tutoring & Education',
  'Warehouse & Moving'
];

const RADIUS_OPTIONS = [
  { label: '< 2 km', value: 2 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '20 km', value: 20 }
];

export default function MainFeed({ onOpenChat }) {
  const { coords, cityName, distanceRadius, setDistanceRadius } = useLocation();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [urgentJobs, setUrgentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  // Fetch student's current applications to mark "Applied"
  useEffect(() => {
    const fetchMyApplications = async () => {
      if (user?.role === 'STUDENT') {
        try {
          const res = await api.get('/applications/my');
          if (res.data.success) {
            const ids = new Set(res.data.data.map((app) => app.job?._id));
            setAppliedJobIds(ids);
          }
        } catch (err) {
          console.error('Error fetching applications:', err);
        }
      }
    };

    fetchMyApplications();
  }, [user]);

  // Fetch nearby jobs from MongoDB $nearSphere
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const [lng, lat] = coords;
        const res = await api.get('/jobs/nearby', {
          params: {
            lng,
            lat,
            distance: distanceRadius,
            category: selectedCategory,
            search
          }
        });

        if (res.data.success) {
          setJobs(res.data.data);
        }

        // Fetch urgent jobs
        const urgentRes = await api.get('/jobs/urgent');
        if (urgentRes.data.success) {
          setUrgentJobs(urgentRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [coords, distanceRadius, selectedCategory, search]);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setCoverNote(`Hi! I am a student living near ${cityName} and available for this shift.`);
    setApplySuccess(false);
    setApplyError('');
  };

  const submitApplication = async () => {
    if (!selectedJob) return;
    setApplying(true);
    setApplyError('');

    try {
      const res = await api.post(`/applications/${selectedJob._id}/apply`, {
        coverNote
      });

      if (res.data.success) {
        setApplySuccess(true);
        setAppliedJobIds((prev) => new Set([...prev, selectedJob._id]));
        setTimeout(() => {
          setSelectedJob(null);
          setApplySuccess(false);
        }, 1800);
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="pb-24 max-w-md mx-auto px-4 pt-3">
      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gigs by role, store or street..."
          className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
      </div>

      {/* Radius Distance Filter Pills */}
      <div className="flex items-center space-x-1.5 mb-3 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          Radius:
        </span>
        {RADIUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDistanceRadius(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              distanceRadius === opt.value
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Urgent Postings Carousel */}
      {urgentJobs.length > 0 && selectedCategory === 'All' && !search && (
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                <Zap className="w-4 h-4 text-rose-500 fill-rose-500" />
                Urgent Shifts (Immediate Need)
              </h2>
            </div>
            <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
              {urgentJobs.length} active
            </span>
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
            {urgentJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => setSelectedJob(job)}
                className="min-w-[260px] max-w-[260px] bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-white border border-rose-200/80 rounded-2xl p-3.5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between shrink-0"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full">
                      URGENT HIRING
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatINR(job.wage.amount)}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">
                    {job.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {job.business?.companyName} • {job.location?.city}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-rose-100/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate">{job.shiftTime}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyClick(job);
                    }}
                    disabled={appliedJobIds.has(job._id)}
                    className={`px-2.5 py-1 rounded-xl font-bold text-[11px] shadow-sm transition ${
                      appliedJobIds.has(job._id)
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-rose-600 hover:bg-rose-700 text-white active:scale-95'
                    }`}
                  >
                    {appliedJobIds.has(job._id) ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter Chips */}
      <div className="flex space-x-1.5 overflow-x-auto no-scrollbar mb-4 py-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Job Feed List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Available openings ({jobs.length})</span>
          <span>Near {cityName}</span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Scanning nearby gigs with MongoDB $nearSphere...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">No openings found nearby</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
              Try increasing your search radius to 10 km or 20 km, or select another location.
            </p>
            <button
              onClick={() => setDistanceRadius(20)}
              className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-700 transition"
            >
              Expand Radius to 20 km
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onSelect={() => setSelectedJob(job)}
              onApply={handleApplyClick}
              hasApplied={appliedJobIds.has(job._id)}
              isOwner={user?.role === 'BUSINESS' && job.employer?._id === user?.id}
            />
          ))
        )}
      </div>

      {/* Job Detail & Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl p-5 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {selectedJob.category}
                </span>
                {selectedJob.isUrgent && (
                  <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                    ⚡ Urgent
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Wage */}
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">
              {selectedJob.title}
            </h2>
            <div className="flex items-baseline space-x-1 mb-4">
              <span className="text-2xl font-black text-emerald-700">
                {formatINR(selectedJob.wage.amount)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {selectedJob.wage.rateType === 'per_hour' ? '/ hour' : selectedJob.wage.rateType === 'per_day' ? '/ day shift' : ' fixed total'}
              </span>
            </div>

            {/* Business Info */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 mb-4 space-y-2">
              <div className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                <span>{selectedJob.business?.companyName}</span>
                {selectedJob.business?.isVerified && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
              <p className="text-xs text-slate-600 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{selectedJob.location?.address}, {selectedJob.location?.city}</span>
              </p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Gig Description
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* Requirements */}
            {selectedJob.requirements?.length > 0 && (
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Key Requirements
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-xl font-medium"
                    >
                      • {req}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application Submission Form */}
            {user?.role === 'STUDENT' && !appliedJobIds.has(selectedJob._id) && (
              <div className="pt-3 border-t border-slate-100">
                {applyError && (
                  <div className="mb-3 text-xs bg-rose-50 text-rose-700 p-2 rounded-xl border border-rose-200">
                    {applyError}
                  </div>
                )}
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quick Note to Hiring Manager
                </label>
                <textarea
                  rows={2}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself or mention your availability..."
                  className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3"
                />

                <button
                  onClick={submitApplication}
                  disabled={applying || applySuccess}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition shadow-sm flex items-center justify-center space-x-2 ${
                    applySuccess
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  }`}
                >
                  {applying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : applySuccess ? (
                    <span className="flex items-center space-x-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Application Sent!</span>
                    </span>
                  ) : (
                    <span>Submit Application for {formatINR(selectedJob.wage.amount)}</span>
                  )}
                </button>
              </div>
            )}

            {appliedJobIds.has(selectedJob._id) && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl text-center text-xs font-bold flex items-center justify-center space-x-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>You have already applied for this opening</span>
              </div>
            )}

            {user?.role === 'BUSINESS' && (
              <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl text-center text-xs font-medium">
                You are logged in as a Business Owner. Switch to Student role to apply.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
