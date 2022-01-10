import React from 'react';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import { Bye } from './pages/Bye';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// import { useQuery } from '@apollo/react-hooks';
// import { gql } from 'apollo-boost';
// import { useHelloQuery } from './generated/graphql';

function AppRoutes() {
  // const { data, loading } = useHelloQuery();
  // if (loading || !data) {
  //   return <div>loading . . .</div>
  // }
  return (
    // <div className="App">
    //   <div>{ data.hello }</div>
    // </div>
    <BrowserRouter>
    <div>
      <header>
      <div>
          <Link to='/'>Home</Link>
        </div>
        <div>
          <Link to='/register'>Register</Link>
        </div>
        <div>
          <Link to='/login'>Login</Link>
        </div>
        <div>
          <Link to='/bye'>Logout </Link>
        </div>
      </header>
    </div>
      <Routes>
        <Route path='/' element={< Home /> } />
        <Route path='/register' element={< Register />} />
        <Route path='/login' element={< Login />} />
        <Route path='/bye' element={< Bye />} />


      </Routes>
    </BrowserRouter>

  );
}

export default AppRoutes;
