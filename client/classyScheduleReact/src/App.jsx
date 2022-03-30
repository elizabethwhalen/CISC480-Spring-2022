import './App.css';
import Layout from './components/Layout';
import {BrowserRouter} from "react-router-dom";

const App = () => {

  // This component returns a wrapper router for the whole page
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App;
