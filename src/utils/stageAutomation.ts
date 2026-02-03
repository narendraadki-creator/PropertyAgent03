import { Lead } from '../types';

interface StageAutomation {
  nextFollowUp: string;
  newReminder: {
    id: string;
    title: string;
    dueDate: string;
    dueTime: string;
    isCompleted: boolean;
  };
}

const getDateString = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

const getTimeString = (hoursFromNow: number): string => {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${displayHours}:${displayMinutes} ${ampm}`;
};

export const getStageAutomation = (newStage: string, leadId: string): StageAutomation | null => {
  const automationMap: { [key: string]: StageAutomation } = {
    'New Lead': {
      nextFollowUp: getDateString(0) + ' (Today)',
      newReminder: {
        id: `reminder-${Date.now()}`,
        title: 'Make first contact call',
        dueDate: getDateString(0),
        dueTime: getTimeString(2),
        isCompleted: false
      }
    },
    'Contacted': {
      nextFollowUp: getDateString(1) + ' (Tomorrow)',
      newReminder: {
        id: `reminder-${Date.now()}`,
        title: 'Follow-up call to schedule site visit',
        dueDate: getDateString(1),
        dueTime: getTimeString(24),
        isCompleted: false
      }
    },
    'Site Visit Scheduled': {
      nextFollowUp: getDateString(2),
      newReminder: {
        id: `reminder-${Date.now()}`,
        title: 'Prepare site visit materials and property details',
        dueDate: getDateString(2),
        dueTime: '10:00 AM',
        isCompleted: false
      }
    },
    'Site Visit Completed': {
      nextFollowUp: getDateString(1),
      newReminder: {
        id: `reminder-${Date.now()}`,
        title: 'Send follow-up email with proposal and pricing',
        dueDate: getDateString(1),
        dueTime: '11:00 AM',
        isCompleted: false
      }
    },
    'Negotiation': {
      nextFollowUp: getDateString(1),
      newReminder: {
        id: `reminder-${Date.now()}`,
        title: 'Discuss pricing options and payment plans',
        dueDate: getDateString(1),
        dueTime: '2:00 PM',
        isCompleted: false
      }
    },
    'Booking Initiated': {
      nextFollowUp: getDateString(1),
      newReminder: {
        id: `reminder-${Date.now()}`,
        title: 'Complete booking paperwork and documentation',
        dueDate: getDateString(1),
        dueTime: '10:00 AM',
        isCompleted: false
      }
    },
    'Booked / Closed': {
      nextFollowUp: getDateString(30),
      newReminder: {
        id: `reminder-${Date.now()}`,
        title: 'Post-sale follow-up and request referral',
        dueDate: getDateString(30),
        dueTime: '3:00 PM',
        isCompleted: false
      }
    },
    'Lost / Dropped': {
      nextFollowUp: getDateString(30),
      newReminder: {
        id: `reminder-${Date.now()}`,
        title: 'Check in to see if circumstances changed',
        dueDate: getDateString(30),
        dueTime: '2:00 PM',
        isCompleted: false
      }
    }
  };

  return automationMap[newStage] || null;
};

export const applyStageAutomation = (lead: Lead, newStage: string): Lead => {
  const automation = getStageAutomation(newStage, lead.id);

  if (!automation) {
    return { ...lead, stage: newStage };
  }

  const existingReminders = lead.reminders || [];

  return {
    ...lead,
    stage: newStage,
    nextFollowUp: automation.nextFollowUp,
    reminders: [...existingReminders, automation.newReminder]
  };
};
