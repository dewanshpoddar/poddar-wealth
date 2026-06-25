'use client';

import { useState, useEffect } from 'react';
import {
  Play,
  ChevronDown,
  ChevronUp,
  Activity,
  FlaskConical,
  TrendingUp,
  PlusCircle
} from 'lucide-react';

interface TestItem {
  id: string;
  name: string;
  variantA: string;
  variantB: string;
  split: string;
  conversionsA: number;
  conversionsB: number;
  impressionsA: number;
  impressionsB: number;
  winner: string;
  status: 'Running' | 'Completed' | 'Draft';
}

const INITIAL_TESTS: TestItem[] = [
  {
    id: 'hero-cta-text',
    name: 'hero-cta-text',
    variantA: 'Get Wealth Health Report',
    variantB: "Check If You're Underinsured",
    split: '50/50',
    conversionsA: 42,
    conversionsB: 58,
    impressionsA: 1200,
    impressionsB: 1210,
    winner: ' - ',
    status: 'Running',
  },
  {
    id: 'landing-bg-image',
    name: 'landing-bg-image',
    variantA: 'Gorakhpur Office Photo',
    variantB: 'Bilingual Shield Graphic',
    split: '50/50',
    conversionsA: 18,
    conversionsB: 35,
    impressionsA: 520,
    impressionsB: 535,
    winner: 'Variant B',
    status: 'Completed',
  }
];

