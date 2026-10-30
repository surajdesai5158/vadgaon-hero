
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import GuestLayout from './components/guestlayout/GuestLayout';
import Home from './components/guestlayout/Home';
import Register from './components/guestlayout/Register';
import Login from './components/guestlayout/Login';
import Contact from './components/guestlayout/Contact';

import AdminLayout from './components/adminlayout/AdminLayout';
import AdminDashboard from './components/adminlayout/AdminDashboard';
import ManageUsers from './components/adminlayout/ManageUsers';
import AdminContacts from './components/adminlayout/AdminContacts';
import DiwaliFunction from './components/adminlayout/DiwaliFunction';
import AdminVPL from './components/adminlayout/AdminVPL';
import AdminCricket from './components/adminlayout/AdminCricket';
import AdminVillageImprovement from './components/adminlayout/AdminVillageImprovement';

import UserLayout from './components/userlayout/UserLayout';
import UserDashboard from './components/userlayout/UserDashboard';
import UserProfile from './components/userlayout/UserProfile';
import UserContact from './components/userlayout/UserContact';
import UserDiwaliMemories from './components/userlayout/UserDiwaliMemories';
import UserCricketMemories from './components/userlayout/UserCricketMemories';
import UserVillageImprovement from './components/userlayout/UserVillageImprovement';
import VPLForm from './components/userlayout/VPLForm';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Guest pages */}
      <Route path="/" element={<GuestLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Approved user pages */}
      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="contact" element={<UserContact />} />
          <Route path="diwali" element={<UserDiwaliMemories />} />
          <Route path="vpl" element={<VPLForm />} />
          <Route path="cricket" element={<UserCricketMemories />} />
          <Route
            path="village-improvement"
            element={<UserVillageImprovement />}
          />
        </Route>
      </Route>

      {/* Approved admin pages */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="diwali" element={<DiwaliFunction />} />
          <Route path="vpl" element={<AdminVPL />} />
          <Route path="cricket" element={<AdminCricket />} />
          <Route
            path="village-improvement"
            element={<AdminVillageImprovement />}
          />
        </Route>
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
