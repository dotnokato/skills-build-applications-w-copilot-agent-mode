import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const protocol = window.location.protocol;
        const endpoint = `${protocol}//${codespaceName}-8000.app.github.dev/api/leaderboard/`;
        
        console.log('Fetching leaderboard from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard data received:', data);
        
        // Handle both paginated and plain array responses
        const leaderboardData = data.results ? data.results : (Array.isArray(data) ? data : []);
        console.log('Processed leaderboard:', leaderboardData);
        
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
      </div>
    );
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="container-lg my-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">⭐ Leaderboard</h2>
        </div>
        <div className="card-body">
          {leaderboard.length === 0 ? (
            <div className="empty-state">
              <h3>No leaderboard data found</h3>
              <p>Complete activities to appear on the leaderboard!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th scope="col" width="15%">Rank</th>
                    <th scope="col" width="50%">User</th>
                    <th scope="col" width="35%">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>
                        <strong className="text-dark">{getRankBadge(index + 1)}</strong>
                      </td>
                      <td>
                        <strong>{entry.user || `User ${entry.id}`}</strong>
                      </td>
                      <td>
                        <span className="badge badge-success" style={{ fontSize: '1rem' }}>
                          {entry.score || 0} pts
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
