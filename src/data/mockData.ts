import { Developer, Property, PropertyDetails, Lead, Booking, Message, ChatMessage, AgentProfile } from '../types';
import { DeveloperProfile, Project, Activity, PaymentPlan, Document, User } from '../types';

export const mockDevelopers: Developer[] = [
  {
    id: '1',
    name: 'Godrej Properties',
    projectCount: 8,
    location: 'Gurgaon, Delhi NCR',
    startingPrice: '₹1.2 Cr',
    possessionDate: 'Dec 2025',
    description: 'Premium residential and commercial developments'
  },
  {
    id: '2',
    name: 'DLF Limited',
    projectCount: 12,
    location: 'Gurgaon, Delhi NCR',
    startingPrice: '₹95 Lac',
    possessionDate: 'Mar 2026',
    description: 'India\'s largest real estate developer'
  },
  {
    id: '3',
    name: 'Prestige Group',
    projectCount: 6,
    location: 'Bangalore, Karnataka',
    startingPrice: '₹85 Lac',
    possessionDate: 'Jun 2025',
    description: 'Luxury living spaces and commercial complexes'
  },
  {
    id: '4',
    name: 'Brigade Group',
    projectCount: 9,
    location: 'Bangalore, Karnataka',
    startingPrice: '₹78 Lac',
    possessionDate: 'Oct 2025',
    description: 'Innovative real estate solutions'
  },
  {
    id: '5',
    name: 'Lodha Group',
    projectCount: 15,
    location: 'Mumbai, Maharashtra',
    startingPrice: '₹1.8 Cr',
    possessionDate: 'Jan 2026',
    description: 'Luxury residential and commercial projects'
  },
  {
    id: '6',
    name: 'Sobha Limited',
    projectCount: 7,
    location: 'Bangalore, Karnataka',
    startingPrice: '₹92 Lac',
    possessionDate: 'Aug 2025',
    description: 'Premium crafted living spaces'
  }
];

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Godrej Meridien',
    developerId: '1',
    developer: 'Godrej Properties',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Sector 106, Gurgaon',
    startingPrice: '₹1.2 Cr',
    possessionDate: 'Dec 2025',
    propertyType: 'Apartment',
    bedrooms: '2-4 BHK',
    bathrooms: '2-3',
    status: 'Available',
    highlights: ['Premium Location', 'Modern Amenities', 'Ready to Move']
  },
  {
    id: '2',
    name: 'Godrej Park Avenue',
    developerId: '1',
    developer: 'Godrej Properties',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Sector 79, Gurgaon',
    startingPrice: '₹95 Lac',
    possessionDate: 'Mar 2026',
    propertyType: 'Apartment',
    bedrooms: '1-3 BHK',
    bathrooms: '1-2',
    status: 'Few Units Left',
    highlights: ['Green Spaces', 'Club House', 'Swimming Pool']
  },
  {
    id: '3',
    name: 'DLF The Crest',
    developerId: '2',
    developer: 'DLF Limited',
    image: 'https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Golf Course Road, Gurgaon',
    startingPrice: '₹2.5 Cr',
    possessionDate: 'Jun 2025',
    propertyType: 'Apartment',
    bedrooms: '3-4 BHK',
    bathrooms: '3-4',
    status: 'Available',
    highlights: ['Golf Course View', 'Luxury Amenities', 'Prime Location']
  }
];

