import React, { useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../../api';

function UserCricketMemories() {
  const [memories, setMemories] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMemories = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/cricket');
      setMemories(response.data.memories || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadMemories = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/cricket');
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

    loadMemories();

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
        : memories.filter((memory) => String(memory.year) === selectedYear),
    [memories, selectedYear]
  );

  const getPhotoUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://localhost:7000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="cricket-user-page">
      <style>{`
        .cricket-user-page {
          min-height: 80vh;
          padding: 38px 22px 60px;
          background: linear-gradient(135deg, #eaf3ff, #f4f7fb, #e9f5ed);
          color: #172b45;
          font-family: Arial, sans-serif;
        }

        .cricket-user-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cricket-user-hero {
          padding: 34px 20px;
          border-radius: 22px;
          background: linear-gradient(135deg, #102746, #176b55, #d18b24);
          color: white;
          text-align: center;
          box-shadow: 0 12px 30px rgba(16, 39, 70, 0.18);
        }

        .cricket-user-hero .cricket-icon {
          margin-bottom: 10px;
          font-size: 44px;
        }

        .cricket-user-hero h1 {
          margin: 0 0 12px;
          font-size: clamp(28px, 5vw, 43px);
          font-weight: 800;
        }

        .cricket-user-hero p {
          margin: 0;
          font-size: 16px;
          line-height: 1.7;
        }

        .cricket-user-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin: 28px 0;
        }

        .cricket-user-toolbar h2 {
          margin: 0;
          color: #174b3b;
          font-size: 25px;
        }

        .cricket-user-count {
          margin-top: 8px;
          color: #526579;
          font-size: 14px;
        }

        .cricket-year-select {
          min-width: 180px;
          padding: 12px 14px;
          border: 1px solid #b9cbdc;
          border-radius: 10px;
          background: white;
          color: #172b45;
          font-size: 15px;
          outline-color: #176b55;
        }

        .cricket-season-card {
          margin-bottom: 30px;
          overflow: hidden;
          border: 1px solid #dce6ee;
          border-radius: 18px;
          background: white;
          box-shadow: 0 8px 24px rgba(23, 43, 69, 0.08);
        }

        .cricket-season-header {
          padding: 22px;
          border-bottom: 1px solid #e8eef3;
          background: #fbfdff;
        }

        .cricket-season-label {
          display: inline-block;
          margin-bottom: 10px;
          padding: 7px 13px;
          border-radius: 20px;
          background: #e5f3ec;
          color: #176044;
          font-size: 13px;
          font-weight: 700;
        }

        .cricket-season-header h3 {
          margin: 0;
          color: #173b70;
          font-size: 25px;
          overflow-wrap: anywhere;
        }

        .cricket-season-year {
          margin-top: 7px;
          color: #64748b;
          font-weight: 600;
        }

        .cricket-awards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          padding: 18px 22px 4px;
        }

        .cricket-award {
          padding: 17px;
          border: 1px solid #e1eaf0;
          border-radius: 13px;
          background: #f8fbfd;
        }

        .cricket-award.first {
          border-left: 5px solid #d6a329;
        }

        .cricket-award.second {
          border-left: 5px solid #8b9baa;
        }

        .cricket-award h4 {
          margin: 0 0 9px;
          color: #174b3b;
          font-size: 17px;
        }

        .cricket-award p {
          margin: 5px 0;
          color: #425466;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .cricket-teams-section {
          padding: 18px 22px 22px;
        }

        .cricket-teams-section h4 {
          margin: 0 0 12px;
          color: #173b70;
          font-size: 18px;
        }

        .cricket-team-list {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .cricket-team-list li {
          padding: 9px 13px;
          border: 1px solid #dce8e2;
          border-radius: 20px;
          background: #f0f8f3;
          color: #24533f;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .cricket-photo-heading {
          margin: 0;
          padding: 0 22px 14px;
          color: #173b70;
          font-size: 18px;
        }

        .cricket-photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
          padding: 0 18px 20px;
        }

        .cricket-photo-item {
          overflow: hidden;
          aspect-ratio: 4 / 3;
          border-radius: 12px;
          background: #172b45;
        }

        .cricket-photo-item a {
          display: block;
          width: 100%;
          height: 100%;
        }

        .cricket-photo-item img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .cricket-photo-item img:hover {
          transform: scale(1.04);
        }

        .cricket-loading,
        .cricket-empty,
        .cricket-error {
          padding: 36px 20px;
          border-radius: 15px;
          background: white;
          text-align: center;
          line-height: 1.7;
        }

        .cricket-empty {
          border: 1px dashed #a9c7b7;
          color: #526b5d;
        }

        .cricket-error {
          border: 1px solid #efb8b8;
          color: #a12626;
        }

        .cricket-retry {
          margin-top: 12px;
          padding: 10px 18px;
          border: 0;
          border-radius: 8px;
          background: #174b3b;
          color: white;
          cursor: pointer;
        }

        @media (max-width: 650px) {
          .cricket-user-page {
            padding: 20px 12px 40px;
          }

          .cricket-user-hero {
            padding: 27px 15px;
          }

          .cricket-user-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .cricket-year-select {
            width: 100%;
          }

          .cricket-awards {
            grid-template-columns: 1fr;
            padding: 14px 14px 2px;
          }

          .cricket-season-header,
          .cricket-teams-section {
            padding: 16px;
          }

          .cricket-photo-grid {
            grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
            gap: 9px;
            padding: 0 12px 14px;
          }

          .cricket-photo-heading {
            padding: 0 16px 12px;
          }
        }
      `}</style>

      <div className="cricket-user-container">
        <header className="cricket-user-hero">
          <div className="cricket-icon" aria-hidden="true">🏏</div>
          <h1>VADGAON HERO'S</h1>
          <p>Cricket Memories — Seasons, Champions & Team Spirit</p>
          <p>Relive the proud cricket moments of our village.</p>
        </header>

        <div className="cricket-user-toolbar">
          <div>
            <h2>Our Cricket Memories 🏆</h2>
            <div className="cricket-user-count">
              {memories.length} {memories.length === 1 ? 'season' : 'seasons'} saved
            </div>
          </div>

          <select
            className="cricket-year-select"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            aria-label="Filter cricket memories by year"
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
          <div className="cricket-loading">Loading cricket memories... 🏏</div>
        )}

        {!loading && error && (
          <div className="cricket-error">
            <strong>Unable to load cricket memories.</strong>
            <p>{error}</p>
            <button className="cricket-retry" onClick={fetchMemories}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredMemories.length === 0 && (
          <div className="cricket-empty">
            <h3>No cricket memories found yet 🏏</h3>
            <p>
              Season memories will appear here after the admin adds the
              winners, participating teams and photos.
            </p>
          </div>
        )}

        {!loading && !error && filteredMemories.map((memory) => (
          <article className="cricket-season-card" key={memory._id}>
            <div className="cricket-season-header">
              <span className="cricket-season-label">
                🏆 Season {memory.seasonNumber}
              </span>
              <h3>Cricket Season {memory.seasonNumber}</h3>
              <div className="cricket-season-year">Year: {memory.year}</div>
            </div>

            <div className="cricket-awards">
              <section className="cricket-award first">
                <h4>🥇 First Prize</h4>
                <p><strong>Team:</strong> {memory.firstPrize?.teamName || '—'}</p>
                <p><strong>Owner:</strong> {memory.firstPrize?.ownerName || '—'}</p>
              </section>

              <section className="cricket-award second">
                <h4>🥈 Second Prize</h4>
                <p><strong>Team:</strong> {memory.secondPrize?.teamName || '—'}</p>
                <p><strong>Owner:</strong> {memory.secondPrize?.ownerName || '—'}</p>
              </section>
            </div>

            <section className="cricket-teams-section">
              <h4>Participating Teams ({memory.totalTeams ?? (memory.teams || []).length})</h4>
              <ul className="cricket-team-list">
                {(memory.teams || []).map((team, index) => (
                  <li key={`${team}-${index}`}>{team}</li>
                ))}
              </ul>
            </section>

            {(memory.photos || []).length > 0 && (
              <>
                <h4 className="cricket-photo-heading">Season Photos 📸</h4>
                <div className="cricket-photo-grid">
                  {memory.photos.map((photo, index) => {
                    const photoUrl = getPhotoUrl(photo.url);

                    return (
                      <div
                        className="cricket-photo-item"
                        key={photo._id || photo.url || index}
                      >
                        <a
                          href={photoUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open photo ${index + 1} from season ${memory.seasonNumber}`}
                        >
                          <img
                            src={photoUrl}
                            alt={`Cricket season ${memory.seasonNumber}, photo ${index + 1}`}
                            loading="lazy"
                          />
                        </a>
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

export default UserCricketMemories;
