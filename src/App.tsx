import { createGlobalStyle } from "styled-components";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Players from "./pages/Players";
import { addPreviousDataToFirebase } from "./utils/export";

const GlobalStyle = createGlobalStyle`

    html {
    }

    header  {
      height: 10vh;
    }

    main {
      height: 85vh;

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
          <a href="/"><h1>Precious Pool</h1></a>
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
