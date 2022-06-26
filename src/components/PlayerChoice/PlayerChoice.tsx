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

  h3, h4 {
    margin: 8px 0;
  }
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

const BallGroup = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
`;

const BallDisplay = styled.li`
  list-style: none;
  border-radius: 50%;
  font-size: 1px;
`;

const BallButton = styled.button`
  border: 1px solid black;
  height: 30px;
  width: 30px;
  background-color: ${props => props.color};
  color: ${props => props.color};
  list-style: none;
  border-radius: 50%;
  font-size: 1px;
`;

const MoreDetailsContainer = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  padding: 8px;
`
const AddResultContainer = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  width: 75%;
  margin: 0 auto;
  

  & > div {
    display: flex;
    gap: 8px;
    
  }
`

type Player = {
  name: string;
};
type Ball = 'red' | 'yellow' | 'black'

export const PlayerChoice = (props: { onUpdate: () => void }) => {
  const [playerOne, setPlayerOne] = React.useState<Player | null>(null);
  const [playerTwo, setPlayerTwo] = React.useState<Player | null>(null);
  const [winner, setWinner] = React.useState<Player | null>(null);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false)
  const [game, setGame] = React.useState<Ball[]>([])

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
        game,
        foulWin: game.filter(c => c === 'yellow').length < 7 &&  game.filter(c => c === 'red').length < 7,
        sevenedWin: (game.filter(c => c === 'yellow').length === 0 &&  game.filter(c => c === 'red').length === 7) || (game.filter(c => c === 'red').length === 0 &&  game.filter(c => c === 'yellow').length === 7)
      });
      setPlayerOne(null);
      setPlayerTwo(null);
      setWinner(null);
      setLoading(false)
      setGame([])
      props.onUpdate();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const addBall = (color: Ball) => {
    const numberOfRed = game.filter(c => c === 'red')
    const numberOfYellow = game.filter(c => c === 'yellow')
    const numberOfBlack = game.filter(c => c === 'black')

    if(color === 'red' && numberOfRed.length < 7 && numberOfBlack.length < 1){
      setGame([...game, color])
    }

    if(color === 'yellow' && numberOfYellow.length < 7 && numberOfBlack.length < 1){
      setGame([...game, color])
    }

    if(color === 'black' && numberOfBlack.length < 1){
      setGame([...game, color])
    }
  }

  const removeBall = (index: number) =>{
    const newGame = [...game]
    newGame.splice(index, 1)
    setGame(newGame)
  }

  return (
    <PlayerChoiceContainer>
      {playerOne && playerTwo && <div>Pick a winner</div>}

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
            <MoreDetailsContainer>
              <AddResultContainer>
                <h3>Add Full result</h3>
                <div>
                  <BallButton color="yellow" onClick={() => addBall('yellow')}>Yellow</BallButton>
                  <BallButton color="red" onClick={() => addBall('red')}>Red</BallButton>
                  <BallButton color="black" onClick={() => addBall('black')}>Black</BallButton>
                </div>
              </AddResultContainer>
              <BallGroup>
                  {game.map((ball, index) => {
                    return (
                      <BallDisplay key={`ball-${index}`}>
                        <BallButton onClick={() => removeBall(index)} color={ball}>{ball}</BallButton>
                      </BallDisplay>
                    )
                  })}
              </BallGroup>
            </MoreDetailsContainer>
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
