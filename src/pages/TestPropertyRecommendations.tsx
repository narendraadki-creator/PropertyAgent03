import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Award, TrendingUp, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';
import { seedPropertyRecommendations } from '../utils/seedPropertyRecommendations';
import { supabase } from '../lib/supabase';

export default function TestPropertyRecommendations() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const result = await seedPropertyRecommendations();
      if (result) {
        setProperties(result);
        setSeeded(true);
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error seeding data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('conversion_rate', { ascending: false });

      if (!error && data) {
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Test Property Recommendations</h1>
                <p className="text-sm text-gray-600">Seed test data and verify the recommendation engine</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-2">Property Recommendation Engine Test Suite</h2>
          <p className="text-teal-50 mb-4">
            This tool will populate your properties with realistic performance data to test the recommendation engine.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSeedData}
              disabled={loading}
              className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Seeding Data...
                </>
              ) : seeded ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Data Seeded
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Seed Test Data
                </>
              )}
            </button>
            <button
              onClick={handleViewProperties}
              disabled={loading}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
            >
              View Current Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500 text-white p-3 rounded-full">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">High Conversion</h3>
                <p className="text-sm text-gray-600">15%+ conversion rate</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Properties with proven track records of converting leads into customers. These appear with a green badge.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-500 text-white p-3 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Trending</h3>
                <p className="text-sm text-gray-600">60+ trending score</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Properties with high recent activity in views and leads. Score based on last 7 days. Orange badge.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500 text-white p-3 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">New Listing</h3>
                <p className="text-sm text-gray-600">Listed within 30 days</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Fresh properties with high visibility potential. Perfect for getting early attention. Blue badge.
            </p>
          </div>
        </div>

        {properties.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Current Property Performance Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Badge</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Conversion</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Trending</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Leads</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Leads (7d)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => {
                    let badge = null;
                    if (property.conversion_rate >= 15) {
                      badge = (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          <Award className="w-3 h-3" />
                          High Conversion
                        </span>
                      );
                    } else if (property.trending_score >= 60) {
                      badge = (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </span>
                      );
                    } else if (property.is_new_listing) {
                      badge = (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                          <Sparkles className="w-3 h-3" />
                          New Listing
                        </span>
                      );
                    }

                    return (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{property.name}</td>
                        <td className="px-4 py-3">{badge}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className={`font-semibold ${property.conversion_rate >= 15 ? 'text-green-600' : 'text-gray-600'}`}>
                            {property.conversion_rate?.toFixed(1) || 0}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className={`font-semibold ${property.trending_score >= 60 ? 'text-orange-600' : 'text-gray-600'}`}>
                            {Math.round(property.trending_score || 0)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {property.total_leads || 0}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {property.leads_last_7_days || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Play className="w-5 h-5" />
            How to Test the Recommendation Engine
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-900">
            <li className="text-sm">Click "Seed Test Data" above to populate properties with performance metrics</li>
            <li className="text-sm">Navigate to any campaign detail page (Agent Campaigns → Select a campaign)</li>
            <li className="text-sm">Click the "Add Property" button to open the property selection modal</li>
            <li className="text-sm">Observe the colored badges on property cards:
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li className="text-xs">Green badge = High Conversion (15%+ conversion rate)</li>
                <li className="text-xs">Orange badge = Trending (60+ trending score)</li>
                <li className="text-xs">Blue badge = New Listing (created within 30 days)</li>
              </ul>
            </li>
            <li className="text-sm">Check the AI Suggestions section - it now prioritizes properties based on real performance data</li>
            <li className="text-sm">Notice conversion rates and trending scores displayed on each property card</li>
            <li className="text-sm">Properties are automatically sorted by performance (best first)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
