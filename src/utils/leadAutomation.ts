export interface AutomationRule {
  id: string;
  name: string;
  type: 'inactivity_alert' | 'stage_transition' | 'reminder_generation' | 'stale_detection';
  enabled: boolean;
  conditions: Record<string, any>;
  actions: Record<string, any>;
}

export interface LeadActivity {
  leadId: string;
  activityType: 'call' | 'visit' | 'email' | 'note' | 'stage_change';
  timestamp: Date;
}

export const calculateStaleStatus = (lastActivityDate: Date): boolean => {
  const hoursSinceActivity = (Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60);
  return hoursSinceActivity > 72;
};

export const shouldSendInactivityAlert = (lastActivityDate: Date): {
  shouldAlert: boolean;
  severity: 'low' | 'medium' | 'high';
  message: string;
} => {
  const hoursSinceActivity = (Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60);

  if (hoursSinceActivity >= 72) {
    return {
      shouldAlert: true,
      severity: 'high',
      message: 'Lead has been inactive for 72+ hours. Immediate action required.'
    };
  } else if (hoursSinceActivity >= 48) {
    return {
      shouldAlert: true,
      severity: 'medium',
      message: 'Lead inactive for 48 hours. Manager notification sent.'
    };
  } else if (hoursSinceActivity >= 24) {
    return {
      shouldAlert: true,
      severity: 'low',
      message: 'Lead inactive for 24 hours. Reminder sent to agent.'
    };
  }

  return {
    shouldAlert: false,
    severity: 'low',
    message: ''
  };
};

export const generateAutomaticReminder = (
  leadStage: string,
  lastActivity: Date
): {
  shouldCreateReminder: boolean;
  reminderType: string;
  title: string;
  description: string;
  dueInHours: number;
} | null => {
  const stageReminders: Record<string, any> = {
    'New Lead': {
      type: 'call',
      title: 'Initial contact call',
      description: 'Make first contact with the lead',
      dueInHours: 4
    },
    'Contacted': {
      type: 'follow_up',
      title: 'Follow-up on initial contact',
      description: 'Check interest level and schedule site visit',
      dueInHours: 24
    },
    'Site Visit Scheduled': {
      type: 'site_visit',
      title: 'Site visit reminder',
      description: 'Confirm attendance and prepare property details',
      dueInHours: 2
    },
    'Site Visit Completed': {
      type: 'follow_up',
      title: 'Post-visit follow-up',
      description: 'Gather feedback and address concerns',
      dueInHours: 8
    },
    'Negotiation': {
      type: 'negotiation',
      title: 'Negotiation follow-up',
      description: 'Review offer and move towards booking',
      dueInHours: 48
    }
  };

  const reminder = stageReminders[leadStage];
  if (!reminder) return null;

  const hoursSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);

  if (hoursSinceActivity < 1) {
    return {
      shouldCreateReminder: true,
      reminderType: reminder.type,
      title: reminder.title,
      description: reminder.description,
      dueInHours: reminder.dueInHours
    };
  }

  return null;
};

export const suggestNextStage = (currentStage: string): {
  nextStage: string;
  requiredActions: string[];
  estimatedDuration: string;
} | null => {
  const stageProgression: Record<string, any> = {
    'New Lead': {
      nextStage: 'Contacted',
      requiredActions: ['Make initial call', 'Capture requirements', 'Qualify lead'],
      estimatedDuration: '1-2 days'
    },
    'Contacted': {
      nextStage: 'Site Visit Scheduled',
      requiredActions: ['Discuss requirements', 'Present project options', 'Schedule visit'],
      estimatedDuration: '2-3 days'
    },
    'Site Visit Scheduled': {
      nextStage: 'Site Visit Completed',
      requiredActions: ['Conduct site visit', 'Show units', 'Answer questions'],
      estimatedDuration: '1 day'
    },
    'Site Visit Completed': {
      nextStage: 'Negotiation',
      requiredActions: ['Follow up on feedback', 'Address concerns', 'Present offer'],
      estimatedDuration: '2-5 days'
    },
    'Negotiation': {
      nextStage: 'Booking Initiated',
      requiredActions: ['Finalize terms', 'Prepare documents', 'Collect token amount'],
      estimatedDuration: '3-7 days'
    },
    'Booking Initiated': {
      nextStage: 'Booked / Closed',
      requiredActions: ['Complete documentation', 'Process payments', 'Sign agreement'],
      estimatedDuration: '7-14 days'
    }
  };

  return stageProgression[currentStage] || null;
};

