import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const protocol = window.location.protocol;
        const endpoint = `${protocol}//${codespaceName}-8000.app.github.dev/api/activities/`;
        
        console.log('Fetching activities from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities data received:', data);
        
        // Handle both paginated and plain array responses
        const activitiesData = data.results ? data.results : (Array.isArray(data) ? data : []);
        console.log('Processed activities:', activitiesData);
        
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
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
          <h2 className="mb-0">💪 Activities</h2>
        </div>
        <div className="card-body">
          {activities.length === 0 ? (
            <div className="empty-state">
              <h3>No activities found</h3>
              <p>Start by creating your first activity to track your fitness journey!</p>
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
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td><span className="badge badge-primary">{activity.id}</span></td>
                      <td><strong>{activity.name}</strong></td>
                      <td>{activity.description || '-'}</td>
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

export default Activities;
