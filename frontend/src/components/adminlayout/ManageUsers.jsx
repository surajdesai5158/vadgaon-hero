
import React, { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/admin/users');
      const data = response.data;

      setUsers(
        Array.isArray(data) ? data :
        Array.isArray(data.users) ? data.users :
        Array.isArray(data.data) ? data.data : []
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateStatus = async (userId, status) => {
    try {
      setError('');
      setMessage('');

      await api.patch(`/admin/users/${userId}/status`, { status });

      setMessage(`User ${status} successfully.`);
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;

    const userId = selectedUser._id;

    try {
      setDeletingId(userId);
      setError('');
      setMessage('');

      const response = await api.delete(`/admin/users/${userId}`);

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user._id !== userId)
      );

      setMessage(
        response.data?.message || 'Registered user deleted successfully.'
      );
      setSelectedUser(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId('');
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return [
      user.name,
      user.fullName,
      user.email,
      user.phone,
      user.status,
    ].some((value) =>
      String(value || '').toLowerCase().includes(searchText)
    );
  });

  const getStatusColor = (status) => {
    const normalizedStatus = String(status || 'pending').toLowerCase();

    if (normalizedStatus === 'approved') return '#15803d';
    if (normalizedStatus === 'rejected') return '#b91c1c';
    return '#b45309';
  };

  return (
    <div className="manage-users-page">
      <style>{`
        .manage-users-page {
          min-height: 80vh;
          padding: 30px 20px;
          background: #f3f6fb;
          color: #172b45;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
        }

        .manage-users-container {
          max-width: 1250px;
          margin: 0 auto;
        }

        .manage-users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 22px;
        }

        .manage-users-header h1 {
          margin: 0 0 8px;
          font-size: 30px;
        }

        .manage-users-header p {
          margin: 0;
          color: #65748b;
        }

        .manage-users-count {
          padding: 12px 18px;
          border-radius: 10px;
          background: #e0eaff;
          color: #17428a;
          font-weight: 700;
        }

        .manage-users-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .manage-users-search {
          flex: 1;
          min-width: 220px;
          padding: 13px 15px;
          border: 1px solid #ccd5e2;
          border-radius: 9px;
          background: #ffffff;
          font-size: 15px;
          outline: none;
        }

        .manage-users-search:focus {
          border-color: #2456a6;
          box-shadow: 0 0 0 3px rgba(36, 86, 166, 0.1);
        }

        .manage-users-refresh,
        .manage-users-action {
          padding: 10px 13px;
          border: none;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .manage-users-refresh {
          background: #173b70;
          color: white;
        }

        .manage-users-table-wrap {
          overflow-x: auto;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 5px 22px rgba(22, 42, 73, 0.07);
        }

        .manage-users-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        .manage-users-table th,
        .manage-users-table td {
          padding: 15px 14px;
          text-align: left;
          border-bottom: 1px solid #e8edf4;
          font-size: 14px;
        }

        .manage-users-table th {
          background: #173b70;
          color: white;
          font-size: 13px;
          white-space: nowrap;
        }

        .manage-users-table tbody tr:hover {
          background: #f8faff;
        }

        .manage-users-status {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 20px;
          background: #f1f5f9;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .manage-users-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .manage-users-approve {
          background: #dcfce7;
          color: #166534;
        }

        .manage-users-reject {
          background: #fee2e2;
          color: #991b1b;
        }

        .manage-users-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .manage-users-delete {
          background: #b91c1c;
          color: #ffffff;
        }

        .manage-users-delete:hover {
          background: #991b1b;
        }

        .manage-users-action:disabled,
        .manage-users-refresh:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .manage-users-notice {
          margin: 0 0 18px;
          padding: 13px 15px;
          border-radius: 8px;
          line-height: 1.5;
        }

        .manage-users-error {
          background: #fee2e2;
          color: #991b1b;
        }

        .manage-users-success {
          background: #dcfce7;
          color: #166534;
        }

        .manage-users-empty {
          padding: 35px;
          text-align: center;
          color: #65748b;
        }

        .manage-users-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(9, 20, 38, 0.65);
        }

        .manage-users-modal {
          width: 100%;
          max-width: 440px;
          padding: 27px;
          border-radius: 14px;
          background: white;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          box-sizing: border-box;
        }

        .manage-users-modal h2 {
          margin: 0 0 12px;
          color: #991b1b;
        }

        .manage-users-modal p {
          color: #526174;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .manage-users-modal-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .manage-users-cancel {
          padding: 11px 16px;
          border: none;
          border-radius: 7px;
          background: #e8edf3;
          color: #172b45;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          .manage-users-page {
            padding: 22px 12px;
          }

          .manage-users-header h1 {
            font-size: 25px;
          }

          .manage-users-toolbar {
            flex-direction: column;
          }

          .manage-users-search,
          .manage-users-refresh {
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>

      <div className="manage-users-container">
        <div className="manage-users-header">
          <div>
            <h1>Manage Registered Users</h1>
            <p>View, search, approve, reject, or delete user accounts.</p>
          </div>

          <div className="manage-users-count">
            Total Users: {users.length}
          </div>
        </div>

        {error && (
          <div className="manage-users-notice manage-users-error">
            {error}
          </div>
        )}

        {message && (
          <div className="manage-users-notice manage-users-success">
            {message}
          </div>
        )}

        <div className="manage-users-toolbar">
          <input
            className="manage-users-search"
            type="search"
            placeholder="Search by name, email, phone, or status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <button
            className="manage-users-refresh"
            type="button"
            onClick={loadUsers}
            disabled={loading}
          >
            {loading ? 'Loading...' : '↻ Refresh Users'}
          </button>
        </div>

        <div className="manage-users-table-wrap">
          {loading ? (
            <div className="manage-users-empty">Loading registered users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="manage-users-empty">
              {users.length === 0
                ? 'No registered users found.'
                : 'No users match your search.'}
            </div>
          ) : (
            <table className="manage-users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name || user.fullName || '—'}</td>
                    <td>{user.email || '—'}</td>
                    <td>{user.phone || user.mobile || '—'}</td>
                    <td>
                      <span
                        className="manage-users-status"
                        style={{
                          color: getStatusColor(user.status),
                        }}
                      >
                        {user.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <div className="manage-users-actions">
                        {String(user.status).toLowerCase() !== 'approved' && (
                          <button
                            className="manage-users-action manage-users-approve"
                            type="button"
                            onClick={() => updateStatus(user._id, 'approved')}
                          >
                            Approve
                          </button>
                        )}

                        {String(user.status).toLowerCase() !== 'rejected' && (
                          <button
                            className="manage-users-action manage-users-reject"
                            type="button"
                            onClick={() => updateStatus(user._id, 'rejected')}
                          >
                            Reject
                          </button>
                        )}

                        {String(user.status).toLowerCase() !== 'pending' && (
                          <button
                            className="manage-users-action manage-users-pending"
                            type="button"
                            onClick={() => updateStatus(user._id, 'pending')}
                          >
                            Set Pending
                          </button>
                        )}

                        <button
                          className="manage-users-action manage-users-delete"
                          type="button"
                          onClick={() => setSelectedUser(user)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedUser && (
        <div
          className="manage-users-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget && !deletingId) {
              setSelectedUser(null);
            }
          }}
        >
          <div
            className="manage-users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
          >
            <h2 id="delete-user-title">⚠️ Delete Registered User?</h2>

            <p>
              Are you sure you want to permanently delete{' '}
              <strong>
                {selectedUser.name ||
                  selectedUser.fullName ||
                  selectedUser.email}
              </strong>
              ?
            </p>

            <p>
              This action cannot be undone. The user's VPL registration
              records will also be deleted.
            </p>

            <div className="manage-users-modal-actions">
              <button
                type="button"
                className="manage-users-cancel"
                disabled={Boolean(deletingId)}
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="manage-users-action manage-users-delete"
                disabled={Boolean(deletingId)}
                onClick={deleteUser}
              >
                {deletingId ? 'Deleting...' : 'Yes, Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
