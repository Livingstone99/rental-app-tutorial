let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      // path:"/socket/path",
      // transports: ['websocket','polling'],
      cors: {
        origin: "*:*"
      },
      forceNew: true
    });
    return io;
  },

  getIO: () => {
    return io;
  }
};
