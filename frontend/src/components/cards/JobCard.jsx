import React from 'react';
import { MapPin, Clock, CheckCircle2, Zap } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

export default function JobCard({ job, onSelect, onApply, hasApplied, isOwner }) {
  const rateLabel = job.wage.rateType === 'per_hour' ? '/hr' : job.wage.rateType === 'per_day' ? '/day' : ' fixed';

  return (
    <div
      onClick={() => onSelect(job)}
      className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden group"
    >
      {/* Top Banner: Urgent or Category */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center space-x-1.5 flex-wrap">
          {job.isUrgent && (
            <span className="inline-flex items-center space-x-1 bg-rose-50 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
              <Zap className="w-3 h-3 text-rose-600" />
              <span>URGENT</span>
            </span>
          )}
          <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            {job.category}
          </span>
        </div>

        {/* ₹ Wage Highlight */}
        <div className="text-right">
          <div className="text-emerald-700 font-extrabold text-base tracking-tight">
            {formatINR(job.wage.amount)}
            <span className="text-[11px] font-medium text-slate-500">{rateLabel}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition line-clamp-1 mb-1">
        {job.title}
      </h3>

      {/* Business Name */}
      <div className="flex items-center space-x-1.5 text-xs text-slate-600 mb-2">
        <span className="font-semibold text-slate-700 truncate">
          {job.business?.companyName || 'Verified Store'}
        </span>
        {job.business?.isVerified && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        )}
      </div>

      {/* Location & Shift Details */}
      <div className="space-y-1 text-[11px] text-slate-500 mb-3">
        <div className="flex items-center space-x-1 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{job.location?.address || job.location?.city}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{job.shiftTime || 'Flexible hours'}</span>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          {job.positionsAvailable} {job.positionsAvailable > 1 ? 'openings' : 'opening'}
        </span>

        {isOwner ? (
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            Your Listing
          </span>
        ) : hasApplied ? (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Applied</span>
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition active:scale-95"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}
