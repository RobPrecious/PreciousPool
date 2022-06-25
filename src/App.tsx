import { createGlobalStyle } from "styled-components";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Players from "./pages/Players";
import { FaBook, FaHome } from 'react-icons/fa';
import logo from './logo.jpg'; // Tell webpack this JS file uses this image

const GlobalStyle = createGlobalStyle`

    html, body {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
      font-family: 'Open Sans', sans-serif; 

      }

    
    main {
      margin: 8px;

    }

    
    header {
      background-color: #00008B;
      padding: 8px 16px;
      box-shadow: 0 4px 2px -2px grey;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;

      a {
        color: white;

        svg {
          height: 1.5em;
          width: 1.5em
        }

        h1 {
          font-size: 24px;
          margin: 0;

        }
      }
    }
`;

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <GlobalStyle />
        <header>
          <a href="/" aria-label="Home" title="Home"><FaHome/></a>
          <img src={logo} alt="Knock it Inn" style={{height: '50px'}}/>
          <a href="players" aria-label="History" title="History"><FaBook/></a>
        </header>
        <Routes>
          <Route path="/players" element={<Players />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
