import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import AppLayout from './pages/AppLayout';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Connections from './pages/Connections';
import Networking from './pages/Networking';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import Organizer from './pages/Organizer';
import Settings from './pages/Settings';
import { useStore } from './store';
import { ToastContainer } from './components/ui';

export default function App() {
  const { toasts, removeToast } = useStore();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/recommendations/:id" element={<Recommendations />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/networking" element={<Networking />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/organizer" element={<Organizer />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </BrowserRouter>
  );
}
