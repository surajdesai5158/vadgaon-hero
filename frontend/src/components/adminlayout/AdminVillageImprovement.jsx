
import React, { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api';

export default function AdminVillageImprovement() {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState('');

  const loadRecords = async () => {
    try {
      setFetching(true);
      setError('');

      const response = await api.get('/village-improvements');

      setRecords(
        Array.isArray(response.data.records)
          ? response.data.records
          : []
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleMediaChange = (event) => {
    const selected = Array.from(event.target.files || []);

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ];

    setError('');
    setSuccess('');

    if (selected.length > 20) {
      setError('You can upload a maximum of 20 files.');
      setMedia([]);
      event.target.value = '';
      return;
    }

    const invalidFile = selected.find(
      (file) =>
        !allowedTypes.includes(file.type) ||
        file.size > 50 * 1024 * 1024
    );

    if (invalidFile) {
      setError(
        'Choose JPG, PNG, WEBP, GIF, MP4, WEBM or MOV files. Each file must be 50 MB or smaller.'
      );
      setMedia([]);
      event.target.value = '';
      return;
    }

    setMedia(selected);
  };

  const resetForm = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setSubject('');
    setDescription('');
    setMedia([]);

    const input = document.getElementById('village-media');
    if (input) input.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!date || !subject.trim()) {
      setError('Please enter the date and subject.');
      return;
    }

    if (subject.trim().length > 150) {
      setError('Subject cannot exceed 150 characters.');
      return;
    }

    if (description.trim().length > 3000) {
      setError('Description cannot exceed 3000 characters.');
      return;
    }

    if (!media.length) {
      setError('Please select at least one photo or video.');
      return;
    }

    const formData = new FormData();

    formData.append('date', date);
    formData.append('subject', subject.trim());
    formData.append('description', description.trim());

    media.forEach((file) => {
      formData.append('media', file);
    });

    try {
      setLoading(true);

      const response = await api.post(
        '/village-improvements',
        formData
      );

      setSuccess(
        response.data.message ||
        'Village improvement added successfully.'
      );

      resetForm();
      await loadRecords();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    const confirmed = window.confirm(
      `Delete "${record.subject}" and all its photos/videos? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');
    setDeleteId(record._id);

    try {
      const response = await api.delete(
        `/village-improvements/${record._id}`
      );

      setRecords((previous) =>
        previous.filter((item) => item._id !== record._id)
      );

      setSuccess(
        response.data.message ||
        'Village improvement deleted successfully.'
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleteId('');
    }
  };

  const getMediaUrl = (item) => {
    if (!item?.url) return '';

    if (
      item.url.startsWith('http://') ||
      item.url.startsWith('https://')
    ) {
      return item.url;
    }

    return `http://localhost:7000${item.url.startsWith('/') ? '' : '/'}${item.url}`;
  };

  const formatDate = (value) => {
    if (!value) return 'Date not available';

    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <style>{`
        .vi-admin {
          min-height: 75vh;
          padding: 30px 22px 50px;
          background: #f4f7fa;
          color: #17212b;
          font-family: Arial, sans-serif;
        }

        .vi-container {
          max-width: 1250px;
          margin: 0 auto;
        }

        .vi-header {
          padding: 30px;
          margin-bottom: 25px;
          border-radius: 16px;
          background: linear-gradient(120deg, #101820, #174b35);
          color: white;
        }

        .vi-header h1 {
          margin: 0 0 10px;
          color: #facc15;
          font-size: 30px;
        }

        .vi-header p {
          margin: 0;
          color: #e1e5eb;
          line-height: 1.7;
        }

        .vi-form, .vi-gallery {
          padding: 26px;
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: white;
          box-shadow: 0 5px 20px rgba(0,0,0,.04);
        }

        .vi-form h2, .vi-gallery h2 {
          margin: 0 0 20px;
          font-size: 22px;
        }

        .vi-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .vi-field {
          min-width: 0;
          margin-bottom: 17px;
        }

        .vi-field.full {
          grid-column: 1 / -1;
        }

        .vi-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .vi-field input,
        .vi-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 13px;
          border: 1px solid #d5dde6;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
          font-size: 14px;
        }

        .vi-field textarea {
          min-height: 110px;
          resize: vertical;
        }

        .vi-field input:focus,
        .vi-field textarea:focus {
          border-color: #16804b;
          box-shadow: 0 0 0 3px rgba(22,128,75,.12);
        }

        .vi-help {
          display: block;
          margin-top: 7px;
          color: #647180;
          font-size: 12px;
          line-height: 1.6;
        }

        .vi-submit, .vi-delete {
          padding: 12px 18px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .vi-submit {
          background: #166534;
          color: white;
        }

        .vi-delete {
          padding: 9px 12px;
          background: #fee2e2;
          color: #991b1b;
        }

        .vi-submit:disabled, .vi-delete:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .vi-alert {
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .vi-error {
          background: #fee2e2;
          color: #991b1b;
        }

        .vi-success {
          background: #dcfce7;
          color: #166534;
        }

        .vi-gallery-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .vi-gallery-heading h2 {
          margin: 0;
        }

        .vi-count {
          color: #647180;
          font-size: 13px;
        }

        .vi-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .vi-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          background: white;
        }

        .vi-media-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 3px;
          background: #e8edf2;
        }

        .vi-media-grid img,
        .vi-media-grid video {
          display: block;
          width: 100%;
          height: 150px;
          object-fit: cover;
          background: #101820;
        }

        .vi-card-content {
          padding: 18px;
        }

        .vi-date {
          display: inline-block;
          margin-bottom: 10px;
          padding: 5px 9px;
          border-radius: 20px;
          background: #dcfce7;
          color: #166534;
          font-size: 12px;
          font-weight: 700;
        }

        .vi-card-content h3 {
          margin: 0 0 12px;
          font-size: 19px;
          overflow-wrap: anywhere;
        }

        .vi-description {
          color: #475569;
          font-size: 13px;
          line-height: 1.6;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .vi-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 14px;
          margin-top: 14px;
          border-top: 1px solid #edf0f3;
        }

        .vi-empty {
          padding: 35px 20px;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          background: white;
          text-align: center;
          color: #647180;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .vi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .vi-admin {
            padding: 22px 13px 35px;
          }

          .vi-header, .vi-form, .vi-gallery {
            padding: 21px 17px;
          }

          .vi-header h1 {
            font-size: 25px;
          }

          .vi-fields, .vi-grid {
            grid-template-columns: 1fr;
          }

          .vi-field.full {
            grid-column: auto;
          }
        }
      `}</style>

      <div className="vi-admin">
        <div className="vi-container">

          <header className="vi-header">
            <h1>🏡 Village Improvement</h1>
            <p>
              VADGAON HERO'S — Share village development work,
              important activities, photos and videos.
            </p>
          </header>

          <section className="vi-form">
            <h2>＋ Add Village Improvement</h2>

            {error && (
              <div className="vi-alert vi-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="vi-alert vi-success" role="status">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="vi-fields">

                <div className="vi-field">
                  <label htmlFor="village-date">
                    Improvement Date *
                  </label>
                  <input
                    id="village-date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </div>

                <div className="vi-field">
                  <label htmlFor="village-subject">
                    Subject / Title *
                  </label>
                  <input
                    id="village-subject"
                    type="text"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Example: Village road development"
                    maxLength={150}
                    required
                  />
                </div>

                <div className="vi-field full">
                  <label htmlFor="village-description">
                    Description
                  </label>
                  <textarea
                    id="village-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Write details about the improvement work..."
                    maxLength={3000}
                  />
                </div>

                <div className="vi-field full">
                  <label htmlFor="village-media">
                    Upload Photos / Videos *
                  </label>
                  <input
                    id="village-media"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                    multiple
                    onChange={handleMediaChange}
                    required
                  />
                  <span className="vi-help">
                    Maximum 20 files. JPG, PNG, WEBP, GIF, MP4,
                    WEBM and MOV are supported. Each file must
                    be 50 MB or smaller.
                  </span>

                  {media.length > 0 && (
                    <div className="vi-help">
                      {media.length} file(s) selected:
                      {' '}
                      {media.map((file) => file.name).join(', ')}
                    </div>
                  )}
                </div>

              </div>

              <button
                type="submit"
                className="vi-submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : '＋ Save Village Improvement'}
              </button>
            </form>
          </section>

          <section className="vi-gallery">
            <div className="vi-gallery-heading">
              <h2>Saved Village Improvements</h2>
              <span className="vi-count">
                {records.length} record(s)
              </span>
            </div>

            {fetching ? (
              <div className="vi-empty">
                Loading village improvements...
              </div>
            ) : records.length === 0 ? (
              <div className="vi-empty">
                <h3>No Village Improvements Yet</h3>
                Add your first village improvement using the form above.
              </div>
            ) : (
              <div className="vi-grid">
                {records.map((record) => (
                  <article className="vi-card" key={record._id}>

                    <div className="vi-media-grid">
                      {(record.media || []).slice(0, 4).map((item, index) => (
                        item.type === 'video' ? (
                          <video
                            key={item._id || item.url || index}
                            src={getMediaUrl(item)}
                            controls
                            preload="metadata"
                          />
                        ) : (
                          <img
                            key={item._id || item.url || index}
                            src={getMediaUrl(item)}
                            alt={`${record.subject} ${index + 1}`}
                            loading="lazy"
                          />
                        )
                      ))}
                    </div>

                    <div className="vi-card-content">
                      <span className="vi-date">
                        📅 {formatDate(record.date)}
                      </span>

                      <h3>{record.subject}</h3>

                      {record.description && (
                        <p className="vi-description">
                          {record.description}
                        </p>
                      )}

                      <div className="vi-card-bottom">
                        <span className="vi-count">
                          {record.media?.length || 0} file(s)
                        </span>

                        <button
                          type="button"
                          className="vi-delete"
                          disabled={deleteId === record._id}
                          onClick={() => handleDelete(record)}
                        >
                          {deleteId === record._id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>

                  </article>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </>
  );
}