export const getMockPropertyDetails = (propertyId: string): PropertyDetails | undefined => {
  const property = mockProperties.find(p => p.id === propertyId);
  if (!property) return undefined;

  return {
    ...property,
    description: 'Experience luxury living at its finest with world-class amenities, modern architecture, and prime location connectivity. This premium residential project offers the perfect blend of comfort, convenience, and style.',
    amenities: [
      'Swimming Pool',
      'Gym & Fitness Center',
      'Clubhouse',
      'Children\'s Play Area',
      'Landscaped Gardens',
      'Security System',
      '24/7 Power Backup',
      'Parking Space'
    ],
    floorPlans: [
      {
        id: '1',
        type: '2 BHK',
        image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400',
        size: '1200 sq.ft'
      },
      {
        id: '2',
        type: '3 BHK',
        image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400',
        size: '1650 sq.ft'
      }
    ],
    brochures: [
      {
        id: '1',
        name: 'Project Brochure',
        url: '#'
      },
      {
        id: '2',
        name: 'Floor Plans',
        url: '#'
      },
      {
        id: '3',
        name: 'Price List',
        url: '#'
      }
    ],
    units: [
      { id: '101', unitNumber: 'A101', floor: 1, type: '2BHK', size: '1200 sq.ft', price: '₹1.2 Cr', status: 'Available' },
      { id: '102', unitNumber: 'A102', floor: 1, type: '2BHK', size: '1200 sq.ft', price: '₹1.2 Cr', status: 'Held' },
      { id: '103', unitNumber: 'A103', floor: 1, type: '3BHK', size: '1650 sq.ft', price: '₹1.8 Cr', status: 'Available' },
      { id: '201', unitNumber: 'A201', floor: 2, type: '2BHK', size: '1200 sq.ft', price: '₹1.25 Cr', status: 'Sold' },
      { id: '202', unitNumber: 'A202', floor: 2, type: '2BHK', size: '1200 sq.ft', price: '₹1.25 Cr', status: 'Available' },
      { id: '203', unitNumber: 'A203', floor: 2, type: '3BHK', size: '1650 sq.ft', price: '₹1.85 Cr', status: 'Available' },
      { id: '301', unitNumber: 'A301', floor: 3, type: '2BHK', size: '1200 sq.ft', price: '₹1.3 Cr', status: 'Available' },
      { id: '302', unitNumber: 'A302', floor: 3, type: '2BHK', size: '1200 sq.ft', price: '₹1.3 Cr', status: 'Held' },
      { id: '303', unitNumber: 'A303', floor: 3, type: '3BHK', size: '1650 sq.ft', price: '₹1.9 Cr', status: 'Available' },
    ],
    paymentPlans: [
      {
        id: '1',
        name: 'Standard Plan',
        downPayment: '20%',
        installments: '70% in 24 months',
        possessionPayment: '10%'
      },
      {
        id: '2',
        name: 'Flexi Plan',
        downPayment: '10%',
        installments: '80% in 36 months',
        possessionPayment: '10%'
      }
    ]
  };
};

