import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Users } from 'lucide-react';

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

interface LeafletMapProps {
  leads: Lead[];
  onLeadClick?: (leadId: string) => void;
}

function MapBounds({ clusters }: { clusters: Cluster[] }) {
  const map = useMap();

  useEffect(() => {
    if (clusters.length > 0) {
      const bounds = clusters.map(c => [c.lat, c.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [clusters, map]);

  return null;
}

export default function LeafletMap({ leads, onLeadClick }: LeafletMapProps) {
  const leadsWithLocation = leads.filter(lead => lead.latitude && lead.longitude);

  const clusters: Cluster[] = (() => {
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
  })();

  const getClusterColor = (count: number) => {
    if (count >= 10) return '#ef4444';
    if (count >= 5) return '#f97316';
    return '#3b82f6';
  };

  const getClusterRadius = (count: number) => {
    const baseRadius = 15;
    const maxRadius = 40;
    return Math.min(maxRadius, baseRadius + (count * 3));
  };

  const defaultCenter: [number, number] = leadsWithLocation.length > 0
    ? [leadsWithLocation[0].latitude, leadsWithLocation[0].longitude]
    : [14.5995, 120.9842];

  if (leadsWithLocation.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Location Data Available</h3>
        <p className="text-gray-600">
          Leads need geographic coordinates to display on the map.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds clusters={clusters} />
        {clusters.map((cluster, idx) => (
          <CircleMarker
            key={idx}
            center={[cluster.lat, cluster.lng]}
            radius={getClusterRadius(cluster.count)}
            pathOptions={{
              fillColor: getClusterColor(cluster.count),
              fillOpacity: 0.6,
              color: getClusterColor(cluster.count),
              weight: 2,
              opacity: 0.8
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="font-semibold text-gray-900 mb-2">
                  {cluster.city || 'Unknown Location'}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {cluster.count} lead{cluster.count !== 1 ? 's' : ''}
                </div>
                {cluster.leads.length <= 5 && (
                  <div className="space-y-1 border-t border-gray-200 pt-2">
                    {cluster.leads.map((lead, leadIdx) => (
                      <div
                        key={leadIdx}
                        className="text-sm hover:bg-gray-50 p-1 rounded cursor-pointer"
                        onClick={() => onLeadClick?.(lead.id)}
                      >
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        {lead.budget && (
                          <div className="text-xs text-gray-600">
                            Budget: ₱{lead.budget.toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
