
import React, { useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../../api';

function UserVillageImprovement() {
  const [records, setRecords] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchRecords = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/village-improvements');

        if (active) {
          setRecords(
            Array.isArray(response.data.records)
              ? response.data.records
              : []
          );
        }
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchRecords();

    return () => {
      active = false;
    };
  }, []);

  const years = useMemo(
    () =>
      [...new Set(
        records
          .filter((record) => record.date)
          .map((record) => new Date(record.date).getFullYear())
      )].sort((a, b) => b - a),
    [records]
  );

  const filteredRecords = useMemo(
    () =>
      selectedYear === 'all'
        ? records
        : records.filter(
            (record) =>
              record.date &&
              String(new Date(record.date).getFullYear()) === selectedYear
          ),
    [records, selectedYear]
  );

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
    <div className="village-user-page">
      <style>{`
        .village-user-page {
          min-height: 80vh;
          padding: 38px 22px 60px;
          background: linear-gradient(135deg, #eaf3ff, #f4f7fb, #e9f5ed);
          color: #172b45;
          font-family: Arial, sans-serif;
        }

        .village-user-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .village-user-hero {
          padding: 34px 20px;
          border-radius: 22px;
          background: linear-gradient(135deg, #102746, #176b55, #d18b24);
          color: white;
          text-align: center;
          box-shadow: 0 12px 30px rgba(16, 39, 70, 0.18);
        }

        .village-user-icon {
          margin-bottom: 10px;
          font-size: 48px;
        }

        .village-user-hero h1 {
          margin: 0 0 12px;
          font-size: clamp(28px, 5vw, 43px);
          font-weight: 800;
        }

        .village-user-hero p {
          margin: 5px 0;
          font-size: 16px;
          line-height: 1.7;
        }

        .village-user-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin: 28px 0;
        }

        .village-user-toolbar h2 {
          margin: 0;
          color: #174b3b;
          font-size: 25px;
        }

        .village-user-count {
          margin-top: 8px;
          color: #526579;
          font-size: 14px;
        }

        .village-year-select {
          min-width: 180px;
          padding: 12px 14px;
          border: 1px solid #b9cbdc;
          border-radius: 10px;
          background: white;
          color: #172b45;
          font-size: 15px;
          outline-color: #176b55;
        }

        .village-card {
          margin-bottom: 30px;
          overflow: hidden;
          border: 1px solid #dce6ee;
          border-radius: 18px;
          background: white;
          box-shadow: 0 8px 24px rgba(23, 43, 69, 0.08);
        }

        .village-card-header {
          padding: 22px;
          border-bottom: 1px solid #e8eef3;
          background: #fbfdff;
        }

        .village-date-label {
          display: inline-block;
          margin-bottom: 10px;
          padding: 7px 13px;
          border-radius: 20px;
          background: #e5f3ec;
          color: #176044;
          font-size: 13px;
          font-weight: 700;
        }

        .village-card-header h3 {
          margin: 0;
          color: #173b70;
          font-size: 25px;
          overflow-wrap: anywhere;
        }

        .village-description {
          margin-top: 12px;
          color: #425466;
          font-size: 15px;
          line-height: 1.8;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .village-media-heading {
          margin: 0;
          padding: 18px 22px 14px;
          color: #173b70;
          font-size: 18px;
        }

        .village-media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
          padding: 0 18px 20px;
        }

        .village-media-item {
          overflow: hidden;
          aspect-ratio: 4 / 3;
          border-radius: 12px;
          background: #172b45;
        }

        .village-media-item a {
          display: block;
          width: 100%;
          height: 100%;
        }

        .village-media-item img,
        .village-media-item video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .village-media-item img {
          transition: transform 0.25s ease;
        }

        .village-media-item img:hover {
          transform: scale(1.04);
        }

        .village-loading,
        .village-empty,
        .village-error {
          padding: 36px 20px;
          border-radius: 15px;
          background: white;
          text-align: center;
          line-height: 1.7;
        }

        .village-empty {
          border: 1px dashed #a9c7b7;
          color: #526b5d;
        }

        .village-error {
          border: 1px solid #efb8b8;
          color: #a12626;
        }

        .village-retry {
          margin-top: 12px;
          padding: 10px 18px;
          border: 0;
          border-radius: 8px;
          background: #174b3b;
          color: white;
          cursor: pointer;
        }

        @media (max-width: 650px) {
          .village-user-page {
            padding: 20px 12px 40px;
          }

          .village-user-hero {
            padding: 27px 15px;
          }

          .village-user-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .village-year-select {
            width: 100%;
          }

          .village-card-header {
            padding: 16px;
          }

          .village-media-grid {
            grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
            gap: 9px;
            padding: 0 12px 14px;
          }

          .village-media-heading {
            padding: 0 16px 12px;
          }
        }
      `}</style>

      <div className="village-user-container">

        <header className="village-user-hero">
          <div className="village-user-icon" aria-hidden="true">
            🏡
          </div>

          <h1>VADGAON HERO'S</h1>

          <p>Village Improvement — Development & Progress</p>

          <p>
            Together for a better village. Explore our village
            development work, activities, photos and videos.
          </p>
        </header>

        <div className="village-user-toolbar">
          <div>
            <h2>Our Village Development 🏡</h2>

            <div className="village-user-count">
              {records.length}{' '}
              {records.length === 1 ? 'record' : 'records'} saved
            </div>
          </div>

          <select
            className="village-year-select"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            aria-label="Filter village improvements by year"
          >
            <option value="all">All Years</option>

            {years.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="village-loading">
            Loading village improvements... 🏡
          </div>
        )}

        {!loading && error && (
          <div className="village-error">
            <strong>Unable to load village improvements.</strong>
            <p>{error}</p>
            <button
              className="village-retry"
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredRecords.length === 0 && (
          <div className="village-empty">
            <h3>No village improvements found yet 🏡</h3>
            <p>
              Village development records will appear here after
              the admin adds them.
            </p>
          </div>
        )}

        {!loading && !error && filteredRecords.map((record) => (
          <article className="village-card" key={record._id}>

            <div className="village-card-header">
              <span className="village-date-label">
                📅 {formatDate(record.date)}
              </span>

              <h3>{record.subject}</h3>

              {record.description && (
                <p className="village-description">
                  {record.description}
                </p>
              )}
            </div>

            {(record.media || []).length > 0 && (
              <>
                <h4 className="village-media-heading">
                  Photos & Videos 📸
                </h4>

                <div className="village-media-grid">
                  {record.media.map((item, index) => {
                    const mediaUrl = getMediaUrl(item);

                    return (
                      <div
                        className="village-media-item"
                        key={item._id || item.url || index}
                      >
                        {item.type === 'video' ? (
                          <video
                            src={mediaUrl}
                            controls
                            preload="metadata"
                            aria-label={`Village improvement video ${index + 1}`}
                          />
                        ) : (
                          <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open village improvement photo ${index + 1}`}
                          >
                            <img
                              src={mediaUrl}
                              alt={`${record.subject}, ${index + 1}`}
                              loading="lazy"
                            />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </article>
        ))}

      </div>
    </div>
  );
}

export default UserVillageImprovement;
