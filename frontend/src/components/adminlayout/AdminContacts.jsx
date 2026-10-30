
import React, { useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../../api';

function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');

      // This endpoint must be implemented and protected by your backend.
      const response = await api.get('/admin/contacts');

      const receivedMessages = response.data.messages;

      if (!Array.isArray(receivedMessages)) {
        throw new Error(
          'The server response does not contain a messages array.'
        );
      }

      setMessages(receivedMessages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return messages.filter((item) => {
      const matchesSearch =
        !query ||
        [item.name, item.email, item.message].some((value) =>
          String(value || '').toLowerCase().includes(query)
        );

      const status = String(item.status || 'new').toLowerCase();

      const matchesStatus =
        statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  const markAsRead = async (messageId) => {
    try {
      setUpdatingId(messageId);
      setError('');
      setNotice('');

      // Requires a matching protected backend endpoint.
      await api.patch(`/admin/contacts/${messageId}/status`, {
        status: 'read'
      });

      setMessages((previous) =>
        previous.map((item) =>
          item._id === messageId ? { ...item, status: 'read' } : item
        )
      );

      setSelectedMessage((previous) =>
        previous?._id === messageId
          ? { ...previous, status: 'read' }
          : previous
      );

      setNotice('Message marked as read.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId('');
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '—';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <style>{`
        .admin-contacts-page {
          min-height: 100%;
          padding: 30px;
          box-sizing: border-box;
          background: #f4f7fb;
          color: #1f2937;
          font-family: Arial, sans-serif;
        }

        .admin-contacts-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-contacts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 25px;
        }

        .admin-contacts-header h1 {
          margin: 0 0 8px;
          color: #173b70;
          font-size: 29px;
        }

        .admin-contacts-header p {
          margin: 0;
          color: #667085;
          line-height: 1.6;
        }

        .admin-contacts-refresh {
          padding: 11px 16px;
          border: none;
          border-radius: 8px;
          background: #173b70;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        }

        .admin-contacts-refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-contacts-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 25px;
        }

        .admin-contacts-stat {
          padding: 20px;
          border: 1px solid #e4e7ec;
          border-radius: 12px;
          background: #ffffff;
        }

        .admin-contacts-stat span {
          display: block;
          margin-bottom: 10px;
          color: #667085;
          font-size: 14px;
        }

        .admin-contacts-stat strong {
          color: #173b70;
          font-size: 28px;
        }

        .admin-contacts-panel {
          padding: 24px;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 3px 12px rgba(16, 39, 70, 0.04);
        }

        .admin-contacts-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 22px;
        }

        .admin-contacts-search {
          flex: 1;
          min-width: 220px;
        }

        .admin-contacts-search input,
        .admin-contacts-filter select {
          width: 100%;
          padding: 12px;
          box-sizing: border-box;
          border: 1px solid #d0d5dd;
          border-radius: 8px;
          background: #ffffff;
          color: #344054;
          font-size: 14px;
        }

        .admin-contacts-filter {
          width: 180px;
        }

        .admin-contacts-table-wrap {
          overflow-x: auto;
        }

        .admin-contacts-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          white-space: nowrap;
        }

        .admin-contacts-table th {
          padding: 14px 12px;
          background: #f7f9fc;
          color: #475467;
          font-size: 13px;
        }

        .admin-contacts-table td {
          padding: 15px 12px;
          border-bottom: 1px solid #eaecf0;
          color: #344054;
          font-size: 14px;
        }

        .admin-contacts-table tbody tr:hover {
          background: #fafcff;
        }

        .admin-contacts-status {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .admin-contacts-status.new {
          background: #fff4d6;
          color: #854d0e;
        }

        .admin-contacts-status.read {
          background: #dcfae6;
          color: #067647;
        }

        .admin-contacts-actions {
          display: flex;
          gap: 7px;
        }

        .admin-contacts-action {
          padding: 8px 11px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .admin-contacts-view {
          background: #e8f0ff;
          color: #173b70;
        }

        .admin-contacts-mark {
          background: #067647;
          color: #ffffff;
        }

        .admin-contacts-action:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .admin-contacts-error,
        .admin-contacts-notice,
        .admin-contacts-empty {
          padding: 15px;
          margin-bottom: 18px;
          border-radius: 8px;
          line-height: 1.6;
        }

        .admin-contacts-error {
          background: #fef3f2;
          color: #b42318;
        }

        .admin-contacts-notice {
          background: #ecfdf3;
          color: #067647;
        }

        .admin-contacts-empty {
          margin: 0;
          background: #f7f9fc;
          color: #667085;
          text-align: center;
        }

        .admin-contacts-loading {
          padding: 35px;
          color: #667085;
          text-align: center;
        }

        .admin-contacts-overlay {
          position: fixed;
          inset: 0;
          z-index: 1500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(15, 23, 42, 0.65);
        }

        .admin-contacts-dialog {
          width: 100%;
          max-width: 620px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 26px;
          box-sizing: border-box;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
        }

        .admin-contacts-dialog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .admin-contacts-dialog-header h2 {
          margin: 0;
          color: #173b70;
          font-size: 22px;
        }

        .admin-contacts-close {
          padding: 7px 11px;
          border: none;
          border-radius: 6px;
          background: #eaecf0;
          color: #344054;
          font-size: 18px;
          cursor: pointer;
        }

        .admin-contacts-detail {
          margin-bottom: 18px;
          overflow-wrap: anywhere;
        }

        .admin-contacts-detail strong {
          display: block;
          margin-bottom: 6px;
          color: #475467;
          font-size: 13px;
        }

        .admin-contacts-detail p {
          margin: 0;
          color: #344054;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        @media (max-width: 750px) {
          .admin-contacts-page {
            padding: 20px 14px;
          }

          .admin-contacts-stats {
            grid-template-columns: 1fr;
          }

          .admin-contacts-panel {
            padding: 17px;
          }

          .admin-contacts-filter {
            width: 100%;
          }
        }
      `}</style>

      <main className="admin-contacts-page">
        <div className="admin-contacts-container">
          <header className="admin-contacts-header">
            <div>
              <h1>Contact Messages</h1>
              <p>
                Review and manage messages sent to VADGAON HERO'S.
              </p>
            </div>

            <button
              type="button"
              className="admin-contacts-refresh"
              onClick={loadMessages}
              disabled={loading}
            >
              {loading ? 'Loading...' : '↻ Refresh'}
            </button>
          </header>

          <section className="admin-contacts-stats">
            <div className="admin-contacts-stat">
              <span>Total Messages</span>
              <strong>{messages.length}</strong>
            </div>

            <div className="admin-contacts-stat">
              <span>New Messages</span>
              <strong>
                {messages.filter(
                  (item) => (item.status || 'new') === 'new'
                ).length}
              </strong>
            </div>

            <div className="admin-contacts-stat">
              <span>Read Messages</span>
              <strong>
                {messages.filter((item) => item.status === 'read').length}
              </strong>
            </div>
          </section>

          <section className="admin-contacts-panel">
            {error && (
              <div className="admin-contacts-error" role="alert">
                {error}
              </div>
            )}

            {notice && (
              <div className="admin-contacts-notice" role="status">
                {notice}
              </div>
            )}

            <div className="admin-contacts-controls">
              <div className="admin-contacts-search">
                <input
                  type="search"
                  placeholder="Search name, email, or message..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search contact messages"
                />
              </div>

              <div className="admin-contacts-filter">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter messages by status"
                >
                  <option value="all">All messages</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="admin-contacts-loading">
                Loading contact messages...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="admin-contacts-empty">
                {messages.length === 0
                  ? 'No messages loaded. Check the backend API and try refreshing.'
                  : 'No messages match your search or filter.'}
              </div>
            ) : (
              <div className="admin-contacts-table-wrap">
                <table className="admin-contacts-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message Preview</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMessages.map((item) => {
                      const status = String(item.status || 'new').toLowerCase();

                      return (
                        <tr key={item._id}>
                          <td>{item.name || '—'}</td>
                          <td>{item.email || '—'}</td>
                          <td>
                            {String(item.message || '').length > 45
                              ? `${String(item.message).slice(0, 45)}...`
                              : item.message || '—'}
                          </td>
                          <td>{formatDate(item.createdAt)}</td>
                          <td>
                            <span
                              className={`admin-contacts-status ${status}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td>
                            <div className="admin-contacts-actions">
                              <button
                                type="button"
                                className="admin-contacts-action admin-contacts-view"
                                onClick={() => setSelectedMessage(item)}
                              >
                                View
                              </button>

                              {status === 'new' && (
                                <button
                                  type="button"
                                  className="admin-contacts-action admin-contacts-mark"
                                  disabled={updatingId === item._id}
                                  onClick={() => markAsRead(item._id)}
                                >
                                  {updatingId === item._id
                                    ? 'Saving...'
                                    : 'Mark Read'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {selectedMessage && (
        <div
          className="admin-contacts-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <section
            className="admin-contacts-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
          >
            <div className="admin-contacts-dialog-header">
              <h2 id="contact-dialog-title">Message Details</h2>

              <button
                type="button"
                className="admin-contacts-close"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message details"
              >
                ×
              </button>
            </div>

            <div className="admin-contacts-detail">
              <strong>Sender</strong>
              <p>{selectedMessage.name || '—'}</p>
            </div>

            <div className="admin-contacts-detail">
              <strong>Email</strong>
              <p>{selectedMessage.email || '—'}</p>
            </div>

            <div className="admin-contacts-detail">
              <strong>Received</strong>
              <p>{formatDate(selectedMessage.createdAt)}</p>
            </div>

            <div className="admin-contacts-detail">
              <strong>Message</strong>
              <p>{selectedMessage.message || '—'}</p>
            </div>

            {selectedMessage.status !== 'read' && (
              <button
                type="button"
                className="admin-contacts-action admin-contacts-mark"
                disabled={updatingId === selectedMessage._id}
                onClick={() => markAsRead(selectedMessage._id)}
              >
                {updatingId === selectedMessage._id
                  ? 'Saving...'
                  : 'Mark as Read'}
              </button>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default AdminContacts;