export default function ABTestAdminPage() {
  const [tests, setTests] = useState<TestItem[]>(INITIAL_TESTS);
  const [expandedRow, setExpandedRow] = useState<string | null>('hero-cta-text');
  const [liveEventCount, setLiveEventCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => {
        if (d && d.features) {
          setLiveEventCount(d.features.abTests);
        }
      })
      .catch(() => {});
  }, []);

  // Form states
  const [testName, setTestName] = useState('');
  const [variantADesc, setVariantADesc] = useState('');
  const [variantBDesc, setVariantBDesc] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleCreateTest = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!testName || !variantADesc || !variantBDesc) return;

    const newTest: TestItem = {
      id: testName.toLowerCase().replace(/\s+/g, '-'),
      name: testName,
      variantA: variantADesc,
      variantB: variantBDesc,
      split: '50/50',
      conversionsA: 0,
      conversionsB: 0,
      impressionsA: 0,
      impressionsB: 0,
      winner: ' - ',
      status: 'Running',
    };

    setTests([newTest, ...tests]);
    setExpandedRow(newTest.id);
    setTestName('');
    setVariantADesc('');
    setVariantBDesc('');
  };

  const calcConversionRate = (conversions: number, impressions: number) => {
    if (impressions === 0) return '0.0%';
    return `${((conversions / impressions) * 100).toFixed(2)}%`;
  };

  const calcSignificance = (test: TestItem) => {
    if (test.impressionsA === 0 || test.impressionsB === 0) return 'Insufficient data';
    // Simple mock calculation for layout representation
    const rateA = test.conversionsA / test.impressionsA;
    const rateB = test.conversionsB / test.impressionsB;
    const diff = Math.abs(rateA - rateB);
    if (diff > 0.01) return '98.4% (Highly Significant)';
    if (diff > 0.005) return '88.1% (Moderately Significant)';
    return '12.4% (Not Significant)';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">A/B Testing Experiments</h1>
        <p className="text-gray-500 text-sm">
          Run conversion optimization tests on client portal and landing page routes
        </p>
        {liveEventCount !== null && (
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-amber-600 font-bold text-sm">{liveEventCount}</span> tracked events in lib/data/ab-results.json
          </p>
        )}
      </div>

      {/* Grid: Active Tests Table & Create Test Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Active Tests List */}
        <section className="lg:col-span-8 space-y-4">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Activity size={14} className="text-amber-500" />
            Active Experiments ({tests.length})
          </h2>

          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100/40">
                    <th className="w-8"></th>
                    <th className="px-6 py-4">Test Name</th>
                    <th className="px-6 py-4">Variant A</th>
                    <th className="px-6 py-4">Variant B</th>
                    <th className="px-6 py-4 text-center">Split</th>
                    <th className="px-6 py-4 text-center">Winner</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/40 text-xs font-medium">
                  {tests.map((test) => {
                    const isExpanded = expandedRow === test.id;
                    return (
                      <>
                        {/* Summary Row */}
                        <tr 
                          key={test.id} 
                          onClick={() => toggleExpand(test.id)}
                          className="hover:bg-gray-50 transition-all cursor-pointer"
                        >
                          <td className="pl-4 py-4 text-center text-gray-500">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900 font-mono">{test.name}</td>
                          <td className="px-6 py-4 text-gray-600 max-w-[150px] truncate">{test.variantA}</td>
                          <td className="px-6 py-4 text-gray-600 max-w-[150px] truncate">{test.variantB}</td>
                          <td className="px-6 py-4 text-center font-mono font-bold text-gray-600">{test.split}</td>
                          <td className="px-6 py-4 text-center">
                            {test.winner !== ' - ' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
                                {test.winner}
                              </span>
                            ) : (
                              <span className="text-gray-500 font-bold">{test.winner}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              test.status === 'Running' 
                                ? 'bg-amber-50 border-amber-100 text-amber-700' 
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                              {test.status}
                            </span>
                          </td>
                        </tr>

                        {/* Expandable Details Row */}
                        {isExpanded && (
                          <tr className="bg-gray-100/40 border-b border-gray-200/80">
                            <td colSpan={7} className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Variant Metrics Card */}
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Variant Conversion Breakdown</h4>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white border border-gray-200/60 p-4 rounded-2xl">
                                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Variant A (Control)</p>
                                      <p className="text-sm font-bold text-gray-900 mb-2 truncate" title={test.variantA}>{test.variantA}</p>
                                      <div className="flex justify-between text-xs font-semibold text-gray-500 pt-2 border-t border-gray-200/40">
                                        <span>Conv Rate:</span>
                                        <span className="text-gray-900 font-mono">{calcConversionRate(test.conversionsA, test.impressionsA)}</span>
                                      </div>
                                      <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                                        <span>Conversions / Impr:</span>
                                        <span className="font-mono">{test.conversionsA} / {test.impressionsA}</span>
                                      </div>
                                    </div>

                                    <div className="bg-white border border-gray-200/60 p-4 rounded-2xl relative overflow-hidden">
                                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Variant B (Challenger)</p>
                                      <p className="text-sm font-bold text-gray-900 mb-2 truncate" title={test.variantB}>{test.variantB}</p>
                                      <div className="flex justify-between text-xs font-semibold text-gray-500 pt-2 border-t border-gray-200/40">
                                        <span>Conv Rate:</span>
                                        <span className="text-amber-600 font-mono">{calcConversionRate(test.conversionsB, test.impressionsB)}</span>
                                      </div>
                                      <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                                        <span>Conversions / Impr:</span>
                                        <span className="font-mono">{test.conversionsB} / {test.impressionsB}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Statistical Confidence Card */}
                                <div className="bg-white/60 border border-gray-200/60 rounded-2xl p-5 flex flex-col justify-between">
                                  <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                      <TrendingUp size={12} className="text-amber-500" />
                                      Statistical Significance Analysis
                                    </h4>
                                    <p className="text-gray-600 text-xs leading-relaxed font-medium">
                                      This test runs on a standard 50/50 traffic split logic using Vercel Middleware path overrides. Gaps are audited daily.
                                    </p>
                                  </div>

                                  <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
                                    <div>
                                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Significance</p>
                                      <p className="text-sm font-bold text-gray-900 font-mono">{calcSignificance(test)}</p>
                                    </div>
                                    {test.status === 'Running' && (
                                      <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl">
                                        <Play size={10} className="animate-pulse" /> Running Live
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right: Create Experiment Form */}
        <section className="lg:col-span-4 space-y-4">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <FlaskConical size={14} className="text-amber-500" />
            Create Experiment
          </h2>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <form onSubmit={handleCreateTest} className="space-y-4">
              {/* Test Name */}
              <div className="space-y-1.5">
                <label htmlFor="testName" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Test Name / Route Key
                </label>
                <input
                  id="testName"
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. hero-cta-text"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-amber-500 transition-colors outline-none text-xs font-semibold"
                />
              </div>

              {/* Variant A Description */}
              <div className="space-y-1.5">
                <label htmlFor="variantA" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Variant A (Control Description)
                </label>
                <input
                  id="variantA"
                  type="text"
                  required
                  value={variantADesc}
                  onChange={(e) => setVariantADesc(e.target.value)}
                  placeholder="e.g. Get Wealth Health Report"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-amber-500 transition-colors outline-none text-xs font-semibold"
                />
              </div>

              {/* Variant B Description */}
              <div className="space-y-1.5">
                <label htmlFor="variantB" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Variant B (Challenger Description)
                </label>
                <input
                  id="variantB"
                  type="text"
                  required
                  value={variantBDesc}
                  onChange={(e) => setVariantBDesc(e.target.value)}
                  placeholder="e.g. Check If Underinsured"
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-amber-500 transition-colors outline-none text-xs font-semibold"
                />
              </div>

              {/* Traffic Split Display */}
              <div className="flex justify-between items-center bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-3 text-xs font-semibold">
                <span className="text-gray-500 uppercase text-[9px] tracking-wider font-bold">Traffic Split</span>
                <span className="text-gray-700 font-mono">50% A / 50% B</span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10"
              >
                <PlusCircle size={14} />
                Start Test
              </button>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}
