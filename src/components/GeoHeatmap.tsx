import React, { useEffect, useRef, useState } from 'react';
import { MapPin, TrendingUp, Users, ZoomIn, ZoomOut } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  budget?: number;
  stage?: string;
}

interface Cluster {
  lat: number;
  lng: number;
  count: number;
  leads: Lead[];
  city?: string;
}

interface GeoHeatmapProps {
  leads: Lead[];
  onLeadClick?: (leadId: string) => void;
}

export default function GeoHeatmap({ leads, onLeadClick }: GeoHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCluster, setHoveredCluster] = useState<Cluster | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const leadsWithLocation = leads.filter(lead => lead.latitude && lead.longitude);

  const clusters = React.useMemo(() => {
    const clusterMap = new Map<string, Cluster>();
    const CLUSTER_DISTANCE = 0.05;

    leadsWithLocation.forEach(lead => {
      let foundCluster = false;

      for (const [key, cluster] of clusterMap.entries()) {
        const distance = Math.sqrt(
          Math.pow(cluster.lat - lead.latitude, 2) +
          Math.pow(cluster.lng - lead.longitude, 2)
        );

        if (distance < CLUSTER_DISTANCE) {
          cluster.leads.push(lead);
          cluster.count++;
          cluster.lat = (cluster.lat * (cluster.count - 1) + lead.latitude) / cluster.count;
          cluster.lng = (cluster.lng * (cluster.count - 1) + lead.longitude) / cluster.count;
          foundCluster = true;
          break;
        }
      }

      if (!foundCluster) {
        const key = `${lead.latitude.toFixed(4)},${lead.longitude.toFixed(4)}`;
        clusterMap.set(key, {
          lat: lead.latitude,
          lng: lead.longitude,
          count: 1,
          leads: [lead],
          city: lead.city
        });
      }
    });

    return Array.from(clusterMap.values());
  }, [leadsWithLocation]);

  const bounds = React.useMemo(() => {
    if (leadsWithLocation.length === 0) {
      return {
        minLat: 14.0,
        maxLat: 15.0,
        minLng: 120.5,
        maxLng: 121.5
      };
    }

    const lats = leadsWithLocation.map(l => l.latitude);
    const lngs = leadsWithLocation.map(l => l.longitude);

    return {
      minLat: Math.min(...lats) - 0.1,
      maxLat: Math.max(...lats) + 0.1,
      minLng: Math.min(...lngs) - 0.1,
      maxLng: Math.max(...lngs) + 0.1
    };
  }, [leadsWithLocation]);

  const latLngToXY = (lat: number, lng: number, width: number, height: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width;
    const y = height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height;
    return {
      x: x * zoom + pan.x,
      y: y * zoom + pan.y
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width * zoom + pan.x;
      const y = (i / 10) * height * zoom + pan.y;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    clusters.forEach(cluster => {
      const pos = latLngToXY(cluster.lat, cluster.lng, width, height);

      if (pos.x < -50 || pos.x > width + 50 || pos.y < -50 || pos.y > height + 50) {
        return;
      }

      const maxRadius = 60;
      const minRadius = 15;
      const radius = Math.min(maxRadius, minRadius + (cluster.count * 8));

      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);

      if (cluster.count >= 10) {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.1)');
      } else if (cluster.count >= 5) {
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.8)');
        gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)');
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0.1)');
      } else {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.strokeStyle = cluster.count >= 10 ? '#dc2626' : cluster.count >= 5 ? '#ea580c' : '#2563eb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = cluster.count >= 10 ? '#dc2626' : cluster.count >= 5 ? '#ea580c' : '#2563eb';
      ctx.font = 'bold 14px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cluster.count.toString(), pos.x, pos.y);
    });

  }, [clusters, zoom, pan, bounds]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePos({ x: mouseX, y: mouseY });

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      const width = canvas.width;
      const height = canvas.height;

      let found = false;
      for (const cluster of clusters) {
        const pos = latLngToXY(cluster.lat, cluster.lng, width, height);
        const distance = Math.sqrt(
          Math.pow(mouseX - pos.x, 2) + Math.pow(mouseY - pos.y, 2)
        );

        if (distance < 25) {
          setHoveredCluster(cluster);
          found = true;
          break;
        }
      }

      if (!found) {
        setHoveredCluster(null);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const topCities = React.useMemo(() => {
    const cityCount = new Map<string, number>();

    leadsWithLocation.forEach(lead => {
      if (lead.city) {
        cityCount.set(lead.city, (cityCount.get(lead.city) || 0) + 1);
      }
    });

    return Array.from(cityCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));
  }, [leadsWithLocation]);

  if (leadsWithLocation.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Location Data Available</h3>
        <p className="text-gray-600">
          Leads need geographic coordinates to display on the heatmap.
          <br />
          Add location data to your leads to see the visualization.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Leads</p>
              <p className="text-3xl font-bold mt-1">{leadsWithLocation.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Hot Zones</p>
              <p className="text-3xl font-bold mt-1">{clusters.filter(c => c.count >= 5).length}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Locations</p>
              <p className="text-3xl font-bold mt-1">{clusters.length}</p>
            </div>
            <MapPin className="w-10 h-10 text-teal-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Geographic Distribution</h3>
              <p className="text-sm text-gray-600">Interactive heatmap showing lead concentration</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            className="w-full cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {hoveredCluster && (
            <div
              className="absolute bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl pointer-events-none z-10 max-w-xs"
              style={{
                left: mousePos.x + 15,
                top: mousePos.y - 15,
                transform: 'translateY(-100%)'
              }}
            >
              <div className="font-semibold mb-1">
                {hoveredCluster.city || 'Unknown Location'}
              </div>
              <div className="text-sm text-gray-300">
                {hoveredCluster.count} lead{hoveredCluster.count !== 1 ? 's' : ''}
              </div>
              {hoveredCluster.leads.length <= 3 && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  {hoveredCluster.leads.map((lead, idx) => (
                    <div key={idx} className="text-xs text-gray-400">
                      {lead.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
            <div className="text-xs font-semibold text-gray-700 mb-2">Heat Intensity</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">High (10+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-600">Medium (5-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Low (1-4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {topCities.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Top Cities by Lead Count</h3>
          <div className="space-y-2">
            {topCities.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="font-medium text-gray-900">{item.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: `${(item.count / leadsWithLocation.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
