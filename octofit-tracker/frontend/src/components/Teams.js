import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const protocol = window.location.protocol;
        const endpoint = `${protocol}//${codespaceName}-8000.app.github.dev/api/teams/`;
        
        console.log('Fetching teams from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams data received:', data);
        
        // Handle both paginated and plain array responses
        const teamsData = data.results ? data.results : (Array.isArray(data) ? data : []);
        console.log('Processed teams:', teamsData);
        
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
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

  return (
    <div className="container-lg my-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">🏆 Teams</h2>
        </div>
        <div className="card-body">
          {teams.length === 0 ? (
            <div className="empty-state">
              <h3>No teams found</h3>
              <p>Create a team to compete with your friends and colleagues!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id}>
                      <td><span className="badge badge-primary">{team.id}</span></td>
                      <td><strong>{team.name}</strong></td>
                      <td>{team.description || '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2">View</button>
                        <button className="btn btn-sm btn-info me-2">Edit</button>
                        <button className="btn btn-sm btn-danger">Delete</button>
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

export default Teams;
