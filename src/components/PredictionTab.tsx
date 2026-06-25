/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Analytics } from '../types';
import { Brain, Info, RefreshCw } from 'lucide-react';

interface PredictionTabProps {
  analytics: Analytics | null;
  arParams: any;
  setArParams: any;
  mlpParams: any;
  setMlpParams: any;
  isCalculating?: boolean;
  isGeminiLoading?: boolean;
}

// Custom radial gauge for displaying metrics
const CircularProgress: React.FC<{
  percentage: number;
  type: 'TAI' | 'XIU' | 'HOA';
  size?: number;
  strokeWidth?: number;
}> = ({ percentage, type, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const numPercentage = Number(percentage) || 0;
  const strokeDashoffset = circumference - (numPercentage / 100) * circumference;

  let colorClass = 'text-indigo-500';
  if (type === 'TAI') colorClass = 'text-rose-500';
  if (type === 'XIU') colorClass = 'text-sky-500';
  if (type === 'HOA') colorClass = 'text-amber-500';

  return (
    <div className="relative inline-flex items-center justify-center animate-fadeIn" id={`circular-progress-${type}`}>
      <svg className="transform -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-800/80" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-out ${colorClass}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-black tracking-tighter text-slate-100 font-mono">
          {numPercentage.toFixed(1)}<span className="text-xs">%</span>
        </span>
      </div>
    </div>
  );
};

export const PredictionTab: React.FC<PredictionTabProps> = ({ 
  analytics,
  isGeminiLoading
}) => {
  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 rounded-2xl border border-slate-800" id="prediction-no-data">
        <Brain className="w-12 h-12 text-slate-600 animate-pulse mb-3" />
        <p className="text-slate-400 font-medium">Chưa đủ dữ liệu để kích hoạt mô hình Siêu AI.</p>
        <p className="text-slate-500 text-sm mt-1">Vui lòng nạp hoặc tự nhập kết quả lịch sử để vận hành bộ xử lý trung tâm.</p>
      </div>
    );
  }

  const pred = analytics.prediction;

  return (
    <div className="flex flex-col gap-6" id="prediction-tab-view">
      {/* Core Unified Prediction Card - ONLY Show the AI CEO's Final Decision */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-gradient-to-br from-slate-900/95 via-slate-900/75 to-indigo-950/20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/10 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
        id="central-ai-prediction-card"
      >
        {/* High-tech pulsing auras */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-4.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono">Unified Central Super AI</span>
                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">LIVE CEO CHỐT</span>
                {isGeminiLoading && (
                  <span className="text-[8px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-2 h-2 animate-spin" /> ĐANG PHẢN BIỆN...
                  </span>
                )}
              </div>
              <h2 className="text-slate-100 text-lg font-black uppercase tracking-tight">AI CEO QUYẾT ĐỊNH CUỐI CÙNG</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-950/50 border border-slate-900 rounded-lg px-3 py-1.5 font-semibold font-mono">
            <span>Số chu kỳ tự học: {pred.learningIteration}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6">
          <div className="flex-1 flex flex-col justify-between gap-4 w-full">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Kết quả AI CEO chốt quyết định</span>
              <div className="flex items-center gap-4 mt-2.5">
                <span className={`px-5 py-2.5 rounded-2xl text-5xl font-black tracking-tight shadow-md border ${
                  pred.predictedType === 'TAI' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 
                  pred.predictedType === 'XIU' ? 'text-sky-400 bg-sky-500/10 border-sky-500/20' : 
                  'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {pred.predictedType === 'TAI' ? 'TÀI' : pred.predictedType === 'XIU' ? 'XỈU' : 'HÒA'}
                </span>
                <div>
                  <div className="text-slate-200 text-3xl font-black font-mono">⚡ {pred.predictedSum} Điểm</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                    {pred.predictedSum % 2 === 0 ? 'Tổng Chẵn' : 'Tổng Lẻ'} • Cầu {pred.marketState}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col gap-1 text-[11px] text-slate-400 leading-relaxed font-medium">
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-300 mb-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" /> Trạng thái phân tích mô hình:
              </div>
              Phân tích quyết định tối ưu đã đồng thuận từ 9 tác nhân thích ứng. Toàn bộ các hệ thống tính toán (Markov, AR-EMA, MLP Network, Data Drift PSI) đang tự vận hành ngầm 24/7 để cập nhật quyết định tiếp theo.
            </div>
          </div>

          <div className="w-full md:w-48 shrink-0 bg-slate-950/40 border border-slate-900 p-5 rounded-xl flex flex-col items-center justify-center gap-3 relative">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Độ Tin Cậy AI</span>
            <CircularProgress percentage={pred.confidence} type={pred.predictedType} size={110} strokeWidth={8} />
            <div className="text-center mt-1">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm ${pred.riskColorBg} ${pred.riskColorText} ${pred.riskColorBorder}`}>
                RỦI RO: {pred.riskLevel}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