export const mockLeads: Lead[] = [
  {
    id: '1',
    buyerName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    status: 'Hot',
    stage: 'Negotiation',
    projectName: 'Godrej Meridien',
    developerName: 'Godrej Properties',
    lastInteraction: '2 hours ago',
    budget: '₹1.2 - 1.5 Cr',
    requirements: '3 BHK, Ready to move',
    notes: [
      'Very interested in 3BHK unit on higher floors',
      'Prefers east-facing units for morning sunlight',
      'Budget is flexible, can go up to ₹1.6 Cr for right unit'
    ],
    reminders: [
      {
        id: 'r1',
        leadId: '1',
        type: 'site_visit',
        title: 'Site Visit Scheduled',
        description: 'Show 3BHK units on floors 10-15',
        dueDate: '2024-12-20',
        dueTime: '10:00',
        isCompleted: false,
        priority: 'high',
        createdAt: '2024-12-15'
      }
    ],
    score: 9,
    tags: ['High Budget', 'Ready Buyer', 'Immediate'],
    nextFollowUp: 'Site visit this weekend'
  },
  {
    id: '2',
    buyerName: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya.sharma@email.com',
    status: 'Warm',
    stage: 'New Lead',
    projectName: 'DLF The Crest',
    developerName: 'DLF Limited',
    lastInteraction: '1 day ago',
    budget: '₹2 - 2.5 Cr',
    requirements: '4 BHK, Golf course view',
    notes: [
      'Interested in golf course facing units only',
      'Husband travels frequently, wants good connectivity'
    ],
    reminders: [
      {
        id: 'r2',
        leadId: '2',
        type: 'follow_up',
        title: 'Follow up after site visit',
        description: 'Check feedback on units shown yesterday',
        dueDate: '2024-12-18',
        dueTime: '14:00',
        isCompleted: false,
        priority: 'medium',
        createdAt: '2024-12-15'
      }
    ],
    score: 7,
    tags: ['Golf View', 'Premium'],
    nextFollowUp: 'Follow up on site visit feedback'
  },
  {
    id: '3',
    buyerName: 'Amit Patel',
    phone: '+91 76543 21098',
    email: 'amit.patel@email.com',
    status: 'Cold',
    stage: 'Contacted',
    projectName: 'Godrej Park Avenue',
    developerName: 'Godrej Properties',
    lastInteraction: '5 days ago',
    budget: '₹95 Lac - 1.2 Cr',
    requirements: '2 BHK, Good connectivity',
    notes: [
      'First time buyer, needs guidance on process',
      'Concerned about loan approval'
    ],
    reminders: [],
    score: 4,
    tags: ['First Time Buyer', 'Loan Required'],
    nextFollowUp: 'Call to check loan pre-approval status'
  },
  {
    id: '4',
    buyerName: 'Sneha Gupta',
    phone: '+91 65432 10987',
    email: 'sneha.gupta@email.com',
    status: 'Hot',
    stage: 'New Lead',
    projectName: 'Prestige Lakeside',
    developerName: 'Prestige Group',
    lastInteraction: '30 minutes ago',
    budget: '₹85 Lac - 1 Cr',
    requirements: '2-3 BHK, Near IT corridor',
    notes: [
      'Works in IT, prefers proximity to tech parks',
      'Looking for investment + self-use'
    ],
    reminders: [
      {
        id: 'r4',
        leadId: '4',
        type: 'call',
        title: 'Initial consultation call',
        description: 'Understand detailed requirements and budget',
        dueDate: '2024-12-16',
        dueTime: '11:00',
        isCompleted: false,
        priority: 'high',
        createdAt: '2024-12-15'
      }
    ],
    score: 8,
    tags: ['IT Professional', 'Investment'],
    nextFollowUp: 'Schedule initial consultation'
  },
  {
    id: '5',
    buyerName: 'Vikram Singh',
    phone: '+91 54321 09876',
    email: 'vikram.singh@email.com',
    status: 'Warm',
    stage: 'Contacted',
    projectName: 'Brigade Gateway',
    developerName: 'Brigade Group',
    lastInteraction: '3 days ago',
    budget: '₹78 Lac - 95 Lac',
    requirements: '1-2 BHK, Investment purpose',
    notes: [
      'Pure investment buyer, looking for rental yield',
      'Owns 2 properties already'
    ],
    reminders: [],
    score: 6,
    tags: ['Investor', 'Rental Yield'],
    nextFollowUp: 'Share rental yield analysis'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    projectName: 'Godrej Meridien',
    developerName: 'Godrej Properties',
    unitDetails: {
      tower: 'Tower A',
      floor: 12,
      unitNumber: 'A1201',
      type: '3 BHK'
    },
    bookingDate: '15 Nov 2024',
    status: 'Confirmed',
    stage: 'Agreement',
    totalAmount: '₹1.35 Cr',
    paidAmount: '₹27 Lac',
    pendingAmount: '₹1.08 Cr',
    paymentProgress: 20,
    nextPaymentDate: '15 Dec 2024',
    buyerName: 'Rajesh Kumar',
    agentNotes: [
      'Buyer very satisfied with unit selection',
      'Agreement signing scheduled for next week'
    ],
    milestones: [
      {
        id: 'm1',
        stage: 'Token',
        title: 'Token Amount Paid',
        description: 'Initial booking amount received',
        isCompleted: true,
        completedDate: '15 Nov 2024',
        documents: ['token_receipt.pdf']
      },
      {
        id: 'm2',
        stage: 'Agreement',
        title: 'Agreement Signing',
        description: 'Sale agreement to be signed',
        isCompleted: false,
        documents: ['draft_agreement.pdf']
      },
      {
        id: 'm3',
        stage: 'Final Closure',
        title: 'Registration & Handover',
        description: 'Property registration and key handover',
        isCompleted: false,
        documents: []
      }
    ]
  },
  {
    id: '2',
    projectName: 'DLF The Crest',
    developerName: 'DLF Limited',
    unitDetails: {
      tower: 'Tower B',
      floor: 8,
      unitNumber: 'B803',
      type: '4 BHK'
    },
    bookingDate: '22 Oct 2024',
    status: 'Payment Pending',
    stage: 'Token',
    totalAmount: '₹2.8 Cr',
    paidAmount: '₹56 Lac',
    pendingAmount: '₹2.24 Cr',
    paymentProgress: 20,
    nextPaymentDate: '22 Dec 2024',
    buyerName: 'Priya Sharma',
    agentNotes: [
      'Waiting for loan approval from HDFC Bank',
      'Buyer committed, just processing paperwork'
    ],
    milestones: [
      {
        id: 'm4',
        stage: 'Token',
        title: 'Token Amount Paid',
        description: 'Initial booking amount received',
        isCompleted: true,
        completedDate: '22 Oct 2024',
        documents: ['token_receipt.pdf']
      },
      {
        id: 'm5',
        stage: 'Agreement',
        title: 'Agreement Signing',
        description: 'Pending loan approval',
        isCompleted: false,
        documents: []
      },
      {
        id: 'm6',
        stage: 'Final Closure',
        title: 'Registration & Handover',
        description: 'Final registration process',
        isCompleted: false,
        documents: []
      }
    ]
  },
  {
    id: '3',
    projectName: 'Prestige Lakeside',
    developerName: 'Prestige Group',
    unitDetails: {
      tower: 'Tower C',
      floor: 5,
      unitNumber: 'C502',
      type: '2 BHK'
    },
    bookingDate: '8 Dec 2024',
    status: 'Reserved',
    stage: 'Token',
    totalAmount: '₹92 Lac',
    paidAmount: '₹5 Lac',
    pendingAmount: '₹87 Lac',
    paymentProgress: 5,
    nextPaymentDate: '8 Jan 2025',
    buyerName: 'Sneha Gupta',
    agentNotes: [
      'New booking, very excited about the project',
      'Needs to arrange remaining token amount'
    ],
    milestones: [
      {
        id: 'm7',
        stage: 'Token',
        title: 'Token Amount Paid',
        description: 'Partial token paid, balance pending',
        isCompleted: false,
        documents: []
      },
      {
        id: 'm8',
        stage: 'Agreement',
        title: 'Agreement Signing',
        description: 'Agreement preparation in progress',
        isCompleted: false,
        documents: []
      },
      {
        id: 'm9',
        stage: 'Final Closure',
        title: 'Registration & Handover',
        description: 'Final closure process',
        isCompleted: false,
        documents: []
      }
    ]
  }
];

