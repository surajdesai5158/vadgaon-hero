
import React, { useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../../api';

function UserDiwaliMemories() {
  const [memories, setMemories] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchMemories = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/diwali');

        if (active) {
          setMemories(response.data.memories || []);
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

    fetchMemories();

    return () => {
      active = false;
    };
  }, []);

  const years = useMemo(
    () => [...new Set(memories.map((memory) => memory.year))]
      .sort((a, b) => b - a),
    [memories]
  );

  const filteredMemories = useMemo(
    () =>
      selectedYear === 'all'
        ? memories
        : memories.filter(
            (memory) => String(memory.year) === selectedYear
          ),
    [memories, selectedYear]
  );

  const getMediaUrl = (url) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `http://localhost:7000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="diwali-page">
      <style>{`
        .diwali-page {
          min-height: 80vh;
          padding: 38px 22px 60px;
          background: linear-gradient(135deg, #fff7e6, #fff0f0, #fff9e8);
          color: #34251d;
          font-family: Arial, sans-serif;
        }

        .diwali-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .diwali-hero {
          text-align: center;
          padding: 34px 20px;
          border-radius: 22px;
          background: linear-gradient(135deg, #8d240e, #d65a16, #f5a623);
          color: white;
          box-shadow: 0 12px 30px rgba(112, 39, 12, 0.18);
        }

        .diwali-hero .diya {
          font-size: 42px;
          margin-bottom: 10px;
        }

        .diwali-hero h1 {
          margin: 0 0 12px;
          font-size: clamp(28px, 5vw, 43px);
          font-weight: 800;
        }

        .diwali-hero p {
          margin: 0;
          line-height: 1.7;
          font-size: 16px;
        }

        .diwali-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin: 28px 0;
        }

        .diwali-toolbar h2 {
          margin: 0;
          color: #79280f;
          font-size: 25px;
        }

        .diwali-year-select {
          min-width: 180px;
          padding: 12px 14px;
          border: 1px solid #e5b28b;
          border-radius: 10px;
          background: white;
          color: #492719;
          font-size: 15px;
          outline-color: #c34c19;
        }

        .diwali-memory {
          margin-bottom: 32px;
          overflow: hidden;
          border-radius: 18px;
          background: white;
          border: 1px solid #f0dfcf;
          box-shadow: 0 8px 24px rgba(70, 35, 17, 0.08);
        }

        .diwali-memory-header {
          padding: 20px 22px;
          border-bottom: 1px solid #f3e4d8;
        }

        .diwali-memory-header h3 {
          margin: 0 0 8px;
          color: #8b2e10;
          font-size: 23px;
          overflow-wrap: anywhere;
        }

        .diwali-memory-header p {
          margin: 0;
          line-height: 1.7;
          color: #66554a;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .diwali-memory-year {
          display: inline-block;
          margin-bottom: 10px;
          padding: 6px 12px;
          border-radius: 20px;
          background: #fff0d5;
          color: #8b390c;
          font-size: 13px;
          font-weight: 700;
        }

        .diwali-media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 14px;
          padding: 18px;
        }

        .diwali-media-item {
          overflow: hidden;
          border-radius: 12px;
          background: #251b16;
          aspect-ratio: 4 / 3;
        }

        .diwali-media-item img,
        .diwali-media-item video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #251b16;
        }

        .diwali-media-item img {
          cursor: zoom-in;
        }

        .diwali-loading,
        .diwali-empty,
        .diwali-error {
          padding: 36px 20px;
          text-align: center;
          border-radius: 15px;
          background: white;
          line-height: 1.7;
        }

        .diwali-empty {
          border: 1px dashed #dfa77c;
          color: #76513b;
        }

        .diwali-error {
          color: #a12626;
          border: 1px solid #efb8b8;
        }

        .diwali-retry {
          margin-top: 12px;
          padding: 10px 18px;
          border: 0;
          border-radius: 8px;
          background: #9b3211;
          color: white;
          cursor: pointer;
        }

        .diwali-count {
          margin-top: 8px;
          color: #76513b;
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .diwali-page {
            padding: 20px 12px 40px;
          }

          .diwali-hero {
            padding: 27px 15px;
          }

          .diwali-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .diwali-year-select {
            width: 100%;
          }

          .diwali-media-grid {
            grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
            gap: 9px;
            padding: 12px;
          }

          .diwali-memory-header {
            padding: 16px;
          }
        }
      `}</style>

      <div className="diwali-container">
        <header className="diwali-hero">
          <div className="diya" aria-hidden="true">🪔</div>
          <h1>VADGAON HERO'S</h1>
          <p>Diwali Memories — Celebrations, Traditions & Togetherness</p>
          <p>Relive the beautiful moments of our village every year.</p>
        </header>

        <div className="diwali-toolbar">
          <div>
            <h2>Our Diwali Memories 📸</h2>
            <div className="diwali-count">
              {memories.length} {memories.length === 1 ? 'memory' : 'memories'} saved
            </div>
          </div>

          <select
            className="diwali-year-select"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            aria-label="Filter memories by year"
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
          <div className="diwali-loading">
            Loading Diwali memories... 🪔
          </div>
        )}

        {!loading && error && (
          <div className="diwali-error">
            <strong>Unable to load memories.</strong>
            <p>{error}</p>
            <button
              className="diwali-retry"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredMemories.length === 0 && (
          <div className="diwali-empty">
            <h3>No Diwali memories found yet 🪔</h3>
            <p>
              Memories will appear here after the admin adds celebration
              photos and videos.
            </p>
          </div>
        )}

        {!loading && !error && filteredMemories.map((memory) => (
          <article className="diwali-memory" key={memory._id}>
            <div className="diwali-memory-header">
              <span className="diwali-memory-year">
                🪔 Diwali {memory.year}
              </span>

              <h3>{memory.title}</h3>

              {memory.description && <p>{memory.description}</p>}
            </div>

            <div className="diwali-media-grid">
              {(memory.media || []).map((item) => {
                const mediaUrl = getMediaUrl(item.url);
                const isVideo =
                  item.type === 'video' ||
                  item.mimetype?.startsWith('video/');

                return (
                  <div className="diwali-media-item" key={item._id || item.url}>
                    {isVideo ? (
                      <video
                        src={mediaUrl}
                        controls
                        preload="metadata"
                        playsInline
                        aria-label={`Diwali ${memory.year} video`}
                      >
                        Your browser does not support video playback.
                      </video>
                    ) : (
                      <a
                        href={mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open Diwali ${memory.year} photo`}
                      >
                        <img
                          src={mediaUrl}
                          alt={`Diwali ${memory.year}: ${memory.title}`}
                          loading="lazy"
                        />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default UserDiwaliMemories;
