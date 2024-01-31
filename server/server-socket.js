let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getAllConnectedUsers = () => Object.values(socketToUserMap);
const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

lobbyUsers = {};

let activeUsers = new Set();

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];

  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
  activeUsers.add(user);
  console.log("the user for socket " + socket.id + " is " + user);
  console.log("active users", activeUsers);
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

const removeUser = (user, socket) => {
  if (user) {
    delete userToSocketMap[user._id];
  }
  delete socketToUserMap[socket.id];
  activeUsers.delete(user);
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);

      socket.on("submitPrompt", () => {
        console.log("prompt submitted yoooo by " + socket.id);
        const user = getUserFromSocketID(socket.id);
        activeUsers.delete(user);
        console.log("active users", activeUsers);

        if (activeUsers.size === 0) {
          // once all players have submitted a prompt
          io.emit("allPromptsSubmitted");
          activeUsers = new Set(getAllConnectedUsers());
        }
      });

      socket.on("getNumPlayers", (code) => {
        // Filter the lobbyUsers to find users with the specified code
        const numPlayersWithCode = Object.values(lobbyUsers).filter(
          (userCode) => userCode === code
        ).length;

        // Emit the number of players with the specific code
        io.emit("numPlayersUpdate", numPlayersWithCode);
      });

      socket.on("startGame", (code) => {
        io.emit("gameStarted", code);
      });

      // Example event for a user joining the lobby
      socket.on("joinLobby", (props) => {
        const user = getUserFromSocketID(props.socket_id);
        if (user) {
          lobbyUsers[user.name] = props.game_id; // Add user to lobby
        }
        
        io.emit("lobbyUsersUpdate", { lobbyUsers }); // Emit updated list to all clients
      
        // Find the first user in the lobby for the specific game
        const firstUserInLobby = Object.keys(lobbyUsers).find(userName => lobbyUsers[userName] === props.game_id);
      
        if (firstUserInLobby) {
          // Loop over all connected users to find the one with the same name as firstUserInLobby
          const allConnectedUsers = getAllConnectedUsers();
          const matchingUser = allConnectedUsers.find(connectedUser => connectedUser.name === firstUserInLobby);
      
          if (matchingUser) {
            // If a matching user is found, get their socket using the userToSocketMap
            const matchingUserSocket = userToSocketMap[matchingUser._id];
            
            if (matchingUserSocket) {
              // Emit assignHost event with the first user found in the lobby
              io.to(matchingUserSocket.id).emit("assignHost", { game_id: props.game_id });
            }
          }
        }
      });
      

      // Example event for a user leaving the lobby
      socket.on("leaveLobby", (props) => {
        const user = getUserFromSocketID(props);
        if (user) {
          delete lobbyUsers[user.name]; // Remove user from lobby
        }
        io.emit("lobbyUsersUpdate", { lobbyUsers }); // Emit updated list to all clients
      });

      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);

        // Remove user from lobby if they were in it
        for (let userName in lobbyUsers) {
          if (user != undefined && lobbyUsers[userName] === user.name) {
            delete lobbyUsers[userName];
            break;
          }
        }
        io.emit("lobbyUsersUpdate", { lobbyUsers }); // Emit updated list to all clients

        if (user) {
          user.gameid = "####";
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
