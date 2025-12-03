import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout/Layout'
import Overview from '@/pages/Overview'
import ComingSoon from '@/pages/ComingSoon'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="budget" element={<ComingSoon />} />
          <Route path="inventory" element={<ComingSoon />} />
          <Route path="donors" element={<ComingSoon />} />
          <Route path="grants" element={<ComingSoon />} />
          <Route path="leads" element={<ComingSoon />} />
          <Route path="automations" element={<ComingSoon />} />
          <Route path="calendar" element={<ComingSoon />} />
          <Route path="mail" element={<ComingSoon />} />
          <Route path="crm" element={<ComingSoon />} />
          <Route path="settings" element={<ComingSoon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
