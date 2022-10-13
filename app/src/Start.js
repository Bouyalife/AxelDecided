import {BrowserRouter as Router,Routes,Route,Redirect,Link} from "react-router-dom";
import React,{useEffect,useState} from "react";
import App from "./App";

function Start({socket}) {
    const lobbies = [];
  
    const [addLobbiesShown, setVisibility] = useState(false);
    const [lobbyName,setLobbyName] = useState("");
    const [lobbyPlayers,setLobbyPlayers] = useState("");
    const [lobbyNumber,setLobbyNumber] = useState("");
    const [lobby,addLobbies] = useState(lobbies);

    const [test,setTest] = useState(false);

    useEffect(()=>{
        socket.on("gameCreated",(data)=>{
            setLobbyName(data.lobbyName);
            setLobbyNumber(data.lobbyNumber);
            setLobbyPlayers(data.lobbyPlayers);
            createGame();
            console.log(data.lobbyName + "-" + data.lobbyNumber + "-" + data.lobbyPlayers);
        });
        socket.on("startInfo",(data)=>{
            setLobbyName(data.lobbyName);
            setLobbyNumber(data.lobbyNumber);
            setLobbyPlayers(data.lobbyPlayers);
            createGame();
            console.log(data.lobbyName+"-" +data.lobbyNumber + "-" + data.lobbyPlayers);
        })
    },[socket]);

    useEffect(()=>{
        socket.emit("getInfo");
    },[])
  
    const addLobby = () => {
      setVisibility(addLobbiesShown => !addLobbiesShown);
    }

    const joinRoom = (event1) =>{
        socket.emit("joinRoom",event1);
    };

    const createLobby = (event) => {
        event.preventDefault();
        socket.emit("createLobby",lobbyName,lobbyNumber,lobbyPlayers);
        createGame();
    }

    const createGame = () => {
    addLobbies(prev => [
        {
            n: lobbyName,
            number: lobbyNumber,
            players: lobbyPlayers, 
        },
        ]);
    }

    return(
    <div>
        <header className="App-header">
            <h1>Axel Decides</h1>
        </header>

        <div className="App-body">
            <body>
                <div>
                    <h2>Lobbies</h2>
                    {lobby.map((l,index) =>(
                        <li key={index}>
                            <Link to={`/Game/${index}`}>Lobby<button onClick={joinRoom(index)}>Join!</button></Link>
                        </li>
                    ))}
                </div>
                <div className="AddLobbiesBtn">
                    <button onClick={addLobby}>+</button>
                </div>
            </body>
        </div>

        <div className="addLobbiesPopUp" style={{display: addLobbiesShown ? "block": "none"}}>
            <form>
                <h1>Create Lobby</h1>
                <div className="addLobbyLabels">
                    <label>Lobby name</label>
                    <input type="text" onChange={e => setLobbyName(e.target.value)}></input>
                </div>
                <div className="addLobbyLabels">
                    <label>amount of players</label>
                    <input type="number" onChange={e=>{setLobbyPlayers(e.target.value)}}></input>
                </div>
                <div className="addLobbyLabels">
                    <label>Choose number</label>
                    <input type="number" onChange={e => {setLobbyNumber(e.target.value)}}></input>
                </div>
                <div>
                    <button onClick={createLobby.bind(this)}>Create lobby</button>
                </div>
            </form>
        </div>
    </div>
    );
}

export default Start;