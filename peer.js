// Peer configuration
const { ExpressPeerServer } = require("peer");

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

module.exports = {
  init: (server) => {
    const peerServer = ExpressPeerServer(server, {
      debug: true,
      path: "/",
      generateClientId: uuidv4()
    });
    return peerServer;
  }
};
