import React from "react";
import { database } from "../../utils/firebase";
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import styled from "styled-components";

const HistoryTable = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;

  th,
  td {
    padding: 4px;
    border: 1px solid darkgrey;
  }

  .winner-cell {
    background: lightgreen;
  }
`;

type Record = {
  date: string;
  player_1: string;
  player_2: string;
  winner: string;
};

interface HistoryProps {
  limit: number;
  title: string;
  lastUpdate: Date;
}
export const History = (props: HistoryProps) => {
  const [history, setHistory] = React.useState<Record[] | null>(null);

  React.useEffect(() => {
    const getHistory = async () => {
      const recordRef = collection(database, "record");

      const q = query(recordRef, orderBy("date", "desc"), limit(props.limit));

      const querySnapshot = await getDocs(q);

      const results: any[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      return results;
    };

    getHistory().then((history) => setHistory(history));
  }, [props.lastUpdate, props.limit]);

  return (
    <div>
      <h2>{props.title}</h2>
      <HistoryTable>
        <thead>
          <tr>
            <th>Time</th>
            <th>Player 1</th>
            <th>Player 2</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {history?.map((game, index) => (
            <tr key={game.date + index}>
              <td>{new Date(game.date).toLocaleTimeString()}</td>
              <td
                className={game.player_1 === game.winner ? "winner-cell" : ""}
              >
                {game.player_1}
              </td>
              <td
                className={game.player_2 === game.winner ? "winner-cell" : ""}
              >
                {game.player_2}
              </td>
              <td>{game.winner}</td>
            </tr>
          ))}
        </tbody>
      </HistoryTable>
    </div>
  );
};
