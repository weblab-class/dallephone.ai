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

      // Example event for a user joining the lobby
      socket.on('joinLobby', (code) => {
        const user = getUserFromSocketID(socket.id);
        lobbyUsers[user._id] = code; // Add user to lobby
        io.emit('lobbyUsersUpdate', { lobbyUsers }); // Emit updated list to all clients
      });

      // Example event for a user leaving the lobby
      socket.on('leaveLobby', () => {
        const user = getUserFromSocketID(socket.id);
        delete lobbyUsers[user._id]; // Remove user from lobby
        io.emit('lobbyUsersUpdate', { lobbyUsers }); // Emit updated list to all clients
      });
      
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
        activeUsers.delete(socket.id);

        // Remove user from lobby if they were in it
        for (let userId in lobbyUsers) {
          if (lobbyUsers[userId] === user._id) {
            delete lobbyUsers[userId];
            break;
          }
        }
        io.emit('lobbyUsersUpdate', { lobbyUsers }); // Emit updated list to all clients
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