export const calculateLeadScore = (lead: {
  status: string;
  stage: string;
  lastActivityDate: Date;
  responseRate: number;
  budgetMatch: boolean;
  requirementsMatch: boolean;
}): number => {
  let score = 5;

  if (lead.status === 'Hot') score += 3;
  else if (lead.status === 'Warm') score += 1;
  else if (lead.status === 'Cold') score -= 2;

  const stageScores: Record<string, number> = {
    'New Lead': 0,
    'Contacted': 1,
    'Site Visit Scheduled': 2,
    'Site Visit Completed': 3,
    'Negotiation': 3,
    'Booking Initiated': 4
  };
  score += stageScores[lead.stage] || 0;

  const hoursSinceActivity = (Date.now() - lead.lastActivityDate.getTime()) / (1000 * 60 * 60);
  if (hoursSinceActivity < 24) score += 1;
  else if (hoursSinceActivity > 72) score -= 2;

  if (lead.responseRate > 0.8) score += 1;
  else if (lead.responseRate < 0.3) score -= 1;

  if (lead.budgetMatch) score += 1;
  if (lead.requirementsMatch) score += 1;

  return Math.max(1, Math.min(10, score));
};

export const detectLeadIssues = (lead: {
  lastActivityDate: Date;
  stage: string;
  nextFollowUp: Date | null;
  score: number;
}): Array<{
  type: 'stale' | 'overdue' | 'low_engagement' | 'high_priority';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestedAction: string;
}> => {
  const issues = [];

  const staleCheck = shouldSendInactivityAlert(lead.lastActivityDate);
  if (staleCheck.shouldAlert) {
    issues.push({
      type: 'stale' as const,
      severity: staleCheck.severity,
      message: staleCheck.message,
      suggestedAction: 'Contact the lead immediately to re-engage'
    });
  }

  if (lead.nextFollowUp && lead.nextFollowUp < new Date()) {
    issues.push({
      type: 'overdue' as const,
      severity: 'medium' as const,
      message: 'Follow-up is overdue',
      suggestedAction: 'Complete the pending follow-up action'
    });
  }

  if (lead.score >= 8 && lead.stage === 'Negotiation') {
    issues.push({
      type: 'high_priority' as const,
      severity: 'high' as const,
      message: 'High-priority lead in negotiation stage',
      suggestedAction: 'Prioritize this lead and move to booking'
    });
  }

  if (lead.score < 4) {
    issues.push({
      type: 'low_engagement' as const,
      severity: 'low' as const,
      message: 'Lead showing low engagement',
      suggestedAction: 'Re-assess lead qualification and interest level'
    });
  }

  return issues;
};

export const generateManagerAlert = (
  leadId: string,
  agentId: string,
  issue: {
    type: string;
    severity: string;
    message: string;
  }
): {
  alertType: string;
  severity: string;
  title: string;
  description: string;
  leadId: string;
  agentId: string;
} => {
  return {
    alertType: issue.type,
    severity: issue.severity,
    title: `Lead Alert: ${issue.type.replace('_', ' ')}`,
    description: issue.message,
    leadId,
    agentId
  };
};

export const calculateAgentPerformanceMetrics = (leads: Array<{
  agentId: string;
  stage: string;
  status: string;
  createdAt: Date;
  lastActivityDate: Date;
}>): {
  totalLeads: number;
  activeLeads: number;
  conversionRate: number;
  avgResponseTime: number;
  staleLeadRate: number;
} => {
  const total = leads.length;
  const active = leads.filter(l =>
    !['Booked / Closed', 'Lost / Dropped'].includes(l.stage)
  ).length;

  const closed = leads.filter(l => l.stage === 'Booked / Closed').length;
  const conversionRate = total > 0 ? (closed / total) * 100 : 0;

  const responseTimes = leads.map(l =>
    (l.lastActivityDate.getTime() - l.createdAt.getTime()) / (1000 * 60 * 60)
  );
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;

  const staleLeads = leads.filter(l =>
    calculateStaleStatus(l.lastActivityDate)
  ).length;
  const staleLeadRate = total > 0 ? (staleLeads / total) * 100 : 0;

  return {
    totalLeads: total,
    activeLeads: active,
    conversionRate,
    avgResponseTime,
    staleLeadRate
  };
};
