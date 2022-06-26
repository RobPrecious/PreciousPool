import React from "react";
import { database } from "../../utils/firebase";
import {
  getDocs,
  collection,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import styled from "styled-components";

const PlayerChoiceContainer = styled.div`
  text-align: center;
`;

const PlayerChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 50px 1fr;
  gap: 8px;
  align-items: center;
  text-align: center;
  padding-bottom: 8px;
`;

const PlayerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
`;

const PlayerSelect = styled.button<{ winning?: boolean }>`
  background-color: #00008B;
  color: white;
  font-weight: bolder;
  border: none;
  padding: 8px;
  font-size: 1.25em;

  ${(props) =>
    props.winning &&
    `
    background: orange
  `}
`;

type Player = {
  name: string;
};

export const PlayerChoice = (props: { onUpdate: () => void }) => {
  const [playerOne, setPlayerOne] = React.useState<Player | null>(null);
  const [playerTwo, setPlayerTwo] = React.useState<Player | null>(null);
  const [winner, setWinner] = React.useState<Player | null>(null);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    async function getPlayers() {
      const recordRef = collection(database, "players");

      const q = query(recordRef, orderBy("name", "asc"));

      const querySnapshot = await getDocs(q);

      const results: any[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      return results;
    }
    getPlayers().then((players) => setPlayers(players));
  }, []);

  const saveResult = async () => {
    setLoading(true)
    
    try {
      const docRef = await addDoc(collection(database, process.env.NODE_ENV === "development" ? "record_test" : "record"), {
        date: new Date().toISOString(),
        player_1: playerOne?.name,
        player_2: playerTwo?.name,
        winner: winner?.name,
      });
      setPlayerOne(null);
      setPlayerTwo(null);
      setWinner(null);
      setLoading(false)
      props.onUpdate();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <PlayerChoiceContainer>
      {playerOne && playerTwo && <div>Pick a winner</div>}

      {/* <button onClick={addPreviousDataToFirebase}>Export</button> */}
      <PlayerChoiceGrid>
        <h2>Player 1</h2>
        <div />
        <h2>Player 2</h2>
      </PlayerChoiceGrid>

      {!playerOne && (
        <PlayerChoiceGrid>
          <PlayerGroup>
            {players.map((player: Player) => (
              <PlayerSelect
                key={player.name}
                onClick={() => setPlayerOne(player)}
              >
                {player.name}
              </PlayerSelect>
            ))}
          </PlayerGroup>
          <div />
        </PlayerChoiceGrid>
      )}

      {playerOne && !playerTwo && (
        <PlayerChoiceGrid>
          <PlayerGroup>
            <p>{playerOne.name}</p>
          </PlayerGroup>
          <div>vs</div>
          <PlayerGroup>
            {players
              .filter((player) => player.name !== playerOne.name)
              .map((player: Player) => (
                <PlayerSelect
                  key={player.name}
                  onClick={() => setPlayerTwo(player)}
                >
                  {player.name}
                </PlayerSelect>
              ))}
          </PlayerGroup>
        </PlayerChoiceGrid>
      )}

      {playerOne && playerTwo && (
        <div>
          <PlayerChoiceGrid>
            <PlayerGroup>
              <PlayerSelect
                winning={playerOne.name === winner?.name}
                onClick={() => setWinner(playerOne)}
              >
                <p>{playerOne.name}</p>
              </PlayerSelect>
            </PlayerGroup>
            <div>vs</div>
            <PlayerGroup>
              <PlayerSelect
                winning={playerTwo.name === winner?.name}
                onClick={() => setWinner(playerTwo)}
              >
                <p>{playerTwo.name}</p>
              </PlayerSelect>
            </PlayerGroup>
          </PlayerChoiceGrid>
          <PlayerGroup>
            <PlayerSelect disabled={!winner && !loading} onClick={saveResult}>
              Save
            </PlayerSelect>
            Click on the winner to save
          </PlayerGroup>
        </div>
      )}
    </PlayerChoiceContainer>
  );
};
