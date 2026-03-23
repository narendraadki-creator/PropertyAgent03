import React from 'react';
import { MapPin, Calendar, Bed, Bath, Tag, TrendingUp, Award, Sparkles } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  conversionRate?: number;
  trendingScore?: number;
  isNewListing?: boolean;
  recommendationReason?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  conversionRate,
  trendingScore,
  isNewListing,
  recommendationReason
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700';
      case 'Few Units Left':
        return 'bg-yellow-100 text-yellow-700';
      case 'Sold Out':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getRecommendationTag = () => {
    if (conversionRate && conversionRate >= 15) {
      return {
        label: 'High Conversion',
        icon: Award,
        color: 'bg-green-500 text-white',
        glow: 'shadow-lg shadow-green-500/50'
      };
    }
    if (trendingScore && trendingScore >= 60) {
      return {
        label: 'Trending',
        icon: TrendingUp,
        color: 'bg-orange-500 text-white',
        glow: 'shadow-lg shadow-orange-500/50'
      };
    }
    if (isNewListing) {
      return {
        label: 'New Listing',
        icon: Sparkles,
        color: 'bg-blue-500 text-white',
        glow: 'shadow-lg shadow-blue-500/50'
      };
    }
    return null;
  };

  const recommendationTag = getRecommendationTag();

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium font-montserrat ${getStatusColor(property.status)}`}>
          {property.status}
        </div>
        {recommendationTag && (
          <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold font-montserrat flex items-center gap-1.5 ${recommendationTag.color} ${recommendationTag.glow} animate-pulse`}>
            <recommendationTag.icon className="w-3.5 h-3.5" />
            {recommendationTag.label}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="text-white text-lg font-bold font-montserrat">{property.startingPrice}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1 group-hover:text-primary-600 transition-colors">
            {property.name}
          </h3>
          <p className="text-sm text-neutral-500 font-montserrat">by {property.developer}</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-neutral-600">
            <MapPin className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            <span className="font-montserrat">{property.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-neutral-600">
              <Bed className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">{property.bedrooms}</span>
            </div>
            
            <div className="flex items-center text-sm text-neutral-600">
              <Bath className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">{property.bathrooms} Bath</span>
            </div>

            <div className="flex items-center text-sm text-neutral-600">
              <Calendar className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">{property.possessionDate}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {property.highlights.slice(0, 2).map((highlight, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-medium font-montserrat rounded-md"
            >
              {highlight}
            </span>
          ))}
        </div>

        {(conversionRate !== undefined || trendingScore !== undefined) && (
          <div className="flex items-center justify-around py-2 mb-3 bg-gray-50 rounded-lg border border-gray-100">
            {conversionRate !== undefined && conversionRate > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 font-montserrat">Conversion</span>
                <span className="text-sm font-bold text-green-600 font-montserrat">{conversionRate.toFixed(1)}%</span>
              </div>
            )}
            {trendingScore !== undefined && trendingScore > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 font-montserrat">Trending</span>
                <span className="text-sm font-bold text-orange-600 font-montserrat">{Math.round(trendingScore)}/100</span>
              </div>
            )}
          </div>
        )}

        <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;