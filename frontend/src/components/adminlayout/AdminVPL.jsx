
import React, { useEffect, useState, useRef } from 'react';
import api, { getErrorMessage } from '../../api';

function AdminVPL() {
  const [registrations, setRegistrations] = useState([]);
  const [qrCode, setQrCode] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const getMediaUrl = (url) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `http://localhost:7000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [registrationResponse, qrResponse] = await Promise.all([
        api.get('/vpl/admin/registrations'),
        api.get('/vpl/admin/payment-qr')
      ]);

      setRegistrations(registrationResponse.data.registrations || []);
      setQrCode(qrResponse.data.qrCode?.imageUrl || '');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setMessage('');
    setError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Choose a JPG, PNG, or WEBP QR code image.');
      event.target.value = '';
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('The QR code image must be 5 MB or smaller.');
      event.target.value = '';
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    // Read the selected file directly from the file input.
    const file = fileInputRef.current?.files?.[0] || selectedFile;

    if (!file) {
      setError('Please select a QR code image first.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Choose a JPG, PNG, or WEBP QR code image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('The QR code image must be 5 MB or smaller.');
      return;
    }

    const formData = new FormData();
    formData.append('qrCode', file);

    setUploading(true);

    try {
      const response = await api.post(
        '/vpl/admin/payment-qr',
        formData
      );

      setQrCode(response.data.qrCode?.imageUrl || '');
      setSelectedFile(null);
      setMessage(
        response.data.message || 'Payment QR code saved successfully.'
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handlePaymentStatus = async (registrationId, paymentStatus) => {
    setError('');
    setMessage('');
    setUpdatingId(registrationId);

    try {
      const response = await api.patch(
        `/vpl/admin/registrations/${registrationId}/payment`,
        { paymentStatus }
      );

      setRegistrations((previous) =>
        previous.map((registration) =>
          registration._id === registrationId
            ? { ...registration, paymentStatus: response.data.registration.paymentStatus }
            : registration
        )
      );

      setMessage('Payment status updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId('');
    }
  };

  const handleDeleteRegistration = async (registration) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the VPL registration for ${registration.name}?\n\nThis will delete only this VPL form entry. The user's login account will NOT be deleted. This action cannot be undone.`
    );

    if (!confirmed) return;

    setError('');
    setMessage('');
    setDeletingId(registration._id);

    try {
      const response = await api.delete(
        `/vpl/admin/registrations/${registration._id}`
      );

      setRegistrations((previous) =>
        previous.filter((item) => item._id !== registration._id)
      );

      setMessage(
        response.data.message || `VPL registration for ${registration.name} deleted successfully.`
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId('');
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const exportCSV = () => {
    if (!registrations.length) {
      setError('There are no registrations to export.');
      return;
    }

    const headers = [
      'Player Name',
      'Email',
      'Age',
      'Playing Position',
      'Payment Method',
      'Payment Status',
      'Registration Status',
      'Registration Date'
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = registrations.map((item) => [
      item.name,
      item.email,
      item.age,
      item.position,
      item.paymentMethod,
      item.paymentStatus,
      item.registrationStatus,
      formatDate(item.createdAt)
    ]);

    const csv = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(','))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'VPL_Player_Registrations.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const paidCount = registrations.filter(
    (item) => item.paymentStatus === 'Paid'
  ).length;

  const pendingCount = registrations.filter(
    (item) => item.paymentStatus !== 'Paid'
  ).length;

  return (
    <div className="admin-vpl-page">
      <style>{`
        .admin-vpl-page {
          min-height: 85vh;
          padding: 30px 20px 55px;
          background: #f3f6fb;
          color: #1e293b;
          font-family: Arial, sans-serif;
        }

        .admin-vpl-container {
          max-width: 1400px;
          margin: auto;
        }

        .admin-vpl-header {
          padding: 28px;
          border-radius: 15px;
          background: linear-gradient(120deg, #102746, #1d4ed8);
          color: white;
          box-shadow: 0 8px 24px rgba(16, 39, 70, 0.16);
        }

        .admin-vpl-header h1 {
          margin: 0 0 10px;
          font-size: clamp(26px, 4vw, 36px);
        }

        .admin-vpl-header p {
          margin: 0;
          line-height: 1.6;
          color: #dbeafe;
        }

        .admin-vpl-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin: 22px 0;
        }

        .admin-vpl-stat {
          padding: 22px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
        }

        .admin-vpl-stat span {
          display: block;
          color: #64748b;
          font-size: 14px;
        }

        .admin-vpl-stat strong {
          display: block;
          margin-top: 9px;
          color: #173b70;
          font-size: 30px;
        }

        .admin-vpl-card {
          margin-bottom: 24px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: white;
          box-shadow: 0 5px 18px rgba(15, 23, 42, 0.05);
        }

        .admin-vpl-card h2 {
          margin: 0 0 8px;
          color: #173b70;
          font-size: 23px;
        }

        .admin-vpl-subtitle {
          margin: 0 0 20px;
          color: #64748b;
          line-height: 1.6;
        }

        .admin-vpl-upload-form {
          display: flex;
          align-items: end;
          flex-wrap: wrap;
          gap: 15px;
        }

        .admin-vpl-file-field {
          flex: 1;
          min-width: 220px;
        }

        .admin-vpl-file-field label {
          display: block;
          margin-bottom: 9px;
          font-size: 14px;
          font-weight: 700;
        }

        .admin-vpl-file-field input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #fff;
        }

        .admin-vpl-button {
          padding: 12px 17px;
          border: none;
          border-radius: 8px;
          background: #173b70;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .admin-vpl-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .admin-vpl-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-vpl-button.export {
          background: #166534;
        }

        .admin-vpl-button.delete {
          padding: 8px 11px;
          background: #b91c1c;
          white-space: nowrap;
        }

        .admin-vpl-button.delete:hover:not(:disabled) {
          background: #991b1b;
        }

        .admin-vpl-button.export:hover:not(:disabled) {
          background: #15803d;
        }

        .admin-vpl-qr-preview {
          margin-top: 22px;
          padding: 20px;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          background: #f8fafc;
          text-align: center;
        }

        .admin-vpl-qr-preview h3 {
          margin: 0 0 12px;
          color: #173b70;
        }

        .admin-vpl-qr-preview img {
          display: block;
          width: 220px;
          max-width: 100%;
          max-height: 280px;
          object-fit: contain;
          margin: 0 auto;
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
        }

        .admin-vpl-alert {
          margin-bottom: 18px;
          padding: 13px 15px;
          border-radius: 8px;
          line-height: 1.5;
        }

        .admin-vpl-alert.error {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
        }

        .admin-vpl-alert.success {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #166534;
        }

        .admin-vpl-table-wrapper {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .admin-vpl-table {
          width: 100%;
          min-width: 1050px;
          border-collapse: collapse;
          background: white;
        }

        .admin-vpl-table th,
        .admin-vpl-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
          font-size: 13px;
          vertical-align: middle;
        }

        .admin-vpl-table th {
          background: #edf2fa;
          color: #173b70;
          font-weight: 700;
          white-space: nowrap;
        }

        .admin-vpl-table tbody tr:hover {
          background: #f8fafc;
        }

        .admin-vpl-badge {
          display: inline-block;
          padding: 6px 9px;
          border-radius: 20px;
          background: #fef3c7;
          color: #92400e;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .admin-vpl-badge.paid {
          background: #dcfce7;
          color: #166534;
        }

        .admin-vpl-status-select {
          max-width: 120px;
          padding: 8px;
          border: 1px solid #cbd5e1;
          border-radius: 7px;
          background: white;
        }

        .admin-vpl-empty {
          padding: 35px 15px;
          color: #64748b;
          text-align: center;
          line-height: 1.6;
        }

        .admin-vpl-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 18px;
        }

        @media (max-width: 700px) {
          .admin-vpl-page {
            padding: 18px 10px 35px;
          }

          .admin-vpl-header,
          .admin-vpl-card {
            padding: 18px;
          }

          .admin-vpl-stats {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .admin-vpl-stat {
            padding: 16px;
          }

          .admin-vpl-stat strong {
            font-size: 25px;
          }

          .admin-vpl-upload-form {
            align-items: stretch;
            flex-direction: column;
          }

          .admin-vpl-file-field {
            min-width: 0;
          }

          .admin-vpl-upload-form .admin-vpl-button {
            width: 100%;
          }

          .admin-vpl-toolbar {
            align-items: stretch;
            flex-direction: column;
          }
        }
      `}</style>

      <main className="admin-vpl-container">
        <header className="admin-vpl-header">
          <h1>🏏 VPL Management</h1>
          <p>
            VADGAON HERO'S — Manage player registrations and online payment QR.
          </p>
        </header>

        <div className="admin-vpl-stats">
          <div className="admin-vpl-stat">
            <span>Total Registrations</span>
            <strong>{registrations.length}</strong>
          </div>

          <div className="admin-vpl-stat">
            <span>Payments Confirmed</span>
            <strong>{paidCount}</strong>
          </div>

          <div className="admin-vpl-stat">
            <span>Payments Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        {error && (
          <div className="admin-vpl-alert error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="admin-vpl-alert success" role="status">
            {message}
          </div>
        )}

        <section className="admin-vpl-card">
          <h2>📱 Online Payment QR Code</h2>
          <p className="admin-vpl-subtitle">
            Upload a JPG, PNG, or WEBP QR image up to 5 MB. Uploading a new
            image replaces the previous QR code.
          </p>

          <form className="admin-vpl-upload-form" onSubmit={handleUpload}>
            <div className="admin-vpl-file-field">
              <label htmlFor="vpl-qr-file">Choose QR Code Image</label>
              <input
                ref={fileInputRef}
                id="vpl-qr-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </div>

            <button
              className="admin-vpl-button"
              type="submit"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : qrCode ? 'Replace QR Code' : 'Upload QR Code'}
            </button>
          </form>

          {qrCode && (
            <div className="admin-vpl-qr-preview">
              <h3>Current Payment QR Code</h3>
              <img
                src={getMediaUrl(qrCode)}
                alt="Current VPL payment QR code"
              />
            </div>
          )}

          {!qrCode && !loading && (
            <div className="admin-vpl-empty">
              No payment QR code has been uploaded yet.
            </div>
          )}
        </section>

        <section className="admin-vpl-card">
          <div className="admin-vpl-toolbar">
            <div>
              <h2>👥 Registered Players</h2>
              <p className="admin-vpl-subtitle">
                Review player details and update payment status after verifying payment.
              </p>
            </div>

            <button
              type="button"
              className="admin-vpl-button export"
              onClick={exportCSV}
              disabled={!registrations.length}
            >
              ⬇ Export Excel-Compatible CSV
            </button>
          </div>

          {loading ? (
            <div className="admin-vpl-empty">
              Loading VPL registrations...
            </div>
          ) : registrations.length === 0 ? (
            <div className="admin-vpl-empty">
              No player registrations have been submitted yet.
            </div>
          ) : (
            <div className="admin-vpl-table-wrapper">
              <table className="admin-vpl-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Player Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Position</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {registrations.map((registration, index) => (
                    <tr key={registration._id}>
                      <td>{index + 1}</td>
                      <td>{registration.name}</td>
                      <td>{registration.email}</td>
                      <td>{registration.age}</td>
                      <td>{registration.position}</td>
                      <td>{registration.paymentMethod}</td>
                      <td>
                        <div>
                          <span
                            className={
                              'admin-vpl-badge' +
                              (registration.paymentStatus === 'Paid' ? ' paid' : '')
                            }
                          >
                            {registration.paymentStatus || 'Pending'}
                          </span>

                          <div style={{ marginTop: 8 }}>
                            <select
                              className="admin-vpl-status-select"
                              value={registration.paymentStatus || 'Pending'}
                              disabled={updatingId === registration._id}
                              aria-label={`Payment status for ${registration.name}`}
                              onChange={(event) =>
                                handlePaymentStatus(
                                  registration._id,
                                  event.target.value
                                )
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(registration.createdAt)}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-vpl-button delete"
                          onClick={() => handleDeleteRegistration(registration)}
                          disabled={deletingId === registration._id}
                          aria-label={`Delete VPL registration for ${registration.name}`}
                        >
                          {deletingId === registration._id ? 'Deleting...' : '🗑 Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminVPL;
