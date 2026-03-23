import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, MapPin, Users, TrendingUp, RefreshCw, CheckCircle } from 'lucide-react';
import { seedGeoData } from '../utils/seedGeoData';

export default function TestGeoHeatmap() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const seedResult = await seedGeoData();
      setResult(seedResult);
      setSeeded(true);
    } catch (error) {
      console.error('Error seeding geo data:', error);
      alert('Error seeding data. Check console for details.');
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
                <h1 className="text-2xl font-bold text-gray-900">Test Geo Heatmap</h1>
                <p className="text-sm text-gray-600">Seed location data and test the geographic visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-2">Geographic Lead Distribution Test</h2>
          <p className="text-blue-50 mb-4">
            This tool will add realistic geographic coordinates to your leads across Metro Manila.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSeedData}
              disabled={loading}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                  Seed Geographic Data
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/leads')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors border-2 border-white"
            >
              View Leads Page
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-green-900">Success!</h3>
            </div>
            <p className="text-green-800 mb-2">{result.message}</p>
            {result.leads && (
              <p className="text-sm text-green-700">
                Updated {result.leads} leads with geographic coordinates
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-500 text-white p-3 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">High Density</h3>
                <p className="text-sm text-gray-600">10+ leads</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Red clusters indicate areas with highest concentration of leads. These are your hot zones for targeted marketing.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-500 text-white p-3 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Medium Density</h3>
                <p className="text-sm text-gray-600">5-9 leads</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Orange clusters show moderate activity. Good opportunities for expansion and targeted campaigns.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500 text-white p-3 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Low Density</h3>
                <p className="text-sm text-gray-600">1-4 leads</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Blue clusters represent emerging areas with growth potential. Consider these for future marketing efforts.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Metro Manila Coverage</h3>
          <p className="text-gray-600 mb-4">
            The seeding tool distributes leads across major cities in Metro Manila:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Makati', 'Taguig', 'Quezon City', 'Pasig', 'Manila', 'Mandaluyong',
              'Pasay', 'Parañaque', 'Las Piñas', 'Muntinlupa', 'San Juan', 'Marikina',
              'Caloocan', 'Valenzuela', 'Malabon'
            ].map((city) => (
              <div key={city} className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">{city}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Play className="w-5 h-5" />
            How to Test the Geo Heatmap
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-900">
            <li className="text-sm">Click "Seed Geographic Data" above to add location data to your leads</li>
            <li className="text-sm">Navigate to the Leads page using the button above or via the menu</li>
            <li className="text-sm">Click the "Map View" toggle button to switch from table to map</li>
            <li className="text-sm">Observe the interactive heatmap with color-coded clusters:
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li className="text-xs">Red circles = High concentration (10+ leads)</li>
                <li className="text-xs">Orange circles = Medium concentration (5-9 leads)</li>
                <li className="text-xs">Blue circles = Low concentration (1-4 leads)</li>
              </ul>
            </li>
            <li className="text-sm">Hover over any cluster to see:
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li className="text-xs">City name</li>
                <li className="text-xs">Number of leads in the area</li>
                <li className="text-xs">Individual lead names (for small clusters)</li>
              </ul>
            </li>
            <li className="text-sm">Use the zoom controls (+ / -) to zoom in and out of the map</li>
            <li className="text-sm">Click and drag to pan around the map</li>
            <li className="text-sm">View the "Top Cities by Lead Count" section below the map</li>
            <li className="text-sm">Check the summary cards showing total leads, hot zones, and locations</li>
          </ol>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-amber-900 mb-3">Features</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-amber-900">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Interactive canvas-based heatmap with smooth rendering</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-amber-900">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Intelligent clustering algorithm groups nearby leads automatically</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-amber-900">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Color-coded density visualization for quick insights</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-amber-900">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Pan and zoom controls for detailed exploration</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-amber-900">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Hover tooltips with cluster details and lead names</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-amber-900">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Summary statistics and top cities ranking</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-amber-900">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Seamless toggle between table and map views</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
