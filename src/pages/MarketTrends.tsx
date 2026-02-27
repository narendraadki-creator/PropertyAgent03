import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  TrendingUp,
  TrendingDown,
  Newspaper,
  BarChart3,
  Download,
  ExternalLink,
  AlertCircle,
  Target,
  Clock,
  Award,
  Building2,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';
import { seedMarketData } from '../utils/seedMarketData';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface MarketNews {
  id: string;
  title: string;
  source: string;
  source_url: string;
  summary: string;
  area: string;
  trend_score: number;
  investor_signal: 'BUY' | 'HOLD' | 'WATCH';
  tags: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  price_change_percent: number;
  impact_points: string[];
  publish_date: string;
}

interface AreaTrend {
  area_name: string;
  avg_price_sqft: number;
  transaction_volume: number;
  price_change_percent: number;
  sentiment_score: number;
  investor_signal: string;
  date: string;
}

interface ManagerAnalytics {
  top_performing_area: string;
  highest_lead_area: string;
  avg_closing_days: number;
  weekly_growth_percent: number;
  overall_sentiment: string;
  total_transactions: number;
  top_areas: Array<{ area: string; priceChange: number; signal: string }>;
}

const MarketTrends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'news' | 'manager'>('insights');
  const [news, setNews] = useState<MarketNews[]>([]);
  const [trends, setTrends] = useState<AreaTrend[]>([]);
  const [analytics, setAnalytics] = useState<ManagerAnalytics | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [newsOffset, setNewsOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const newsLimit = 20;

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [activeTab, selectedArea]);

  const initializeData = async () => {
    setLoading(true);
    setError(null);

    const { data: existingNews } = await supabase
      .from('market_news')
      .select('id')
      .limit(1);

    if (!existingNews || existingNews.length === 0) {
      const result = await seedMarketData();
      if (!result.success) {
        setError('Failed to initialize market data');
      }
    }

    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      if (activeTab === 'insights' || activeTab === 'news') {
        const { data: newsData, error: newsError } = await supabase
          .from('market_news')
          .select('*')
          .eq('processing_status', 'completed')
          .order('publish_date', { ascending: false })
          .order('trend_score', { ascending: false });

        if (newsError) {
          console.error('Error fetching news:', newsError);
          setError('Failed to fetch market news');
        } else {
          const uniqueNews = Array.from(
            new Map(newsData?.map(item => [item.title + item.publish_date, item]) || []).values()
          );

          const filteredNews = selectedArea === 'all'
            ? uniqueNews
            : uniqueNews.filter(item => item.area === selectedArea);

          setNews(filteredNews.slice(newsOffset, newsOffset + newsLimit));
        }

        const { data: trendsData, error: trendsError } = await supabase
          .from('area_trends')
          .select('*')
          .order('date', { ascending: false })
          .limit(30);

        if (trendsError) {
          console.error('Error fetching trends:', trendsError);
        } else {
          setTrends(trendsData || []);
        }
      }

      if (activeTab === 'manager') {
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('manager_analytics')
          .select('*')
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (analyticsError) {
          console.error('Error fetching analytics:', analyticsError);
        } else {
          setAnalytics(analyticsData);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    }
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/market-trends-ingestion`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'bg-green-100 text-green-700 border-green-200';
      case 'HOLD': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'WATCH': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'text-green-600';
      case 'Negative': return 'text-red-600';
      default: return 'text-neutral-600';
    }
  };

  const areas = ['all', ...new Set(news.map(n => n.area).filter(Boolean))];

  const latestTrend = trends[0];
  const aiSummary = analytics?.overall_sentiment || "Market showing strong momentum with healthy transaction volumes across premium segments.";

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-market-report`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          }
        }
      );
      const data = await response.json();
      if (data.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      <div className="min-h-screen bg-neutral-50 pb-20">
        <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  MARKET TRENDS
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">AI-Powered Market Intelligence</p>
              </div>
              <button
                onClick={handleRefreshData}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-primary-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex border-t border-neutral-100">
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 py-3 text-sm font-medium font-montserrat transition-colors ${
                activeTab === 'insights'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-500'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              Insights
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-3 text-sm font-medium font-montserrat transition-colors ${
                activeTab === 'news'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-500'
              }`}
            >
              <Newspaper className="w-4 h-4 inline mr-1" />
              News
            </button>
            <button
              onClick={() => setActiveTab('manager')}
              className={`flex-1 py-3 text-sm font-medium font-montserrat transition-colors ${
                activeTab === 'manager'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-500'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Analytics
            </button>
          </div>
        </div>

        <div className="px-4 py-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-montserrat">{error}</p>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold font-montserrat mb-1">AI Market Pulse</h2>
                    <p className="text-sm text-primary-100 font-montserrat">Last updated: Today</p>
                  </div>
                  <Sparkles className="w-6 h-6 text-accent-gold" />
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  {aiSummary}
                </p>
                {latestTrend && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold font-montserrat">{latestTrend.transaction_volume}</div>
                      <div className="text-xs text-white/80 font-montserrat">Transactions</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold font-montserrat flex items-center">
                        {latestTrend.price_change_percent > 0 ? '+' : ''}
                        {latestTrend.price_change_percent?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-white/80 font-montserrat">Price Change</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className={`text-xs font-medium px-2 py-1 rounded-full border inline-block ${getSignalColor(latestTrend.investor_signal)}`}>
                        {latestTrend.investor_signal}
                      </div>
                      <div className="text-xs text-white/80 font-montserrat mt-1">Signal</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Area Trends</h3>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="px-3 py-2 border border-neutral-200 rounded-lg text-sm font-montserrat"
                  >
                    {areas.map(area => (
                      <option key={area} value={area}>{area === 'all' ? 'All Areas' : area}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  {trends.slice(0, 5).map((trend, idx) => (
                    <div key={idx} className="p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-neutral-800 font-montserrat">{trend.area_name}</h4>
                        <span className={`flex items-center text-sm font-medium ${trend.price_change_percent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trend.price_change_percent > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          {trend.price_change_percent > 0 ? '+' : ''}{trend.price_change_percent?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-neutral-500 font-montserrat">Avg Price/sqft:</span>
                          <span className="ml-2 font-medium text-neutral-800">AED {trend.avg_price_sqft?.toFixed(0)}</span>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getSignalColor(trend.investor_signal)}`}>
                            {trend.investor_signal}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {news.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                  <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Impact for Investors</h3>
                  <ul className="space-y-2">
                    {news[0].impact_points?.map((point, idx) => (
                      <li key={idx} className="flex items-start text-sm text-neutral-700">
                        <Target className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="font-montserrat">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-500 font-montserrat">No market news available yet</p>
                </div>
              ) : (
                news.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-neutral-800 font-montserrat mb-1">{item.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                          <span className="font-montserrat">{item.source}</span>
                          <span>•</span>
                          <span>{new Date(item.publish_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-bold font-montserrat">
                          {item.trend_score}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-600 font-montserrat mb-3">{item.summary}</p>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSignalColor(item.investor_signal)}`}>
                        {item.investor_signal}
                      </span>
                      <span className={`text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                      {item.area && (
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-montserrat">
                          {item.area}
                        </span>
                      )}
                    </div>

                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700 flex items-center"
                      >
                        Read Original
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'manager' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : analytics ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Award className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-800 font-montserrat mb-1">
                        {analytics.top_performing_area}
                      </div>
                      <div className="text-xs text-neutral-500 font-montserrat">Top Performing Area</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Building2 className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-800 font-montserrat mb-1">
                        {analytics.highest_lead_area}
                      </div>
                      <div className="text-xs text-neutral-500 font-montserrat">Highest Lead Area</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Clock className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-800 font-montserrat mb-1">
                        {analytics.avg_closing_days?.toFixed(0)} days
                      </div>
                      <div className="text-xs text-neutral-500 font-montserrat">Avg Closing Time</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600 font-montserrat mb-1">
                        +{analytics.weekly_growth_percent?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-neutral-500 font-montserrat">Weekly Growth</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                    <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Overall Sentiment</h3>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-medium font-montserrat">{analytics.overall_sentiment}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                    <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Top 5 Areas</h3>
                    <div className="space-y-3">
                      {analytics.top_areas?.map((area, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <span className="font-medium text-neutral-800 font-montserrat">{area.area}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${area.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {area.priceChange > 0 ? '+' : ''}{area.priceChange?.toFixed(1)}%
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getSignalColor(area.signal)}`}>
                              {area.signal}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadReport}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Weekly Report
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-500 font-montserrat">No analytics data available yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default MarketTrends;
