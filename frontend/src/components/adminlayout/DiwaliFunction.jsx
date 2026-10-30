
import React, { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api';

export default function DiwaliFunction() {
  const [memories, setMemories] = useState([]);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const loadMemories = async () => {
    try {
      setFetching(true);
      setError('');

      const response = await api.get('/admin/diwali');
      setMemories(
        Array.isArray(response.data.memories)
          ? response.data.memories
          : []
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const handleFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const allowedTypes = ['image/', 'video/'];
    const maxFileSize = 100 * 1024 * 1024;

    const invalidFile = selectedFiles.find((file) => {
      const allowed = allowedTypes.some((type) =>
        file.type.startsWith(type)
      );

      return !allowed || file.size > maxFileSize;
    });

    if (invalidFile) {
      setError(
        'Choose image or video files only. Each file must be 100 MB or smaller.'
      );
      setFiles([]);
      event.target.value = '';
      return;
    }

    setError('');
    setFiles(selectedFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const numericYear = Number(year);

    if (
      !Number.isInteger(numericYear) ||
      numericYear < 1900 ||
      numericYear > 2100
    ) {
      setError('Please enter a valid celebration year.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for the memories.');
      return;
    }

    if (!files.length) {
      setError('Please select at least one photo or video.');
      return;
    }

    const formData = new FormData();
    formData.append('year', String(numericYear));
    formData.append('title', title.trim());
    formData.append('description', description.trim());

    files.forEach((file) => {
      formData.append('media', file);
    });

    try {
      setLoading(true);

      await api.post('/admin/diwali', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Diwali memories added successfully!');
      setTitle('');
      setDescription('');
      setFiles([]);
      setYear(String(new Date().getFullYear()));

      const fileInput = document.getElementById('diwali-media-files');
      if (fileInput) fileInput.value = '';

      await loadMemories();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memoryId) => {
    const confirmed = window.confirm(
      'Delete this Diwali year and all its memories? This action cannot be undone.'
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');
    setDeleteId(memoryId);

    try {
      await api.delete(`/admin/diwali/${memoryId}`);

      setMemories((previous) =>
        previous.filter((memory) => memory._id !== memoryId)
      );

      setSuccess('Diwali memories deleted successfully.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleteId(null);
    }
  };

  const getMediaUrl = (item) => {
    if (item.url) return item.url;
    if (item.path) return item.path;
    if (item.filename) return `/uploads/diwali/${item.filename}`;
    return '';
  };

  return (
    <>
      <style>{`
        .vh-diwali-admin {
          min-height: 75vh;
          padding: 30px 22px 50px;
          background: #f4f7fa;
          color: #17212b;
          font-family: Arial, sans-serif;
        }

        .vh-diwali-admin-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .vh-diwali-admin-header {
          padding: 30px;
          margin-bottom: 25px;
          border-radius: 16px;
          background: linear-gradient(120deg, #101820, #34304b);
          color: #fff;
        }

        .vh-diwali-admin-header h1 {
          margin: 0 0 10px;
          color: #ffc857;
          font-size: 30px;
        }

        .vh-diwali-admin-header p {
          margin: 0;
          color: #e1e5eb;
          line-height: 1.7;
          font-size: 14px;
        }

        .vh-diwali-admin-form {
          padding: 26px;
          margin-bottom: 35px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(0,0,0,.04);
        }

        .vh-diwali-admin-form h2,
        .vh-diwali-admin-gallery h2 {
          margin: 0 0 20px;
          font-size: 22px;
        }

        .vh-diwali-admin-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .vh-diwali-admin-field {
          min-width: 0;
          margin-bottom: 18px;
        }

        .vh-diwali-admin-field-full {
          grid-column: 1 / -1;
        }

        .vh-diwali-admin-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .vh-diwali-admin-field input,
        .vh-diwali-admin-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 13px;
          border: 1px solid #d5dde6;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
          font-size: 14px;
        }

        .vh-diwali-admin-field input:focus,
        .vh-diwali-admin-field textarea:focus {
          border-color: #bd8718;
          box-shadow: 0 0 0 3px rgba(255,200,87,.2);
        }

        .vh-diwali-admin-field textarea {
          min-height: 95px;
          resize: vertical;
        }

        .vh-diwali-admin-field input[type="file"] {
          background: #f9fafb;
        }

        .vh-diwali-admin-help {
          display: block;
          margin-top: 8px;
          color: #647180;
          font-size: 12px;
          line-height: 1.6;
        }

        .vh-diwali-admin-selected {
          margin-top: 10px;
          color: #245c38;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .vh-diwali-admin-submit {
          padding: 13px 20px;
          border: none;
          border-radius: 8px;
          background: #ffc857;
          color: #101820;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .vh-diwali-admin-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .vh-diwali-admin-alert {
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .vh-diwali-admin-error {
          background: #fee2e2;
          color: #991b1b;
        }

        .vh-diwali-admin-success {
          background: #dcfce7;
          color: #166534;
        }

        .vh-diwali-admin-gallery-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .vh-diwali-admin-gallery-heading h2 {
          margin: 0;
        }

        .vh-diwali-admin-count {
          color: #647180;
          font-size: 13px;
        }

        .vh-diwali-admin-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .vh-diwali-admin-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          background: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,.04);
        }

        .vh-diwali-admin-media {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 3px;
          background: #e8edf2;
        }

        .vh-diwali-admin-media img,
        .vh-diwali-admin-media video {
          display: block;
          width: 100%;
          height: 145px;
          object-fit: cover;
          background: #101820;
        }

        .vh-diwali-admin-media-empty {
          grid-column: 1 / -1;
          display: grid;
          place-items: center;
          min-height: 130px;
          color: #647180;
          font-size: 13px;
        }

        .vh-diwali-admin-card-content {
          padding: 18px;
        }

        .vh-diwali-admin-card-content h3 {
          margin: 0 0 8px;
          font-size: 18px;
          overflow-wrap: anywhere;
        }

        .vh-diwali-admin-year {
          display: inline-block;
          margin-bottom: 10px;
          padding: 5px 9px;
          border-radius: 20px;
          background: #fff2cc;
          color: #825b0a;
          font-size: 12px;
          font-weight: 700;
        }

        .vh-diwali-admin-description {
          margin: 0 0 16px;
          color: #647180;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .vh-diwali-admin-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid #edf0f3;
        }

        .vh-diwali-admin-media-count {
          color: #647180;
          font-size: 12px;
        }

        .vh-diwali-admin-delete {
          padding: 9px 12px;
          border: none;
          border-radius: 7px;
          background: #fee2e2;
          color: #991b1b;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .vh-diwali-admin-delete:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .vh-diwali-admin-empty {
          padding: 35px 20px;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          background: #fff;
          text-align: center;
          color: #647180;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .vh-diwali-admin-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .vh-diwali-admin {
            padding: 22px 13px 35px;
          }

          .vh-diwali-admin-header,
          .vh-diwali-admin-form {
            padding: 21px 17px;
          }

          .vh-diwali-admin-header h1 {
            font-size: 25px;
          }

          .vh-diwali-admin-fields,
          .vh-diwali-admin-grid {
            grid-template-columns: 1fr;
          }

          .vh-diwali-admin-field-full {
            grid-column: auto;
          }

          .vh-diwali-admin-media img,
          .vh-diwali-admin-media video {
            height: 180px;
          }
        }
      `}</style>

      <div className="vh-diwali-admin">
        <div className="vh-diwali-admin-container">
          <header className="vh-diwali-admin-header">
            <h1>🪔 Diwali Function Memories</h1>
            <p>
              Preserve every year's village Diwali celebration.
              Add photos, videos, and special moments for everyone
              in the community to remember.
            </p>
          </header>

          <section className="vh-diwali-admin-form">
            <h2>Add Diwali Memories</h2>

            {error && (
              <div className="vh-diwali-admin-alert vh-diwali-admin-error"
                role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="vh-diwali-admin-alert vh-diwali-admin-success"
                role="status">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="vh-diwali-admin-fields">
                <div className="vh-diwali-admin-field">
                  <label htmlFor="diwali-year">Celebration Year *</label>
                  <input
                    id="diwali-year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    required
                  />
                </div>

                <div className="vh-diwali-admin-field">
                  <label htmlFor="diwali-title">Memory Title *</label>
                  <input
                    id="diwali-title"
                    type="text"
                    placeholder="Example: Diwali Night Celebration"
                    maxLength={150}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                  />
                </div>

                <div className="vh-diwali-admin-field vh-diwali-admin-field-full">
                  <label htmlFor="diwali-description">
                    Description
                  </label>
                  <textarea
                    id="diwali-description"
                    placeholder="Describe the celebration, activities, and special moments..."
                    maxLength={3000}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                <div className="vh-diwali-admin-field vh-diwali-admin-field-full">
                  <label htmlFor="diwali-media-files">
                    Upload Photos and Videos *
                  </label>
                  <input
                    id="diwali-media-files"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFilesChange}
                    required
                  />
                  <span className="vh-diwali-admin-help">
                    Select multiple photos and videos. Each file must
                    be 100 MB or smaller. The backend must enforce its
                    own file type and size limits.
                  </span>

                  {files.length > 0 && (
                    <div className="vh-diwali-admin-selected">
                      {files.length} file(s) selected: {' '}
                      {files.map((file) => file.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="vh-diwali-admin-submit"
                disabled={loading}
              >
                {loading ? 'Uploading Memories...' : '＋ Add Memories'}
              </button>
            </form>
          </section>

          <section className="vh-diwali-admin-gallery">
            <div className="vh-diwali-admin-gallery-heading">
              <h2>Saved Celebrations</h2>
              <span className="vh-diwali-admin-count">
                {memories.length} year record(s)
              </span>
            </div>

            {fetching ? (
              <div className="vh-diwali-admin-empty">
                Loading Diwali memories...
              </div>
            ) : memories.length === 0 ? (
              <div className="vh-diwali-admin-empty">
                <h3>No Diwali memories yet</h3>
                Add your first celebration year using the form above.
              </div>
            ) : (
              <div className="vh-diwali-admin-grid">
                {memories.map((memory) => {
                  const media = Array.isArray(memory.media)
                    ? memory.media
                    : [];

                  return (
                    <article
                      className="vh-diwali-admin-card"
                      key={memory._id}
                    >
                      <div className="vh-diwali-admin-media">
                        {media.length === 0 ? (
                          <div className="vh-diwali-admin-media-empty">
                            No media available
                          </div>
                        ) : (
                          media.slice(0, 4).map((item, index) => {
                            const url = getMediaUrl(item);
                            const isVideo =
                              item.type === 'video' ||
                              item.mimetype?.startsWith('video/') ||
                              item.url?.match(/\.(mp4|webm|ogg)(\?|$)/i);

                            return url ? (
                              isVideo ? (
                                <video
                                  key={item._id || url || index}
                                  src={url}
                                  controls
                                  preload="metadata"
                                />
                              ) : (
                                <img
                                  key={item._id || url || index}
                                  src={url}
                                  alt={`${memory.title || 'Diwali'} memory`}
                                  loading="lazy"
                                />
                              )
                            ) : null;
                          })
                        )}
                      </div>

                      <div className="vh-diwali-admin-card-content">
                        <span className="vh-diwali-admin-year">
                          Diwali {memory.year}
                        </span>

                        <h3>{memory.title}</h3>

                        {memory.description && (
                          <p className="vh-diwali-admin-description">
                            {memory.description}
                          </p>
                        )}

                        <div className="vh-diwali-admin-card-bottom">
                          <span className="vh-diwali-admin-media-count">
                            {media.length} photo/video item(s)
                          </span>

                          <button
                            type="button"
                            className="vh-diwali-admin-delete"
                            disabled={deleteId === memory._id}
                            onClick={() => handleDelete(memory._id)}
                          >
                            {deleteId === memory._id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
