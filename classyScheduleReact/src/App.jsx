import './App.css';
import React from 'react';
import Layout from './components/layout/Layout';
import useToken from './server/useToken';
import LogRouter from './router/LogRouter';

export default function App () {
  const { token, setToken } = useToken();
  const [loggedIn, setLoggedIn] = React.useState(false);

  if (!token) {
    return (
      <LogRouter
        setLoggedIn={setLoggedIn}
        setToken={setToken}
      />
    );
  }

  const handleLogOut = () => {
    sessionStorage.clear();
    return (
      <LogRouter
        setLoggedIn={setLoggedIn}
        setToken={setToken}
      />
    );
  }

  // This component returns a wrapper router for the whole page
  return (
    <Layout
      loggedIn={loggedIn}
      setLoggedIn={setLoggedIn}
      handleLogOut={handleLogOut}
      setToken={setToken}
    />
  );
}