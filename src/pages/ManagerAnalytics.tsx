import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import ManagerBottomNavigation from '../components/ManagerBottomNavigation';

const ManagerAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('This Month');

  const pipelineStages = [
    {
      stage: 'New Lead',
      count: 45,
      percentage: 100,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50'
    },
    {
      stage: 'Contacted',
      count: 38,
      percentage: 84.4,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgLight: 'bg-yellow-50',
      dropoff: 7
    },
    {
      stage: 'Site Visit',
      count: 32,
      percentage: 71.1,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgLight: 'bg-purple-50',
      dropoff: 6
    },
    {
      stage: 'Visit Complete',
      count: 28,
      percentage: 62.2,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      bgLight: 'bg-indigo-50',
      dropoff: 4
    },
    {
      stage: 'Negotiation',
      count: 22,
      percentage: 48.9,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgLight: 'bg-orange-50',
      dropoff: 6
    },
    {
      stage: 'Booking',
      count: 18,
      percentage: 40.0,
      color: 'bg-teal-500',
      textColor: 'text-teal-700',
      bgLight: 'bg-teal-50',
      dropoff: 4
    },
    {
      stage: 'Closed',
      count: 12,
      percentage: 26.7,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgLight: 'bg-green-50',
      dropoff: 6
    }
  ];

  const conversionMetrics = [
    {
      label: 'Lead to Contacted',
      value: '84.4%',
      trend: 'up',
      change: '+2.3%'
    },
    {
      label: 'Contacted to Visit',
      value: '71.1%',
      trend: 'up',
      change: '+5.1%'
    },
    {
      label: 'Visit to Negotiation',
      value: '68.8%',
      trend: 'down',
      change: '-1.2%'
    },
    {
      label: 'Negotiation to Booking',
      value: '81.8%',
      trend: 'up',
      change: '+3.4%'
    },
    {
      label: 'Booking to Closed',
      value: '66.7%',
      trend: 'up',
      change: '+1.8%'
    },
    {
      label: 'Overall Conversion',
      value: '26.7%',
      trend: 'up',
      change: '+4.2%'
    }
  ];

  const teamMetrics = [
    {
      label: 'Avg Lead Response Time',
      value: '3.2 hrs',
      target: '< 4 hrs',
      status: 'good',
      trend: 'down',
      change: '-0.5h'
    },
    {
      label: 'Avg Visit Conversion',
      value: '68.8%',
      target: '> 65%',
      status: 'good',
      trend: 'up',
      change: '+2.1%'
    },
    {
      label: 'Stale Lead Rate',
      value: '12.3%',
      target: '< 15%',
      status: 'good',
      trend: 'down',
      change: '-1.5%'
    },
    {
      label: 'Follow-up Completion',
      value: '87.5%',
      target: '> 85%',
      status: 'good',
      trend: 'up',
      change: '+3.2%'
    }
  ];

  const timeframes = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/manager/dashboard')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>

            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                ANALYTICS
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Pipeline & Performance Metrics</p>
            </div>
          </div>

          {/* Timeframe Filter */}
          <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium font-montserrat transition-all duration-200 ${
                  timeframe === tf
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Pipeline Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
            Conversion Funnel
          </h2>

          <div className="space-y-4">
            {pipelineStages.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-neutral-800 font-montserrat">
                      {stage.stage}
                    </span>
                    {stage.dropoff && (
                      <span className="text-xs text-red-600 font-montserrat">
                        (-{stage.dropoff})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-neutral-800 font-montserrat">
                      {stage.count}
                    </span>
                    <span className={`text-xs font-medium font-montserrat ${stage.textColor}`}>
                      {stage.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="relative h-12 bg-neutral-100 rounded-lg overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 ${stage.color} flex items-center justify-center text-white font-bold font-montserrat transition-all duration-500`}
                    style={{ width: `${stage.percentage}%` }}
                  >
                    {stage.percentage > 30 && stage.count}
                  </div>
                </div>

                {index < pipelineStages.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="w-4 h-4 text-neutral-400 rotate-90" strokeWidth={2} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
            Stage Conversion Rates
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {conversionMetrics.map((metric, index) => (
              <div key={index} className="p-3 bg-neutral-50 rounded-lg">
                <div className="text-xs text-neutral-600 font-montserrat mb-1">
                  {metric.label}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-neutral-800 font-montserrat">
                    {metric.value}
                  </span>
                  <div className={`flex items-center text-xs font-medium font-montserrat ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1" strokeWidth={2} />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" strokeWidth={2} />
                    )}
                    {metric.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
            Team Performance
          </h2>

          <div className="space-y-4">
            {teamMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-800 font-montserrat">
                    {metric.label}
                  </span>
                  <div className={`flex items-center text-xs font-medium font-montserrat ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1" strokeWidth={2} />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" strokeWidth={2} />
                    )}
                    {metric.change}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-neutral-800 font-montserrat">
                      {metric.value}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-500 font-montserrat mb-1">Target</div>
                    <div className="text-sm font-medium text-neutral-700 font-montserrat">
                      {metric.target}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className={`h-full ${
                      metric.status === 'good' ? 'bg-green-500' :
                      metric.status === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                    } transition-all duration-500`}
                    style={{
                      width: metric.status === 'good' ? '85%' :
                             metric.status === 'average' ? '60%' : '40%'
                    }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div className="text-sm font-medium font-montserrat mb-2 opacity-90">
              Total Leads
            </div>
            <div className="text-3xl font-bold font-montserrat mb-1">342</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" strokeWidth={2} />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <div className="text-sm font-medium font-montserrat mb-2 opacity-90">
              Closed Deals
            </div>
            <div className="text-3xl font-bold font-montserrat mb-1">28</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" strokeWidth={2} />
              <span>+5% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="text-sm font-medium font-montserrat mb-2 opacity-90">
              Site Visits
            </div>
            <div className="text-3xl font-bold font-montserrat mb-1">156</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" strokeWidth={2} />
              <span>+8% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
            <div className="text-sm font-medium font-montserrat mb-2 opacity-90">
              Avg Deal Value
            </div>
            <div className="text-3xl font-bold font-montserrat mb-1">₹1.4Cr</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" strokeWidth={2} />
              <span>+3% from last month</span>
            </div>
          </div>
        </div>
      </div>

      <ManagerBottomNavigation />
    </div>
  );
};

export default ManagerAnalytics;
