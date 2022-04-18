import React from "react";
import { database } from "../../utils/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";

type Player = {
  name: string;
};

export const PlayerChoice = () => {
  const [playerOne, setPlayerOne] = React.useState<Player | null>(null);
  const [playerTwo, setPlayerTwo] = React.useState<Player | null>(null);
  const [winner, setWinner] = React.useState<Player | null>(null);
  const [players, setPlayers] = React.useState<Player[]>([]);

  React.useEffect(() => {
    async function getPlayers() {
      const querySnapshot = await getDocs(collection(database, "players"));

      const results: any[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      return results;
    }
    getPlayers().then((players) => setPlayers(players));
  }, []);

  const saveResult = async () => {
    try {
      const docRef = await addDoc(collection(database, "record"), {
        date: new Date().toISOString(),
        player_1: playerOne?.name,
        player_2: playerTwo?.name,
        winner: winner?.name,
      });
      setPlayerOne(null);
      setPlayerTwo(null);
      setWinner(null);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      {/* <button onClick={addPreviousDataToFirebase}>Export</button> */}

      {!playerOne && (
        <div>
          <h2>Player 1</h2>
          {players.map((player: Player) => (
            <button key={player.name} onClick={() => setPlayerOne(player)}>
              {player.name}
            </button>
          ))}
        </div>
      )}

      {playerOne && !playerTwo && (
        <div>
          <div>
            <h2>Player 1</h2>
            <p>{playerOne.name}</p>
          </div>
          <div>
            <h2>Player 2</h2>

            {players
              .filter((player) => player.name !== playerOne.name)
              .map((player: Player) => (
                <button key={player.name} onClick={() => setPlayerTwo(player)}>
                  {player.name}
                </button>
              ))}
          </div>
        </div>
      )}

      {playerOne && playerTwo && (
        <div>
          <button
            data-winning={playerOne.name === winner?.name}
            onClick={() => setWinner(playerOne)}
          >
            <h2>Player 1</h2>
            <p>{playerOne.name}</p>
          </button>
          vs
          <button
            data-winning={playerTwo.name === winner?.name}
            onClick={() => setWinner(playerTwo)}
          >
            <h2>Player 2</h2>
            <p>{playerTwo.name}</p>
          </button>
          <div>
            <button onClick={saveResult}>Save</button>
            Click on the winner to save
          </div>
        </div>
      )}
    </div>
  );
};
