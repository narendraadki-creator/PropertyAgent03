export interface Developer {
  id: string;
  name: string;
  logo?: string;
  projectCount: number;
  location: string;
  startingPrice: string;
  possessionDate: string;
  description?: string;
}

export interface Property {
  id: string;
  name: string;
  developerId: string;
  developer: string;
  image: string;
  location: string;
  startingPrice: string;
  possessionDate: string;
  propertyType: 'Apartment' | 'Villa' | 'Flat' | 'Plot' | 'Office';
  bedrooms: string;
  bathrooms: string;
  status: 'Available' | 'Few Units Left' | 'Sold Out';
  highlights: string[];
}

export interface Unit {
  id: string;
  unitNumber: string;
  floor: number;
  type: string;
  size: string;
  price: string;
  status: 'Available' | 'Held' | 'Sold';
}

export interface PropertyDetails extends Property {
  description: string;
  amenities: string[];
  floorPlans: Array<{
    id: string;
    type: string;
    image: string;
    size: string;
  }>;
  brochures: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  units: Unit[];
  paymentPlans: Array<{
    id: string;
    name: string;
    downPayment: string;
    installments: string;
    possessionPayment: string;
  }>;
}

export interface Lead {
  id: string;
  buyerName: string;
  phone: string;
  email: string;
  status: 'Hot' | 'Warm' | 'Cold';
  stage: 'New' | 'Contacted' | 'Site Visit' | 'Negotiation' | 'Closed';
  projectName: string;
  developerName: string;
  lastInteraction: string;
  budget: string;
  requirements: string;
  notes: string[];
  reminders: Reminder[];
  score: number; // 1-10 scoring
  tags: string[];
  nextFollowUp?: string;
}

export interface Reminder {
  id: string;
  leadId: string;
  type: 'call' | 'site_visit' | 'follow_up' | 'negotiation' | 'other';
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Booking {
  id: string;
  projectName: string;
  developerName: string;
  unitDetails: {
    tower: string;
    floor: number;
    unitNumber: string;
    type: string;
  };
  bookingDate: string;
  status: 'Reserved' | 'Payment Pending' | 'Confirmed';
  stage: 'Token' | 'Agreement' | 'Final Closure';
  totalAmount: string;
  paidAmount: string;
  pendingAmount: string;
  paymentProgress: number;
  nextPaymentDate?: string;
  buyerName: string;
  agentNotes: string[];
  milestones: BookingMilestone[];
}

export interface BookingMilestone {
  id: string;
  stage: 'Token' | 'Agreement' | 'Final Closure';
  title: string;
  description: string;
  isCompleted: boolean;
  completedDate?: string;
  documents: string[];
}

export interface Message {
  id: string;
  contactName: string;
  contactType: 'Buyer' | 'Developer' | 'Agent';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'attachment';
  attachmentType?: 'brochure' | 'floorplan' | 'quote';
  attachmentName?: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  designation: string;
  region: string;
  phone: string;
  email: string;
  avatar?: string;
  stats: {
    leadsHandled: number;
    bookingsClosed: number;
    targetsAchieved: number;
    monthlyTarget: number;
  };
  settings: {
    currency: string;
    language: string;
    notifications: boolean;
  };
}

export interface DeveloperProfile {
  id: string;
  name: string;
  companyName: string;
  designation: string;
  region: string;
  phone: string;
  email: string;
  avatar?: string;
  stats: {
    totalProjects: number;
    activeListings: number;
    unitsSold: number;
    revenue: string;
  };
  settings: {
    currency: string;
    language: string;
    notifications: boolean;
  };
}

export interface Project {
  id: string;
  name: string;
  developerId: string;
  location: string;
  type: 'Apartment' | 'Villa' | 'Flat' | 'Plot' | 'Office';
  startingPrice: string;
  possessionDate: string;
  status: 'Planning' | 'Under Construction' | 'Ready' | 'Completed';
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  heldUnits: number;
  image: string;
  description: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'upload' | 'booking' | 'price_update' | 'lead' | 'project_created';
  title: string;
  description: string;
  timestamp: string;
  projectId?: string;
  projectName?: string;
}

export interface PaymentPlan {
  id: string;
  projectId: string;
  name: string;
  downPayment: string;
  installments: string;
  possessionPayment: string;
  emiAmount?: string;
  tenure?: string;
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: 'brochure' | 'floorplan' | 'layout' | 'legal' | 'other';
  url: string;
  version: string;
  uploadedAt: string;
  size: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'developer' | 'manager' | 'admin';
  profile: AgentProfile | DeveloperProfile;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  permissions: string[];
  lastLogin: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  agents: number;
  activeAgents: number;
  developers: number;
  activeDevelopers: number;
  buyers: number;
  activeBuyers: number;
  suspendedUsers: number;
  newUsersThisMonth: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'developer' | 'buyer';
  status: 'active' | 'suspended' | 'inactive';
  lastLogin: string;
  joinedDate: string;
  region?: string;
}

export interface AdminAction {
  id: string;
  type: 'suspend' | 'reactivate' | 'reset' | 'edit' | 'view';
  title: string;
  description: string;
  targetUser: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: 'suspend' | 'reactivate' | 'reset' | 'edit' | 'view';
  description: string;
  targetUser: string;
  adminUser: string;
  timestamp: string;
  ipAddress?: string;
  details?: string;
}

export interface Notification {
  id: string;
  type: 'new_property' | 'promotion' | 'system' | 'booking' | 'lead';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  targetRole?: 'agent' | 'developer' | 'admin';
  propertyId?: string;
  promotionId?: string;
}

export interface AgentPropertyInterest {
  id: string;
  agentId: string;
  propertyId: string;
  isInterested: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  developerId: string;
  propertyId: string;
  title: string;
  message: string;
  offerDetails: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}