// Enhanced mock data for reminders
export const mockTodayReminders = [
  {
    id: 'r1',
    leadId: '1',
    type: 'site_visit' as const,
    title: 'Site Visit - Rajesh Kumar',
    description: 'Show 3BHK units on floors 10-15',
    dueDate: '2024-12-20',
    dueTime: '10:00',
    isCompleted: false,
    priority: 'high' as const,
    createdAt: '2024-12-15'
  },
  {
    id: 'r4',
    leadId: '4',
    type: 'call' as const,
    title: 'Initial Call - Sneha Gupta',
    description: 'Understand detailed requirements and budget',
    dueDate: '2024-12-16',
    dueTime: '11:00',
    isCompleted: false,
    priority: 'high' as const,
    createdAt: '2024-12-15'
  },
  {
    id: 'r5',
    leadId: '2',
    type: 'follow_up' as const,
    title: 'Follow up - Priya Sharma',
    description: 'Check feedback on units shown yesterday',
    dueDate: '2024-12-18',
    dueTime: '14:00',
    isCompleted: false,
    priority: 'medium' as const,
    createdAt: '2024-12-15'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    contactName: 'Rajesh Kumar',
    contactType: 'Buyer',
    lastMessage: 'Can we schedule a site visit this weekend?',
    timestamp: '2 min ago',
    unreadCount: 2
  },
  {
    id: '2',
    contactName: 'Godrej Properties',
    contactType: 'Developer',
    lastMessage: 'Updated price list for Meridien project attached',
    timestamp: '1 hour ago',
    unreadCount: 0
  },
  {
    id: '3',
    contactName: 'Priya Sharma',
    contactType: 'Buyer',
    lastMessage: 'Thank you for the floor plan. Looks good!',
    timestamp: '3 hours ago',
    unreadCount: 0
  },
  {
    id: '4',
    contactName: 'DLF Sales Team',
    contactType: 'Developer',
    lastMessage: 'Special offer valid till month end',
    timestamp: '1 day ago',
    unreadCount: 1
  },
  {
    id: '5',
    contactName: 'Amit Patel',
    contactType: 'Buyer',
    lastMessage: 'What are the payment options available?',
    timestamp: '2 days ago',
    unreadCount: 0
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'buyer1',
    senderName: 'Rajesh Kumar',
    message: 'Hi, I\'m interested in the 3 BHK unit at Godrej Meridien',
    timestamp: '10:30 AM',
    type: 'text'
  },
  {
    id: '2',
    senderId: 'agent1',
    senderName: 'You',
    message: 'Hello Rajesh! Great choice. I have some excellent options available. Let me share the details.',
    timestamp: '10:32 AM',
    type: 'text'
  },
  {
    id: '3',
    senderId: 'agent1',
    senderName: 'You',
    message: 'Floor Plan - 3 BHK Premium',
    timestamp: '10:33 AM',
    type: 'attachment',
    attachmentType: 'floorplan',
    attachmentName: 'Meridien_3BHK_FloorPlan.pdf'
  },
  {
    id: '4',
    senderId: 'buyer1',
    senderName: 'Rajesh Kumar',
    message: 'This looks perfect! What\'s the pricing and payment plan?',
    timestamp: '10:45 AM',
    type: 'text'
  },
  {
    id: '5',
    senderId: 'agent1',
    senderName: 'You',
    message: 'Price Quote - Godrej Meridien 3BHK',
    timestamp: '10:47 AM',
    type: 'attachment',
    attachmentType: 'quote',
    attachmentName: 'Meridien_3BHK_Quote.pdf'
  },
  {
    id: '6',
    senderId: 'buyer1',
    senderName: 'Rajesh Kumar',
    message: 'Can we schedule a site visit this weekend?',
    timestamp: '11:15 AM',
    type: 'text'
  }
];

