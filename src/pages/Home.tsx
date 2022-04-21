import { PlayerChoice } from "../components/PlayerChoice/PlayerChoice";
import { History } from "../components/History/History";
import React from "react";
import styled from "styled-components";

const StickToBottom = styled.div`
  margin-top: auto;
`;

function Home() {
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());
  return (
    <main>
      <PlayerChoice onUpdate={() => setLastUpdate(new Date())} />
      <StickToBottom>
        <History title="Last 5 Games" limit={5} lastUpdate={lastUpdate} />
      </StickToBottom>
    </main>
  );
}

export default Home;
