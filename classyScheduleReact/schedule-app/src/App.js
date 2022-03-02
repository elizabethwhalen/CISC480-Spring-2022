import './App.css';
import Layout from './components/Layout';
import {
  BrowserRouter,
  // Routes,
  // Route,
} from "react-router-dom";
//import Login from './components/Login';

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
      {/* <Routes>
        <Route path="/" element={<Login />} />
      </Routes> */}
    </BrowserRouter>
  );
}

export default App;
