import React from 'react';
import './ExternalResources.css';
import { useNavigate } from 'react-router-dom';

function ExternalResources() {
  const navigate = useNavigate();

  return (
    <div className="external-resources" onClick={() => navigate('/resources')} style={{ cursor: 'pointer' }}>
      <div className="resources-text">
        <h2>External Resources</h2>
        <p>Click to get external resources</p>
      </div>
      <div className="resources-image">👥</div>
    </div>
  );
}

export default ExternalResources;
