import type { IAlert } from '@/types/alert'

export const ALERT_FIXTURES: IAlert[] = [
  {
    id: 'alert-1',
    title: 'Multiple Failed Authentication Attempts',
    severity: 'critical',
    status: 'open',
    createdAt: '2024-01-03T10:00:00.000Z',
    source: 'SIEM',
    description: 'Brute force attack detected on admin account',
  },
  {
    id: 'alert-2',
    title: 'Suspicious Network Traffic',
    severity: 'high',
    status: 'investigating',
    createdAt: '2024-01-02T08:00:00.000Z',
    source: 'Network',
    description: 'Unusual outbound traffic to unknown IP',
  },
  {
    id: 'alert-3',
    title: 'Malware Signature Detected',
    severity: 'medium',
    status: 'resolved',
    createdAt: '2024-01-01T06:00:00.000Z',
    source: 'EDR',
    description: 'Known malware signature found in quarantine',
  },
  {
    id: 'alert-4',
    title: 'Outdated Software Version',
    severity: 'low',
    status: 'open',
    createdAt: '2024-01-04T12:00:00.000Z',
    source: 'Endpoint',
    description: 'Software vulnerability in legacy component',
  },
]
