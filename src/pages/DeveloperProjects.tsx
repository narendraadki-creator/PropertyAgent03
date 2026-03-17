import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Filter, Grid3x3 as Grid3X3, List, Gift, Megaphone } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import ProjectCard from '../components/ProjectCard';
import DeveloperBottomNavigation from '../components/DeveloperBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser, mockDeveloperProfile } from '../data/mockData';

const DeveloperProjects: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Create a developer user for the layout
  const developerUser = {
    ...mockCurrentUser,
    role: 'developer' as const,
    profile: mockDeveloperProfile
  };

  const statusOptions = ['All', 'Planning', 'Under Construction', 'Ready', 'Completed'];

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <RoleBasedLayout user={developerUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/developer/dashboard')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  PROPERTY AGENT
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">My Projects</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                {viewMode === 'grid' ?
                  <List className="w-5 h-5 text-neutral-600" strokeWidth={1.5} /> :
                  <Grid3X3 className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                }
              </button>
              <button
                onClick={() => navigate('/developer/campaigns')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                title="Marketing Campaigns"
              >
                <Megaphone className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => navigate('/developer/promotions')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <Gift className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => navigate('/developer/projects/new')}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects by name or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <button className="p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                <Filter className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-neutral-600 font-montserrat">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {filteredProjects.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/developer/projects/${project.id}`)}
                showActions={true}
                onEdit={() => navigate(`/developer/projects/${project.id}/edit`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No projects found</h3>
            <p className="text-neutral-400 font-montserrat text-sm mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button 
              onClick={() => navigate('/developer/projects/new')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              Create New Project
            </button>
          </div>
        )}
      </div>

    </RoleBasedLayout>
  );
};

export default DeveloperProjects;