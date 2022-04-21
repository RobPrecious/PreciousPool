import React, { ChangeEvent } from "react";
import { database } from "../utils/firebase";
import { getDocs, collection, query, orderBy, where } from "firebase/firestore";

type Player = {
  name: string;
};

interface PlayerStats {
  count: number;
  wins: number;
  breakdown: {
    [name: string]: {
      wins: number;
      total: number;
    };
  };
}

function Players() {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(
    null
  );
  const [selectedPlayerStats, setSelectedPlayerStats] =
    React.useState<PlayerStats | null>(null);

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
    getPlayers().then((results) => setPlayers(results));
  }, []);

  const onPlayerSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    const foundPlayer =
      players.find((player) => player.name === event.target.value) || null;
    setSelectedPlayer(foundPlayer);

    if (foundPlayer?.name)
      setSelectedPlayerStats(await getPlayerStats(foundPlayer.name));
  };

  const getPlayerStats = async (name: string) => {
    const recordRef = collection(database, "record");

    const q_1 = query(
      recordRef,
      where("player_1", "==", name),
      orderBy("date", "desc")
    );

    const querySnapshot_1 = await getDocs(q_1);

    const results: any[] = [];
    querySnapshot_1.forEach((doc) => {
      results.push(doc.data());
    });

    const q_2 = query(
      recordRef,
      where("player_2", "==", name),
      orderBy("date", "desc")
    );

    const querySnapshot_2 = await getDocs(q_2);

    querySnapshot_2.forEach((doc) => {
      results.push(doc.data());
    });

    const breakdown = results.reduce((bd, game, index) => {
      const opponent = game.player_1 === name ? game.player_2 : game.player_1;
      if (bd[opponent]) {
        if (game.winner === name) {
          bd[opponent].wins++;
        }
        bd[opponent].total++;
      } else {
        bd[opponent] = {
          wins: game.winner === name ? 1 : 0,
          total: 1,
        };
      }
      return bd;
    }, {});

    return {
      count: results.length,
      wins: results.filter((game) => game.winner === name).length,
      breakdown,
    };
  };

  return (
    <main>
      <h2>Players</h2>
      <label>
        <h3>Select Player</h3>
        <select onChange={onPlayerSelect}>
          <option>All Players</option>
          {players.map((player) => (
            <option key={player.name}>{player.name}</option>
          ))}
        </select>
      </label>

      {!selectedPlayer && (
        <div>
          <h2>All Players</h2>
        </div>
      )}

      {selectedPlayer && selectedPlayerStats && (
        <div>
          <h2>{selectedPlayer.name}</h2>
          <p>Total games: {selectedPlayerStats.count}</p>
          <p>Total wins: {selectedPlayerStats.wins}</p>
          <h3>Breakdown</h3>
          {Object.keys(selectedPlayerStats.breakdown).map((key: string) => {
            //@ts-ignore
            const personResults = selectedPlayerStats.breakdown?.[key];
            return (
              <div key={key}>
                {key} {personResults.wins}/{personResults.total}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Players;
