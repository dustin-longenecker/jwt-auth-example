import React from 'react';
import './App.css';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

function App() {
  const { data, loading } = useQuery(gql `
    {
      hello
    }
  `);
  if (loading) {
    <div>loading . . .</div>
  }
  return (
    <div className="App">
      <div>{ JSON.stringify(data) }</div>
    </div>
  );
}

export default App;
