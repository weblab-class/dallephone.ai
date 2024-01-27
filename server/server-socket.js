let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getAllConnectedUsers = () => Object.values(socketToUserMap);
const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

lobbyUsers={};

let activeUsers = new Set();

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];

  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  console.log("adding user, user", user);

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

const removeUser = (user, socket) => {
  if (user) {
    delete userToSocketMap[user._id];
  }
  delete socketToUserMap[socket.id];
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      console.log("active users", userToSocketMap);
      activeUsers.add(socket.id);

      socket.on("submitPrompt", () => {
        activeUsers.delete(socket.id);

        if (activeUsers.size === 0) {
          // once all players have submitted a prompt
          io.emit("allPromptsSubmitted");
          activeUsers = new Set(Object.keys(io.sockets.sockets));
        }
      });

      socket.on('getNumPlayers', (code) => {
        // Filter the lobbyUsers to find users with the specified code
        const numPlayersWithCode = Object.values(lobbyUsers).filter(userCode => userCode === code).length;
    
        // Emit the number of players with the specific code
        io.emit('numPlayersUpdate', numPlayersWithCode);
      });
    
      socket.on('checkHost', (props) => {
        const user = getUserFromSocketID(props.socket_id);
        const numPlayersWithCode = Object.values(lobbyUsers).filter(userCode => userCode == props.game_id).length;
        if(user){
          const isHost = (lobbyUsers[user._id] === props.game_id && numPlayersWithCode === 1);
          socket.emit('assignHost', { isHost: isHost });
        }
      });

      socket.on('startGame', (code) => {
        io.emit('gameStarted', code)
      });

      // Example event for a user joining the lobby
      socket.on('joinLobby', (props) => {
        console.log("props", props)
        const user = getUserFromSocketID(props.socket_id);
        console.log("user", user)
        console.log("socket to user map", socketToUserMap)
        if(user){
          console.log("in join lobby, user", user);
          lobbyUsers[user._id] = props.game_id; // Add user to lobby
        }
        io.emit('lobbyUsersUpdate', { lobbyUsers }); // Emit updated list to all clients
      });

      // Example event for a user leaving the lobby
      socket.on('leaveLobby', (props) => {
        const user = getUserFromSocketID(props);
        if(user){
          delete lobbyUsers[user._id]; // Remove user from lobby
        }
        io.emit('lobbyUsersUpdate', { lobbyUsers }); // Emit updated list to all clients
      });
      
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
        activeUsers.delete(socket.id);

        // Remove user from lobby if they were in it
        for (let userId in lobbyUsers) {
          if (user!=undefined && lobbyUsers[userId] === user._id) {
            delete lobbyUsers[userId];
            break;
          }
        }
        io.emit('lobbyUsersUpdate', { lobbyUsers }); // Emit updated list to all clients
        
        if (user){
          user.gameid = '####';
        }
      });

      
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getAllConnectedUsers: getAllConnectedUsers,
  getIo: () => io,
};
