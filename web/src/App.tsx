import React from 'react';
import './App.css';

// import { useQuery } from '@apollo/react-hooks';
// import { gql } from 'apollo-boost';
import { useHelloQuery } from './generated/graphql';

function App() {
  const { data, loading } = useHelloQuery();
  if (loading || !data) {
    return <div>loading . . .</div>
  }
  return (
    <div className="App">
      <div>{ data.hello }</div>
    </div>
  );
}

export default App;
