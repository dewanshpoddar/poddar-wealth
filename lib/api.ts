/**
 * Centralized API service for Poddar Wealth
 */

export interface LeadData {
  name: string;
  mobile: string;
  city?: string;
  profession?: string;
  email?: string;
  intent?: string;
  wantTo?: string;
  iAm?: string;
}

export async function submitLead(data: LeadData) {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit lead');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