export const mockAgentProfile: AgentProfile = {
  id: '1',
  name: 'Arjun Mehta',
  designation: 'Senior Property Consultant',
  region: 'Gurgaon & Delhi NCR',
  phone: '+91 98765 43210',
  email: 'arjun.mehta@propertyagent.com',
  stats: {
    leadsHandled: 156,
    bookingsClosed: 23,
    targetsAchieved: 85,
    monthlyTarget: 30
  },
  settings: {
    currency: 'INR',
    language: 'English',
    notifications: true
  }
};

export const mockDeveloperProfile: DeveloperProfile = {
  id: '1',
  name: 'Rajesh Sharma',
  companyName: 'Godrej Properties',
  designation: 'Project Manager',
  region: 'Gurgaon & Delhi NCR',
  phone: '+91 98765 43211',
  email: 'rajesh.sharma@godrej.com',
  stats: {
    totalProjects: 8,
    activeListings: 5,
    unitsSold: 142,
    revenue: '₹85.6 Cr'
  },
  settings: {
    currency: 'INR',
    language: 'English',
    notifications: true
  }
};

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Godrej Meridien',
    developerId: '1',
    location: 'Sector 106, Gurgaon',
    type: 'Apartment',
    startingPrice: '₹1.2 Cr',
    possessionDate: 'Dec 2025',
    status: 'Under Construction',
    totalUnits: 120,
    availableUnits: 45,
    soldUnits: 65,
    heldUnits: 10,
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Premium residential project with world-class amenities',
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Garden', 'Security'],
    createdAt: '2024-01-15',
    updatedAt: '2024-12-15'
  },
  {
    id: '2',
    name: 'Godrej Park Avenue',
    developerId: '1',
    location: 'Sector 79, Gurgaon',
    type: 'Apartment',
    startingPrice: '₹95 Lac',
    possessionDate: 'Mar 2026',
    status: 'Planning',
    totalUnits: 200,
    availableUnits: 180,
    soldUnits: 15,
    heldUnits: 5,
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Affordable luxury living with green spaces',
    amenities: ['Garden', 'Playground', 'Community Hall', 'Parking'],
    createdAt: '2024-02-20',
    updatedAt: '2024-12-10'
  },
  {
    id: '3',
    name: 'Godrej Heights',
    developerId: '1',
    location: 'Sector 89, Gurgaon',
    type: 'Apartment',
    startingPrice: '₹1.8 Cr',
    possessionDate: 'Jun 2025',
    status: 'Ready',
    totalUnits: 80,
    availableUnits: 12,
    soldUnits: 68,
    heldUnits: 0,
    image: 'https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Ready to move luxury apartments',
    amenities: ['Swimming Pool', 'Gym', 'Spa', 'Concierge', 'Valet Parking'],
    createdAt: '2023-08-10',
    updatedAt: '2024-12-12'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'booking',
    title: 'New Booking Received',
    description: 'Unit A1201 booked in Godrej Meridien',
    timestamp: '2 hours ago',
    projectId: '1',
    projectName: 'Godrej Meridien'
  },
  {
    id: '2',
    type: 'upload',
    title: 'Brochure Updated',
    description: 'New brochure uploaded for Godrej Park Avenue',
    timestamp: '5 hours ago',
    projectId: '2',
    projectName: 'Godrej Park Avenue'
  },
  {
    id: '3',
    type: 'lead',
    title: 'New Lead Assigned',
    description: 'High-value lead for Godrej Heights',
    timestamp: '1 day ago',
    projectId: '3',
    projectName: 'Godrej Heights'
  },
  {
    id: '4',
    type: 'price_update',
    title: 'Price Updated',
    description: 'Starting price updated for Godrej Meridien',
    timestamp: '2 days ago',
    projectId: '1',
    projectName: 'Godrej Meridien'
  }
];

