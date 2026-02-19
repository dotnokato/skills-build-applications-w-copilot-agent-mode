import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const protocol = window.location.protocol;
        const endpoint = `${protocol}//${codespaceName}-8000.app.github.dev/api/workouts/`;
        
        console.log('Fetching workouts from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts data received:', data);
        
        // Handle both paginated and plain array responses
        const workoutsData = data.results ? data.results : (Array.isArray(data) ? data : []);
        console.log('Processed workouts:', workoutsData);
        
        setWorkouts(workoutsData);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
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
          <h2 className="mb-0">🏋️ Workouts</h2>
        </div>
        <div className="card-body">
          {workouts.length === 0 ? (
            <div className="empty-state">
              <h3>No workouts found</h3>
              <p>Get started by creating your first workout routine!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout) => (
                    <tr key={workout.id}>
                      <td><span className="badge badge-primary">{workout.id}</span></td>
                      <td><strong>{workout.name}</strong></td>
                      <td>{workout.duration ? `${workout.duration} min` : '-'}</td>
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

export default Workouts;
