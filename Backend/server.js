const server = require("http").createServer(require("express"));
const io = require("socket.io")(server,{
    cors: {
        origins:["http://localhost:3000"]
    }
})

var clients = 0;
var winner = 0;
var savedLobbyName = 0;
var savedLobbyNumber = 0;
var savedLobbyPlayers = 0;
var roomName = "";

io.on("connection",(socket) =>{
    console.log("test");
    console.log(clients);

    socket.on("joinRoom",(roomname) =>{
        socket.join(roomname);
    });

    socket.on("getInfo",()=>{
        console.log(savedLobbyPlayers);
        socket.emit("startInfo",{lobbyName:savedLobbyName,lobbyNumber:savedLobbyNumber,lobbyPlayers:savedLobbyPlayers});
    })

    socket.on("disconnect",()=>{
        console.log("Client disconnected")
        console.log(clients);
    })

    socket.on("createLobby",(lobbyName,lobbyNumber,lobbyPlayers)=>{
        console.log("create lobby: " + lobbyName + "-" +lobbyNumber + "-" + lobbyPlayers);
        savedLobbyName = lobbyName;
        savedLobbyNumber = lobbyNumber;
        savedLobbyPlayers = lobbyPlayers;
        roomName = lobbyName;
        clients = 0;
        winner = 0;
        socket.broadcast.emit("gameCreated",{lobbyName:lobbyName,lobbyNumber:lobbyNumber,lobbyPlayers:lobbyPlayers});
    })

    socket.on("sendNumber",(recievedData)=>{
        socket.broadcast.emit("number",{number:recievedData});
        clients++;
        if(clients == savedLobbyPlayers-1) {
           socket.emit("checkWinner",{number:savedLobbyNumber});
        }
        console.log("Number choosen: " + recievedData);
    })

    socket.on("winner",()=>{
        winner++;
        console.log("Winner: " + winner);
        if(winner == savedLobbyPlayers-1){
            socket.emit("done",{number:"lobby leaders loses"});
        }
    })
    
    socket.on("loser",(data)=>{
        io.emit("done",{number:"Bitch nr " + data + " loses"});
    })
})


const port = 8000;
var serverPort = server.listen(port,console.log(`Server up on port:  ${(port)}`));
