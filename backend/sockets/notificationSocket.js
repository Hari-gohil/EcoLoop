let io;

const setupNotificationSocket = (socketIo) => {
  io = socketIo;
};

const getIo = () => io;

module.exports = {
  setupNotificationSocket,
  getIo
};