export const mockCurrentUser: User = {
  id: '1',
  name: 'Arjun Mehta',
  email: 'arjun.mehta@propertyagent.com',
  role: 'agent',
  profile: mockAgentProfile
};

// Admin Mock Data
export const mockAdminProfile = {
  id: 'admin1',
  name: 'System Administrator',
  email: 'admin@propertyagent.com',
  role: 'admin' as const,
  permissions: ['user_management', 'system_settings', 'audit_logs', 'role_management'],
  lastLogin: '2024-12-15 09:30:00',
  createdAt: '2024-01-01'
};

export const mockAdminUser = {
  id: 'admin1',
  name: 'System Administrator',
  email: 'admin@propertyagent.com',
  role: 'admin' as const,
  profile: mockAdminProfile
};

export const mockAdminStats = {
  totalUsers: 1247,
  agents: 89,
  activeAgents: 76,
  developers: 34,
  activeDevelopers: 31,
  buyers: 1124,
  activeBuyers: 892,
  suspendedUsers: 12,
  newUsersThisMonth: 45
};

export const mockAllUsers = [
  {
    id: '1',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@propertyagent.com',
    role: 'agent',
    status: 'active',
    lastLogin: '2 hours ago',
    joinedDate: 'Jan 15, 2024',
    region: 'Gurgaon & Delhi NCR'
  },
  {
    id: '2',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@godrej.com',
    role: 'developer',
    status: 'active',
    lastLogin: '1 day ago',
    joinedDate: 'Feb 20, 2024',
    region: 'Gurgaon & Delhi NCR'
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'agent',
    status: 'suspended',
    lastLogin: '5 days ago',
    joinedDate: 'Mar 10, 2024',
    region: 'Mumbai & Maharashtra'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    role: 'agent',
    status: 'active',
    lastLogin: '30 minutes ago',
    joinedDate: 'Apr 5, 2024',
    region: 'Bangalore & Karnataka'
  },
  {
    id: '5',
    name: 'ABC Properties',
    email: 'contact@abcproperties.com',
    role: 'developer',
    status: 'inactive',
    lastLogin: '90 days ago',
    joinedDate: 'Jan 1, 2024',
    region: 'Pune & Maharashtra'
  },
  {
    id: '6',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    role: 'buyer',
    status: 'active',
    lastLogin: '1 week ago',
    joinedDate: 'Nov 20, 2024',
    region: 'Gurgaon & Delhi NCR'
  },
  {
    id: '7',
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    role: 'buyer',
    status: 'active',
    lastLogin: '3 days ago',
    joinedDate: 'Dec 1, 2024',
    region: 'Mumbai & Maharashtra'
  }
];

