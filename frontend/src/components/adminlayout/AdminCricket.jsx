import React, { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api';

export default function AdminCricket() {
  const [memories, setMemories] = useState([]);
  const [seasonNumber, setSeasonNumber] = useState('1');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [firstPrizeTeam, setFirstPrizeTeam] = useState('');
  const [firstPrizeOwner, setFirstPrizeOwner] = useState('');
  const [secondPrizeTeam, setSecondPrizeTeam] = useState('');
  const [secondPrizeOwner, setSecondPrizeOwner] = useState('');
  const [totalTeams, setTotalTeams] = useState('2');
  const [teams, setTeams] = useState(['', '']);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState('');

  const loadMemories = async () => {
    try {
      setFetching(true);
      setError('');
      const response = await api.get('/cricket');
      setMemories(
        Array.isArray(response.data.memories) ? response.data.memories : []
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

  const handleTotalTeamsChange = (value) => {
    setTotalTeams(value);
    const count = Number(value);

    if (Number.isInteger(count) && count >= 2 && count <= 100) {
      setTeams((previous) =>
        Array.from({ length: count }, (_, index) => previous[index] || '')
      );
    } else {
      setTeams([]);
    }
  };

  const handleTeamChange = (index, value) => {
    setTeams((previous) =>
      previous.map((team, teamIndex) =>
        teamIndex === index ? value : team
      )
    );
  };

  const handlePhotosChange = (event) => {
    const selected = Array.from(event.target.files || []);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFile = selected.find(
      (file) => !allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024
    );

    setError('');
    setSuccess('');

    if (selected.length > 20) {
      setError('You can upload a maximum of 20 photos per season.');
      setPhotos([]);
      event.target.value = '';
      return;
    }

    if (invalidFile) {
      setError('Choose JPG, PNG or WEBP photos. Each photo must be 5 MB or smaller.');
      setPhotos([]);
      event.target.value = '';
      return;
    }

    setPhotos(selected);
  };

  const resetForm = () => {
    setSeasonNumber('');
    setYear(String(new Date().getFullYear()));
    setFirstPrizeTeam('');
    setFirstPrizeOwner('');
    setSecondPrizeTeam('');
    setSecondPrizeOwner('');
    setTotalTeams('2');
    setTeams(['', '']);
    setPhotos([]);
    const input = document.getElementById('cricket-photos');
    if (input) input.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const numericSeason = Number(seasonNumber);
    const numericYear = Number(year);
    const numericTotal = Number(totalTeams);
    const cleanTeams = teams.map((team) => team.trim());

    if (!Number.isInteger(numericSeason) || numericSeason < 1) {
      setError('Enter a valid season number.');
      return;
    }

    if (!Number.isInteger(numericYear) || numericYear < 1900 || numericYear > 2100) {
      setError('Enter a valid year.');
      return;
    }

    if (
      !Number.isInteger(numericTotal) ||
      numericTotal < 2 ||
      numericTotal > 100 ||
      cleanTeams.length !== numericTotal
    ) {
      setError('Enter a valid total team count between 2 and 100.');
      return;
    }

    if (cleanTeams.some((team) => !team)) {
      setError('Please enter every participating team name.');
      return;
    }

    if (cleanTeams.some((team) => team.length > 100)) {
      setError('Team names cannot exceed 100 characters.');
      return;
    }

    if (
      !firstPrizeTeam.trim() ||
      !firstPrizeOwner.trim() ||
      !secondPrizeTeam.trim() ||
      !secondPrizeOwner.trim()
    ) {
      setError('Please enter both prize team names and owner names.');
      return;
    }

    if (!cleanTeams.some((team) => team.toLowerCase() === firstPrizeTeam.trim().toLowerCase())) {
      setError('First-prize team must be included in the participating team list.');
      return;
    }

    if (!cleanTeams.some((team) => team.toLowerCase() === secondPrizeTeam.trim().toLowerCase())) {
      setError('Second-prize team must be included in the participating team list.');
      return;
    }

    if (firstPrizeTeam.trim().toLowerCase() === secondPrizeTeam.trim().toLowerCase()) {
      setError('First-prize and second-prize teams must be different.');
      return;
    }

    if (!photos.length) {
      setError('Please select at least one cricket photo.');
      return;
    }

    const formData = new FormData();
    formData.append('seasonNumber', String(numericSeason));
    formData.append('year', String(numericYear));
    formData.append('firstPrizeTeam', firstPrizeTeam.trim());
    formData.append('firstPrizeOwner', firstPrizeOwner.trim());
    formData.append('secondPrizeTeam', secondPrizeTeam.trim());
    formData.append('secondPrizeOwner', secondPrizeOwner.trim());
    formData.append('totalTeams', String(numericTotal));
    formData.append('teams', JSON.stringify(cleanTeams));
    photos.forEach((photo) => formData.append('photos', photo));

    try {
      setLoading(true);
      const response = await api.post('/cricket/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(response.data.message || 'Cricket season memory added successfully.');
      resetForm();
      await loadMemories();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memory) => {
    const confirmed = window.confirm(
      `Delete Season ${memory.seasonNumber} (${memory.year}) and all its cricket photos? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');
    setDeleteId(memory._id);

    try {
      const response = await api.delete(`/cricket/admin/${memory._id}`);
      setMemories((previous) =>
        previous.filter((item) => item._id !== memory._id)
      );
      setSuccess(response.data.message || 'Cricket season memory deleted successfully.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleteId('');
    }
  };

  const getPhotoUrl = (photo) => {
    if (!photo?.url) return '';
    if (photo.url.startsWith('http://') || photo.url.startsWith('https://')) {
      return photo.url;
    }
    return `http://localhost:7000${photo.url.startsWith('/') ? '' : '/'}${photo.url}`;
  };

  return (
    <>
      <style>{`
        .vh-cricket-admin {
          min-height: 75vh;
          padding: 30px 22px 50px;
          background: #f4f7fa;
          color: #17212b;
          font-family: Arial, sans-serif;
        }
        .vh-cricket-container { max-width: 1250px; margin: 0 auto; }
        .vh-cricket-header {
          padding: 30px;
          margin-bottom: 25px;
          border-radius: 16px;
          background: linear-gradient(120deg, #101820, #174b35);
          color: #fff;
        }
        .vh-cricket-header h1 { margin: 0 0 10px; color: #facc15; font-size: 30px; }
        .vh-cricket-header p { margin: 0; color: #e1e5eb; line-height: 1.7; }
        .vh-cricket-form, .vh-cricket-gallery {
          padding: 26px;
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 5px 20px rgba(0,0,0,.04);
        }
        .vh-cricket-form h2, .vh-cricket-gallery h2 { margin: 0 0 20px; font-size: 22px; }
        .vh-cricket-section-title {
          margin: 22px 0 14px;
          padding-bottom: 9px;
          border-bottom: 1px solid #e5e7eb;
          color: #174b35;
          font-size: 17px;
        }
        .vh-cricket-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .vh-cricket-field { min-width: 0; margin-bottom: 12px; }
        .vh-cricket-field.full { grid-column: 1 / -1; }
        .vh-cricket-field label {
          display: block; margin-bottom: 8px; font-size: 13px; font-weight: 700;
        }
        .vh-cricket-field input {
          width: 100%; box-sizing: border-box; padding: 12px 13px;
          border: 1px solid #d5dde6; border-radius: 8px; outline: none;
          font-family: inherit; font-size: 14px;
        }
        .vh-cricket-field input:focus {
          border-color: #16804b; box-shadow: 0 0 0 3px rgba(22,128,75,.12);
        }
        .vh-cricket-team-grid {
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;
        }
        .vh-cricket-submit, .vh-cricket-delete {
          padding: 12px 18px; border: none; border-radius: 8px;
          font-size: 14px; font-weight: 700; cursor: pointer;
        }
        .vh-cricket-submit { background: #166534; color: #fff; }
        .vh-cricket-submit:disabled, .vh-cricket-delete:disabled {
          opacity: .6; cursor: not-allowed;
        }
        .vh-cricket-delete { padding: 9px 12px; background: #fee2e2; color: #991b1b; }
        .vh-cricket-alert {
          margin-bottom: 18px; padding: 12px 14px; border-radius: 8px;
          font-size: 13px; line-height: 1.6; overflow-wrap: anywhere;
        }
        .vh-cricket-error { background: #fee2e2; color: #991b1b; }
        .vh-cricket-success { background: #dcfce7; color: #166534; }
        .vh-cricket-help { display: block; margin-top: 7px; color: #647180; font-size: 12px; }
        .vh-cricket-gallery-heading {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 20px;
        }
        .vh-cricket-gallery-heading h2 { margin: 0; }
        .vh-cricket-count { color: #647180; font-size: 13px; }
        .vh-cricket-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;
        }
        .vh-cricket-card {
          min-width: 0; overflow: hidden; border: 1px solid #e2e8f0;
          border-radius: 13px; background: #fff;
        }
        .vh-cricket-photo-grid {
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 3px; background: #e8edf2;
        }
        .vh-cricket-photo-grid img {
          display: block; width: 100%; height: 140px; object-fit: cover; background: #101820;
        }
        .vh-cricket-photo-empty {
          grid-column: 1 / -1; display: grid; place-items: center;
          min-height: 120px; color: #647180; font-size: 13px;
        }
        .vh-cricket-card-content { padding: 18px; }
        .vh-cricket-season {
          display: inline-block; margin-bottom: 10px; padding: 5px 9px;
          border-radius: 20px; background: #dcfce7; color: #166534;
          font-size: 12px; font-weight: 700;
        }
        .vh-cricket-card-content h3 { margin: 0 0 12px; font-size: 19px; }
        .vh-cricket-detail { margin: 7px 0; color: #475569; font-size: 13px; line-height: 1.5; }
        .vh-cricket-card-content ul { margin: 7px 0 14px; padding-left: 20px; color: #475569; font-size: 13px; }
        .vh-cricket-card-bottom {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; padding-top: 14px; border-top: 1px solid #edf0f3;
        }
        .vh-cricket-empty {
          padding: 35px 20px; border: 1px dashed #cbd5e1; border-radius: 12px;
          background: #fff; text-align: center; color: #647180; line-height: 1.7;
        }
        @media (max-width: 900px) {
          .vh-cricket-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 600px) {
          .vh-cricket-admin { padding: 22px 13px 35px; }
          .vh-cricket-header, .vh-cricket-form, .vh-cricket-gallery { padding: 21px 17px; }
          .vh-cricket-header h1 { font-size: 25px; }
          .vh-cricket-fields, .vh-cricket-team-grid, .vh-cricket-grid { grid-template-columns: 1fr; }
          .vh-cricket-field.full { grid-column: auto; }
        }
      `}</style>

      <div className="vh-cricket-admin">
        <div className="vh-cricket-container">
          <header className="vh-cricket-header">
            <h1>🏏 Cricket Season Memories</h1>
            <p>VADGAON HERO'S — Add season results, participating teams and memorable cricket photos.</p>
          </header>

          <section className="vh-cricket-form">
            <h2>Add Cricket Season</h2>

            {error && <div className="vh-cricket-alert vh-cricket-error" role="alert">{error}</div>}
            {success && <div className="vh-cricket-alert vh-cricket-success" role="status">{success}</div>}

            <form onSubmit={handleSubmit}>
              <h3 className="vh-cricket-section-title">Season Details</h3>
              <div className="vh-cricket-fields">
                <div className="vh-cricket-field">
                  <label htmlFor="cricket-season">Season Number *</label>
                  <input id="cricket-season" type="number" min="1" value={seasonNumber}
                    onChange={(event) => setSeasonNumber(event.target.value)} required />
                </div>
                <div className="vh-cricket-field">
                  <label htmlFor="cricket-year">Year *</label>
                  <input id="cricket-year" type="number" min="1900" max="2100" value={year}
                    onChange={(event) => setYear(event.target.value)} required />
                </div>
              </div>

              <h3 className="vh-cricket-section-title">🥇 First Prize</h3>
              <div className="vh-cricket-fields">
                <div className="vh-cricket-field">
                  <label htmlFor="first-prize-team">Winning Team Name *</label>
                  <input id="first-prize-team" value={firstPrizeTeam}
                    onChange={(event) => setFirstPrizeTeam(event.target.value)}
                    placeholder="Enter winning team name" maxLength={100} required />
                </div>
                <div className="vh-cricket-field">
                  <label htmlFor="first-prize-owner">Owner Name *</label>
                  <input id="first-prize-owner" value={firstPrizeOwner}
                    onChange={(event) => setFirstPrizeOwner(event.target.value)}
                    placeholder="Enter owner name" maxLength={100} required />
                </div>
              </div>

              <h3 className="vh-cricket-section-title">🥈 Second Prize</h3>
              <div className="vh-cricket-fields">
                <div className="vh-cricket-field">
                  <label htmlFor="second-prize-team">Runner-up Team Name *</label>
                  <input id="second-prize-team" value={secondPrizeTeam}
                    onChange={(event) => setSecondPrizeTeam(event.target.value)}
                    placeholder="Enter second-prize team name" maxLength={100} required />
                </div>
                <div className="vh-cricket-field">
                  <label htmlFor="second-prize-owner">Owner Name *</label>
                  <input id="second-prize-owner" value={secondPrizeOwner}
                    onChange={(event) => setSecondPrizeOwner(event.target.value)}
                    placeholder="Enter owner name" maxLength={100} required />
                </div>
              </div>

              <h3 className="vh-cricket-section-title">🏆 Participating Teams</h3>
              <div className="vh-cricket-field">
                <label htmlFor="cricket-total-teams">Total Teams *</label>
                <input id="cricket-total-teams" type="number" min="2" max="100"
                  value={totalTeams} onChange={(event) => handleTotalTeamsChange(event.target.value)}
                  required />
                <span className="vh-cricket-help">Enter the number of teams. One name field will appear for each team (maximum 100).</span>
              </div>

              <div className="vh-cricket-team-grid">
                {teams.map((team, index) => (
                  <div className="vh-cricket-field" key={index}>
                    <label htmlFor={`cricket-team-${index}`}>Team {index + 1} Name *</label>
                    <input id={`cricket-team-${index}`} value={team}
                      onChange={(event) => handleTeamChange(index, event.target.value)}
                      placeholder={`Enter team ${index + 1} name`} maxLength={100} required />
                  </div>
                ))}
              </div>

              <h3 className="vh-cricket-section-title">📸 Season Photos</h3>
              <div className="vh-cricket-field">
                <label htmlFor="cricket-photos">Upload Cricket Photos *</label>
                <input id="cricket-photos" type="file" accept="image/jpeg,image/png,image/webp"
                  multiple onChange={handlePhotosChange} required />
                <span className="vh-cricket-help">Select up to 20 JPG, PNG or WEBP photos. Each photo must be 5 MB or smaller.</span>
                {photos.length > 0 && (
                  <div className="vh-cricket-help">
                    {photos.length} photo(s) selected: {photos.map((photo) => photo.name).join(', ')}
                  </div>
                )}
              </div>

              <button type="submit" className="vh-cricket-submit" disabled={loading}>
                {loading ? 'Saving Cricket Season...' : '＋ Add Cricket Season'}
              </button>
            </form>
          </section>

          <section className="vh-cricket-gallery">
            <div className="vh-cricket-gallery-heading">
              <h2>Saved Cricket Seasons</h2>
              <span className="vh-cricket-count">{memories.length} season record(s)</span>
            </div>

            {fetching ? (
              <div className="vh-cricket-empty">Loading Cricket memories...</div>
            ) : memories.length === 0 ? (
              <div className="vh-cricket-empty">
                <h3>No Cricket memories yet</h3>
                Add your first season using the form above.
              </div>
            ) : (
              <div className="vh-cricket-grid">
                {memories.map((memory) => (
                  <article className="vh-cricket-card" key={memory._id}>
                    <div className="vh-cricket-photo-grid">
                      {Array.isArray(memory.photos) && memory.photos.length > 0
                        ? memory.photos.slice(0, 4).map((photo, index) => (
                            <img key={photo._id || photo.url || index}
                              src={getPhotoUrl(photo)}
                              alt={`Season ${memory.seasonNumber} cricket memory ${index + 1}`}
                              loading="lazy" />
                          ))
                        : <div className="vh-cricket-photo-empty">No photos available</div>}
                    </div>

                    <div className="vh-cricket-card-content">
                      <span className="vh-cricket-season">Season {memory.seasonNumber} · {memory.year}</span>
                      <h3>Season {memory.seasonNumber}</h3>
                      <p className="vh-cricket-detail">
                        🥇 First Prize: <strong>{memory.firstPrize?.teamName}</strong>
                        {' '}— Owner: {memory.firstPrize?.ownerName}
                      </p>
                      <p className="vh-cricket-detail">
                        🥈 Second Prize: <strong>{memory.secondPrize?.teamName}</strong>
                        {' '}— Owner: {memory.secondPrize?.ownerName}
                      </p>
                      <p className="vh-cricket-detail">Total Teams: {memory.totalTeams}</p>
                      <strong className="vh-cricket-detail">Participating Teams:</strong>
                      <ul>
                        {(memory.teams || []).map((team, index) => <li key={`${team}-${index}`}>{team}</li>)}
                      </ul>
                      <div className="vh-cricket-card-bottom">
                        <span className="vh-cricket-count">{memory.photos?.length || 0} photo(s)</span>
                        <button type="button" className="vh-cricket-delete"
                          disabled={deleteId === memory._id}
                          onClick={() => handleDelete(memory)}>
                          {deleteId === memory._id ? 'Deleting...' : 'Delete Season'}
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
