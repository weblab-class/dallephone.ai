let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getAllConnectedUsers = () => Object.values(socketToUserMap);
const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const lobbyUsers = {};
const usersInLobby = {}; // given game_id, returns set of users. used to check if all users have submitted prompts
const hasSubmittedPrompt = {}; // given game_id, returns set of users who have submitted prompts

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

      socket.on("submitPrompt", ({ senderID, gameID }) => {
        const user = getUserFromSocketID(senderID);
        if (user === undefined) {
          console.log("user submitPrompt was not found, smth wrong with socket emit message");
        }
        if (gameID in hasSubmittedPrompt) {
          hasSubmittedPrompt[gameID].add(user);
        } else {
          hasSubmittedPrompt[gameID] = new Set([user]);
        }

        if (hasSubmittedPrompt[gameID].size === usersInLobby[gameID].size) {
          // once all players have submitted a prompt
          console.log("game_id", gameID);
          console.log("hasSubmittedPrompt", hasSubmittedPrompt);
          console.log("usersInLobby", usersInLobby);
          for (const user of usersInLobby[gameID]) {
            const userSocket = userToSocketMap[user._id];
            if (userSocket) {
              userSocket.emit("allPromptsSubmitted");
            }
          }
          delete hasSubmittedPrompt[gameID];
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

      socket.on("getNumPlayers2", (props) => {
        // Filter the lobbyUsers to find users with the specified code
        const numPlayersWithCode = Object.values(lobbyUsers).filter(
          (userCode) => userCode === props.code
        ).length;

        // Emit the number of players with the specific code
        io.to(props.socket_id).emit("numPlayersUpdate2", numPlayersWithCode);
      });

      socket.on("startGame", (code) => {
        io.emit("gameStarted", code);
      });

      // Example event for a user joining the lobby
      socket.on("joinLobby", (props) => {
        const user = getUserFromSocketID(props.socket_id);
        if (user) {
          lobbyUsers[user.name] = props.game_id; // Add user to lobby
          if (props.game_id in usersInLobby) {
            usersInLobby[props.game_id].add(user);
          } else {
            usersInLobby[props.game_id] = new Set([user]);
          }
        }

        io.emit("lobbyUsersUpdate", { lobbyUsers }); // Emit updated list to all clients

        // Find the first user in the lobby for the specific game
        const firstUserInLobby = Object.keys(lobbyUsers).find(
          (userName) => lobbyUsers[userName] === props.game_id
        );

        if (firstUserInLobby) {
          // Loop over all connected users to find the one with the same name as firstUserInLobby
          const allConnectedUsers = getAllConnectedUsers();
          const matchingUser = allConnectedUsers.find(
            (connectedUser) => connectedUser.name === firstUserInLobby
          );

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
        if (user !== undefined && user.name in lobbyUsers) {
          usersInLobby[lobbyUsers[user.name]].delete(user);
          delete lobbyUsers[user.name]; // Remove user from lobby
        }
        io.emit("lobbyUsersUpdate", { lobbyUsers }); // Emit updated list to all clients
      });

      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);

        // Remove user from lobby if they were in it
        if (user !== undefined && user.name in lobbyUsers) {
          usersInLobby[lobbyUsers[user.name]].delete(user);
          delete lobbyUsers[user.name];
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