export const mockRecentActions = [
  {
    id: '1',
    type: 'suspend',
    title: 'User Account Suspended',
    description: 'Suspended agent account due to policy violation',
    targetUser: 'John Smith (Agent)',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'reset',
    title: 'Password Reset',
    description: 'Reset password for locked account',
    targetUser: 'Sarah Wilson (Agent)',
    timestamp: '5 hours ago'
  },
  {
    id: '3',
    type: 'reactivate',
    title: 'Account Reactivated',
    description: 'Reactivated developer account after verification',
    targetUser: 'XYZ Developers (Developer)',
    timestamp: '1 day ago'
  },
  {
    id: '4',
    type: 'edit',
    title: 'User Profile Updated',
    description: 'Updated user role from Agent to Developer',
    targetUser: 'David Kumar (Developer)',
    timestamp: '2 days ago'
  }
];

export const mockAuditLogs = [
  {
    id: '1',
    action: 'suspend',
    description: 'Suspended user account due to multiple failed login attempts',
    targetUser: 'John Smith',
    adminUser: 'System Administrator',
    timestamp: '2024-12-15 14:30:00',
    ipAddress: '192.168.1.100',
    details: 'Account locked after 5 consecutive failed login attempts within 10 minutes'
  },
  {
    id: '2',
    action: 'reset',
    description: 'Password reset requested and processed',
    targetUser: 'Sarah Wilson',
    adminUser: 'System Administrator',
    timestamp: '2024-12-15 09:15:00',
    ipAddress: '192.168.1.100',
    details: 'User requested password reset via support ticket #12345'
  },
  {
    id: '3',
    action: 'reactivate',
    description: 'Reactivated suspended developer account',
    targetUser: 'XYZ Developers',
    adminUser: 'System Administrator',
    timestamp: '2024-12-14 16:45:00',
    ipAddress: '192.168.1.100',
    details: 'Account reactivated after successful identity verification'
  },
  {
    id: '4',
    action: 'edit',
    description: 'Updated user role and permissions',
    targetUser: 'David Kumar',
    adminUser: 'System Administrator',
    timestamp: '2024-12-14 11:20:00',
    ipAddress: '192.168.1.100',
    details: 'Changed role from Agent to Developer, updated regional permissions'
  },
  {
    id: '5',
    action: 'view',
    description: 'Accessed user profile for audit',
    targetUser: 'Priya Patel',
    adminUser: 'System Administrator',
    timestamp: '2024-12-14 08:30:00',
    ipAddress: '192.168.1.100',
    details: 'Routine audit of buyer account activity'
  },
  {
    id: '6',
    action: 'suspend',
    description: 'Temporary suspension for policy review',
    targetUser: 'ABC Properties',
    adminUser: 'System Administrator',
    timestamp: '2024-12-13 15:10:00',
    ipAddress: '192.168.1.100',
    details: 'Account suspended pending review of reported listing violations'
  }
];

