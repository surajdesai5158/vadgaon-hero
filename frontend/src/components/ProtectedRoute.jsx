
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();

  let token = null;
  let user = null;

  try {
    token = localStorage.getItem('vh_token');
    user = JSON.parse(localStorage.getItem('vh_user') || 'null');
  } catch {
    token = null;
    user = null;
  }

  // No valid local login information: send the visitor to login
  if (!token || !user || !user.role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Check whether this account is allowed to enter the requested panel
  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  // Prevent pending or rejected accounts from entering the user panel
  if (user.status !== 'approved') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
