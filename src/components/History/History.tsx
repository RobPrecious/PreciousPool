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

    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .winner-cell {
    background: lightgreen;
  }
`;


const Ball= styled.div`
  border: 1px solid black;
  height: 10px;
  width: 10px;
  background-color: ${props => props.color};
  color: ${props => props.color};
  list-style: none;
  border-radius: 50%;
  font-size: 1px;
`;

type Record = {
  date: string;
  player_1: string;
  player_2: string;
  winner: string;
  foulWin: boolean;
  sevenedWin: boolean;
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
      const recordRef = collection(database, process.env.NODE_ENV === "development" ? "record_test" : "record");

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
              <td><div>{game.winner} {game.foulWin ? (<Ball color="black"/>) : null} {game.sevenedWin ? (<Ball color="blue"/>) : null}</div></td>
            </tr>
          ))}
        </tbody>
      </HistoryTable>
    </div>
  );
};
