export interface LeadData {
  budget_range?: string;
  source?: string;
  status?: string;
  engagement_score?: number;
}

export function calculateLeadPriority(lead: LeadData): number {
  let score = 0;

  const budgetScore = getBudgetScore(lead.budget_range);
  score += budgetScore * 0.4;

  const sourceScore = getSourceQualityScore(lead.source);
  score += sourceScore * 0.3;

  const engagementScore = lead.engagement_score || 50;
  score += engagementScore * 0.3;

  return Math.min(100, Math.max(0, Math.round(score)));
}

function getBudgetScore(budgetRange?: string): number {
  if (!budgetRange) return 30;

  const budgetLower = budgetRange.toLowerCase();

  if (budgetLower.includes('10m') || budgetLower.includes('15m') || budgetLower.includes('20m+')) {
    return 100;
  }
  if (budgetLower.includes('5m+') || budgetLower.includes('8m')) {
    return 95;
  }
  if (budgetLower.includes('3m') || budgetLower.includes('4m') || budgetLower.includes('5m')) {
    return 85;
  }
  if (budgetLower.includes('2m') || budgetLower.includes('3m')) {
    return 75;
  }
  if (budgetLower.includes('1m') || budgetLower.includes('1.5m')) {
    return 65;
  }
  if (budgetLower.includes('500k') || budgetLower.includes('800k')) {
    return 50;
  }

  return 40;
}

function getSourceQualityScore(source?: string): number {
  if (!source) return 50;

  const sourceLower = source.toLowerCase();

  const sourceQuality: Record<string, number> = {
    'referral': 95,
    'google': 85,
    'linkedin': 80,
    'instagram': 75,
    'facebook': 70,
    'website': 65,
    'whatsapp': 60,
    'organic': 50,
    'other': 40
  };

  for (const [key, value] of Object.entries(sourceQuality)) {
    if (sourceLower.includes(key)) {
      return value;
    }
  }

  return 50;
}

export function getPriorityLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

export function getPriorityColor(score: number): string {
  if (score >= 80) return 'text-red-600 fill-red-600';
  if (score >= 60) return 'text-yellow-600 fill-yellow-600';
  return 'text-gray-400 fill-gray-400';
}

export function getPriorityBadgeColor(score: number): string {
  if (score >= 80) return 'bg-red-100 text-red-700 border-red-200';
  if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}
