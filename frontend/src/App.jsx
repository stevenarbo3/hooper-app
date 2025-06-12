import ClerkProviderWithRoutes from './auth/ClerkProviderWithRoutes.jsx'
import { Routes, Route} from 'react-router-dom'
import {Layout} from './layout/Layout.jsx'
import { Dashboard } from './dashboard/Dashboard.jsx'
import { HistoryPanel } from './history/HistoryPanel.jsx'
import { LogStats } from './logstats/LogStats.jsx'
import { AuthenticationPage } from './auth/AuthenticationPage.jsx'
import { ComparisonGenerator } from './nbacomparison/ComparisonGenerator.jsx'
import './App.css'

function App() {
  return <ClerkProviderWithRoutes>
    <Routes>
      <Route path='/sign-in/*' element={<AuthenticationPage />} />
      <Route path='/sign-up' element={<AuthenticationPage />} />
      <Route element={<Layout />}>
          <Route path='/' element={<Dashboard />}/>
          <Route path='/history' element={<HistoryPanel />}/>
          <Route path='/logstats' element={<LogStats />}/>
          <Route path='/nbacomparison' element={<ComparisonGenerator />}/>
      </Route>
    </Routes>
  </ClerkProviderWithRoutes>
}

export default App
