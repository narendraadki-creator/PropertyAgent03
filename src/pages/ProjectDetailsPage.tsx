import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share, Heart, MapPin, Calendar, Building, Users, TrendingUp, CreditCard as Edit, Phone, MessageCircle, Gift, Plus, Megaphone } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser, mockDeveloperProfile } from '../data/mockData';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const project = mockProjects.find(p => p.id === projectId);
  
  // Create a developer user for the layout
  const developerUser = {
    ...mockCurrentUser,
    role: 'developer' as const,
    profile: mockDeveloperProfile
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Project not found</h2>
          <button 
            onClick={() => navigate('/developer/projects')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to projects
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-700';
      case 'Under Construction':
        return 'bg-yellow-100 text-yellow-700';
      case 'Planning':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const occupancyPercentage = ((project.soldUnits + project.heldUnits) / project.totalUnits) * 100;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'units', label: 'Units' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'documents', label: 'Documents' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <RoleBasedLayout user={developerUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate('/developer/projects')}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Edit className="w-5 h-5 text-neutral-600" />
            </button>
            <button 
              onClick={() => navigate(`/developer/promotions?create=true&propertyId=${projectId}`)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Gift className="w-5 h-5 text-neutral-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Share className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <img 
          src={project.image} 
          alt={project.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-4 right-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat ${getStatusColor(project.status)}`}>
            {project.status}
          </div>
        </div>
      </div>

      {/* Project Header */}
      <div className="bg-white px-4 py-6 border-b border-neutral-100">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-neutral-800 font-montserrat mb-2">
            {project.name}
          </h1>
          <div className="flex items-center text-neutral-500 mb-2">
            <MapPin className="w-4 h-4 mr-2" strokeWidth={1.5} />
            <span className="font-montserrat text-sm">{project.location}</span>
          </div>
          <p className="text-sm text-neutral-600 font-montserrat">
            {project.type} • {project.totalUnits} Total Units
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <span className="block text-2xl font-bold text-primary-600 font-montserrat">
              {project.startingPrice}
            </span>
            <span className="text-sm text-neutral-500 font-montserrat">Starting Price</span>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <span className="block text-lg font-bold text-neutral-800 font-montserrat">
              {project.possessionDate}
            </span>
            <span className="text-sm text-neutral-500 font-montserrat">Possession</span>
          </div>
        </div>

        {/* Occupancy Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600 font-montserrat">Occupancy</span>
            <span className="text-sm font-bold text-primary-600 font-montserrat">{occupancyPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-center">
          <div className="flex items-center justify-center">
            <Users className="w-4 h-4 mr-2 text-green-500" strokeWidth={1.5} />
            <div>
              <div className="font-bold text-green-600 font-montserrat">{project.soldUnits}</div>
              <div className="text-neutral-500 font-montserrat">Sold</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" strokeWidth={1.5} />
            <div>
              <div className="font-bold text-blue-600 font-montserrat">{project.availableUnits}</div>
              <div className="text-neutral-500 font-montserrat">Available</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Building className="w-4 h-4 mr-2 text-yellow-500" strokeWidth={1.5} />
            <div>
              <div className="font-bold text-yellow-600 font-montserrat">{project.heldUnits}</div>
              <div className="text-neutral-500 font-montserrat">Held</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-100 sticky top-16 z-30">
        <div className="overflow-x-auto">
          <div className="flex space-x-0 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium font-montserrat whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 pb-32">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-3">Project Description</h3>
              <p className="text-neutral-600 font-montserrat leading-relaxed">{project.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-3">Key Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
                  <span className="text-neutral-600 font-montserrat">Project Type</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{project.type}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
                  <span className="text-neutral-600 font-montserrat">Total Units</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{project.totalUnits}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
                  <span className="text-neutral-600 font-montserrat">Created</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
                  <span className="text-neutral-600 font-montserrat">Last Updated</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'amenities' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Project Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {project.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-sm text-neutral-600 p-3 bg-white rounded-lg border border-neutral-200">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="font-montserrat">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'units' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Unit Management</h3>
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
                <h4 className="text-lg font-medium text-neutral-600 mb-2">Unit Management</h4>
                <p className="text-neutral-400 font-montserrat text-sm mb-4">
                  Detailed unit management features coming soon
                </p>
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors">
                  Manage Units
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Project Documents</h3>
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
                <h4 className="text-lg font-medium text-neutral-600 mb-2">Document Management</h4>
                <p className="text-neutral-400 font-montserrat text-sm mb-4">
                  Upload and manage project documents, brochures, and legal papers
                </p>
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors">
                  Upload Documents
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Project Analytics</h3>
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
                <h4 className="text-lg font-medium text-neutral-600 mb-2">Analytics Dashboard</h4>
                <p className="text-neutral-400 font-montserrat text-sm mb-4">
                  View detailed analytics, sales performance, and market insights
                </p>
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-neutral-200 p-4">
        <div className="flex space-x-3 max-w-md mx-auto">
          <button 
            onClick={() => navigate(`/developer/projects/${project.id}/edit`)}
            className="flex-1 bg-neutral-100 text-neutral-700 py-3 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
          >
            Edit Project
          </button>
          <button
            onClick={() => navigate(`/developer/campaigns/create?projectId=${project.id}`)}
            className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-medium font-montserrat hover:bg-teal-700 transition-colors flex items-center justify-center"
          >
            <Megaphone className="w-5 h-5 mr-2" strokeWidth={1.5} />
            Campaign
          </button>
          <button
            onClick={() => navigate(`/developer/promotions?create=true&propertyId=${project.id}`)}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <Gift className="w-5 h-5 mr-2" strokeWidth={1.5} />
            Promotion
          </button>
          <button className="p-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
            <Phone className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
          </button>
          <button className="p-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
            <MessageCircle className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default ProjectDetailsPage;