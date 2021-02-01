import React from 'react';
import { useHistory } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const history = useHistory();

  return (
    <div>
      Landing Page works
      <button onClick={e => history.push('/account')}>Account</button>
    </div>
  );
};

export default LandingPage;