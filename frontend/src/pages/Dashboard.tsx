import Layout from '../components/Layout'
import StatsCards from '../components/StatsCards'
import AlertForm from '../components/AlertForm'
import TrafficChart from '../components/TrafficChart'
import TrafficFeed from '../components/TrafficFeed'
import AlertList from '../components/AlertList'
import { useWebSocket } from '../hooks/useWebSocket'

export default function Dashboard() {
  useWebSocket()

  return (
    <Layout>
      <StatsCards />
      <AlertForm />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <TrafficChart />
        <TrafficFeed />
      </div>
      <AlertList />
    </Layout>
  )
}
