import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const severities = ['low', 'medium', 'high', 'critical']
const statuses = ['open', 'investigating', 'resolved']
const sources = ['EDR', 'SIEM', 'Cloud', 'Network', 'Endpoint']

const alertTitles = [
  'Unusual Login Activity Detected on Server {server}',
  'Potential Malware Infection on {user} Workstation',
  'High CPU Usage Anomaly on {service}',
  'Multiple Failed Authentication Attempts for {user}',
  'Suspicious Outbound Connection from {ip}',
  'Data Exfiltration Attempt Detected from {service}',
  'Privilege Escalation Detected for user {user}',
  'Anomalous API Gateway Traffic from {ip}',
  'Ransomware Signature Detected on File Server',
  'Phishing Email Reported by {user}',
]

const placeholders = {
  server: ['DB-PROD-01', 'WEB-APP-03', 'AUTH-SRV-EU'],
  user: ['j.doe', 'a.smith', 'm.jones', 's.williams'],
  service: ['Billing API', 'User Service', 'Order Processor'],
  ip: ['192.168.1.101', '10.0.5.23', '172.16.31.5'],
}

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const alerts = []
const timelineEvents = []
const totalAlerts = 160 // 10 for each severity/status combo

console.log('Generating new mock data...')

for (let i = 0; i < totalAlerts; i++) {
  const severity = severities[i % severities.length]
  const status = statuses[i % statuses.length]
  const source = getRandomItem(sources)
  const createdAt = generateRandomDate(new Date(2023, 0, 1), new Date())

  let title = getRandomItem(alertTitles)
  Object.keys(placeholders).forEach((key) => {
    if (title.includes(`{${key}}`)) {
      title = title.replace(`{${key}}`, getRandomItem(placeholders[key]))
    }
  })

  const alert = {
    id: randomUUID(),
    title,
    severity,
    status,
    createdAt: createdAt.toISOString(),
    source,
    description: `This is a generated alert for "${title}". The system detected this event and requires investigation. The severity is ${severity} and the current status is ${status}.`,
  }
  alerts.push(alert)

  // Generate timeline events for this alert
  const timelineForAlert = []
  timelineForAlert.push({
    id: randomUUID(),
    alertId: alert.id,
    event: 'Alert created and ingested.',
    timestamp: alert.createdAt,
  })

  if (status === 'investigating' || status === 'resolved') {
    const investigatingTime = new Date(
      createdAt.getTime() + Math.random() * (new Date().getTime() - createdAt.getTime()) * 0.5,
    )
    timelineForAlert.push({
      id: randomUUID(),
      alertId: alert.id,
      event: 'Status changed to "investigating". Analyst J. Doe assigned.',
      timestamp: investigatingTime.toISOString(),
    })

    if (status === 'resolved') {
      const resolvedTime = new Date(
        investigatingTime.getTime() +
          Math.random() * (new Date().getTime() - investigatingTime.getTime()) * 0.5,
      )
      timelineForAlert.push({
        id: randomUUID(),
        alertId: alert.id,
        event: 'Status changed to "resolved". Root cause identified as a misconfiguration.',
        timestamp: resolvedTime.toISOString(),
      })
    }
  }
  timelineEvents.push(...timelineForAlert)
}

alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
timelineEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

const dataDir = path.resolve(process.cwd(), 'src', 'data')
fs.writeFileSync(path.join(dataDir, 'alerts2.json'), JSON.stringify(alerts, null, 2))
fs.writeFileSync(path.join(dataDir, 'timeline2.json'), JSON.stringify(timelineEvents, null, 2))

console.log(`✅ Generated ${alerts.length} alerts and ${timelineEvents.length} timeline events.`)
console.log('Data written to src/data/alerts.json and src/data/timeline.json')