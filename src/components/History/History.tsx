import React from "react";
import { database } from "../../utils/firebase";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

type Record = {
  date: string;
  player_1: string;
  player_2: string;
  winner: string;
};

export const History = () => {
  const [history, setHistory] = React.useState<Record[] | null>(null);

  const getHistory = async () => {
    const recordRef = collection(database, "record");

    const q = query(recordRef, orderBy("date", "desc"), limit(20));

    const querySnapshot = await getDocs(q);

    const results: any[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    return results;
  };

  React.useEffect(() => {
    getHistory().then((history) => setHistory(history));
  }, []);

  const q = query(collection(database, "record"));
  const unsubscribe = onSnapshot(q, () => {
    getHistory().then((history) => setHistory(history));
  });
  console.log(unsubscribe);

  return (
    <table>
      <tr>
        <th>Player 1</th>
        <th>Player 2</th>
        <th>Winner</th>
      </tr>
      {history?.map((game, index) => (
        <tr key={game.date + index}>
          <td>{game.player_1}</td>
          <td>{game.player_2}</td>
          <td>{game.winner}</td>
        </tr>
      ))}
    </table>
  );
};
