import { createGlobalStyle } from "styled-components";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

const GlobalStyle = createGlobalStyle`
    html {
    }

    header  {
      height: 10vh;
    }

    main {
      height: 85vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    body {
      font-family: 'Open Sans', sans-serif; 

      h1 {
        text-align: center;
      }
    }
`;

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <GlobalStyle />
        <header>
          <h1>Precious Pool</h1>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
