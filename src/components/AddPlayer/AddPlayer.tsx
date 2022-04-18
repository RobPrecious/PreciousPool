import React, { ChangeEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { database } from "../../utils/firebase";

export const AddPlayer = () => {
  const [playerName, setPlayerName] = React.useState<string>("");

  const addPlayerToFirestore = async () => {
    try {
      const docRef = await addDoc(collection(database, "players"), {
        name: playerName,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <label>
        Name:
        <input
          type="text"
          value={playerName}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPlayerName(event.target.value)
          }
        />
      </label>
      <button onClick={addPlayerToFirestore}>Add Player</button>
    </>
  );
};
