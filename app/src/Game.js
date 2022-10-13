import React,{useEffect,useState} from "react";
import './Game.css'
export default function Game({socket}) {

    var arrayInit = [];
    var t = 0;
    const [lobbyName,setLobbyName] = useState();
    const [lobbyNumber,setLobbyNumber] = useState();
    const [lobbyPlayers,setLobbyPlayers] = useState();
    const [values,setValues] = useState(arrayInit);
    const [yourValue,setYourValue] = useState(t);
    const [test1,setTest] = useState(false);
    const [testing,setTesting] = useState("");
    const [disable,setDisabled] = useState(false);

    useEffect(() =>{
        console.log("JALLAHAKBHAR");
        socket.on("startInfo",(data) =>{
            setLobbyName(data.lobbyName);
            setLobbyNumber(data.lobbyNumber);
            setLobbyPlayers(data.lobbyPlayers);
            console.log("datat" + data.lobbyPlayers);
            
            setValues(Array.from(Array(Number(data.lobbyPlayers)).keys()));
        })

        socket.on("number",(data)=>{
            console.log("ggfdgfgdfgdgf " + data.number);
            test(data.number);
        })

        socket.on("checkWinner",(data)=>{
            console.log("gg: " + data.number + " - " + localStorage.getItem("key"));
            if(data.number === localStorage.getItem("key")) {
                console.log("value: " + yourValue);
                socket.emit("loser",localStorage.getItem("key"));
            }else{
                console.log("value2: " + yourValue);
                socket.emit("winner");
            }
        })

        socket.on("done",(data)=>{
            setTesting(data.number);
        })
    },[socket]);

    useEffect(()=>{
        socket.emit("getInfo");
    },[])

    const test = (event) => {
        document.getElementById(event).disabled = true;
    };
    
    const onClick = (event) =>{
        setYourValue(event.target.value);

        console.log("myvalue: " + event.target.value + " - " + yourValue);
    }

    useEffect(()=>{
        console.log("abc");
        if(test1 === false){
            setTest(true);
        }else{
            localStorage.setItem("key",yourValue);
            setDisabled(true);
            document.getElementById(localStorage.getItem("key")).style.background = "green";
            test(yourValue)
            socket.emit("sendNumber",yourValue);
        }
    },[yourValue])

    return(
       <div className="gameBody">
            <h1 className="roomheader">ROOM:{lobbyName}</h1>
                {values.map((l,index) =>(
                    <button className="button" disabled={disable} id={index} value={index} onClick={onClick}>{index}</button>
                ))}
            <div>
                <h1>{testing}</h1>
            </div>
        </div>
       
    );
}