// Notifications Mock Data
export const mockNotifications = [
  {
    id: '1',
    type: 'new_property' as const,
    title: 'New Property Added',
    message: 'Godrej Meridien Phase 2 is now available for promotion',
    data: { propertyId: '1', developerName: 'Godrej Properties' },
    isRead: false,
    createdAt: '2024-12-15 10:30:00',
    targetRole: 'agent' as const,
    propertyId: '1'
  },
  {
    id: '2',
    type: 'promotion' as const,
    title: 'Special Offer Available',
    message: 'Limited time offer: 5% discount on DLF The Crest',
    data: { promotionId: '1', propertyId: '3' },
    isRead: false,
    createdAt: '2024-12-15 08:15:00',
    targetRole: 'agent' as const,
    propertyId: '3',
    promotionId: '1'
  },
  {
    id: '3',
    type: 'promotion' as const,
    title: 'Early Bird Offer',
    message: 'Get 2% additional discount for bookings this month',
    data: { promotionId: '2', propertyId: '2' },
    isRead: true,
    createdAt: '2024-12-14 16:20:00',
    targetRole: 'agent' as const,
    propertyId: '2',
    promotionId: '2'
  }
];

// Agent Property Interest Mock Data
export const mockAgentPropertyInterest = [
  {
    id: '1',
    agentId: '1',
    propertyId: '1',
    isInterested: true,
    createdAt: '2024-12-10 14:30:00',
    updatedAt: '2024-12-10 14:30:00'
  },
  {
    id: '2',
    agentId: '1',
    propertyId: '3',
    isInterested: true,
    createdAt: '2024-12-12 09:15:00',
    updatedAt: '2024-12-12 09:15:00'
  }
];

// Promotions Mock Data
export const mockPromotions = [
  {
    id: '1',
    developerId: '2',
    propertyId: '3',
    title: 'Limited Time Offer - DLF The Crest',
    message: 'Special discount for early bookings! Get 5% off on all units.',
    offerDetails: '5% discount on base price + Free car parking + Modular kitchen included',
    validFrom: '2024-12-15',
    validUntil: '2024-12-31',
    isActive: true,
    createdAt: '2024-12-15 08:00:00',
    updatedAt: '2024-12-15 08:00:00'
  },
  {
    id: '2',
    developerId: '1',
    propertyId: '2',
    title: 'Early Bird Special - Godrej Park Avenue',
    message: 'Book now and save! Limited period offer for first 50 bookings.',
    offerDetails: '2% additional discount + Free registration + 1 year maintenance free',
    validFrom: '2024-12-14',
    validUntil: '2024-12-28',
    isActive: true,
    createdAt: '2024-12-14 16:00:00',
    updatedAt: '2024-12-14 16:00:00'
  },
  {
    id: '3',
    developerId: '1',
    propertyId: '1',
    title: 'Festive Offer - Godrej Meridien',
    message: 'Celebrate the season with exclusive benefits on premium units.',
    offerDetails: 'Free club membership + Premium fixtures + Extended warranty',
    validFrom: '2024-12-01',
    validUntil: '2024-12-25',
    isActive: true,
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00'
  }
];