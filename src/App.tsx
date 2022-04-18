import { PlayerChoice } from "./components/PlayerChoice/PlayerChoice";
import { createGlobalStyle } from "styled-components";
import { History } from "./components/History/History";

const GlobalStyle = createGlobalStyle`
    main {
      box-sizing:border-box;
      font-family: 'Open Sans', sans-serif; 
    }
`;
function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <main>
        <h1>Precious Pool</h1>
        <PlayerChoice />

        <History />
      </main>
    </div>
  );
}

export default App;
