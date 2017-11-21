/**
 * Server socket handle
 */
import SocketIO from 'socket.io';

const connections = {};
var io = {};
// Store static instance for another file import
export var serverSocketStaticInstance = null;

export function updateOrderListToAll(message) {
  if (io.hasOwnProperty('sockets')) {
    io.sockets.emit('updateOrderList', { code: 'updateOrderList', coin: message.coin });
  }
}
export function ordersAndHold(message) {
  console.log(message);
  for (const socket in connections) {
    if (connections[socket].userID.toString() === message.idFrom.toString() ||
        connections[socket].userID.toString() === message.idTo.toString()
    ) {
      io.to(socket).emit('ordersAndHold', { code: 'ordersAndHold', coin: message.coin });
    } else {
      io.to(socket).emit('updateOrderList', { code: 'updateOrderList', coin: message.coin });
    }
  }
}
export function ordersIndividualAndHold(message) {
  for (const socket in connections) {
    if (connections[socket].userID.toString() === message.id.toString()) {
      io.to(socket).emit('ordersIndividualAndHold', { code: 'ordersIndividualAndHold', coin: message.coin });
    } else {
      io.to(socket).emit('updateOrderList', { code: 'updateOrderList', coin: message.coin });
    }
  }
}
export function updateProfile(userId) {
  for (const socket in connections) {
    if (connections[socket].userID.toString() === userId.toString()) {
      io.to(socket).emit('updateProfile', {});
      break;
    }
  }
}

export default class ServerSocketIO {
  constructor(httpServer) {
    io = new SocketIO(httpServer);
    this.checkAlive();
  }
  beginListen() {
    // Using Socket.io Communication
    io.sockets.on('connection', (socket) => {
      socket.on('NewUserConnect', (user) => {
        let userID = user.id;
        socket._id = userID;
        this.addSocketToUser(userID, socket.id);
        // console.log('NewUserConnect', userID);
        // console.log(connections);
        // console.log('------------------------------');
      });
      socket.on('stillAlive', () => {
        connections[socket.id].alive = true;
      });
      socket.on('userStatistic', (callback) => {
        let counter = 0;
        let regCounter = 0;
        let guestCounter = 0;
        for (const socket in connections) {
          if (connections[socket].alive) {
            counter++;
            if (connections[socket].userID === 'guest') {
              guestCounter++;
            } else {
              regCounter++;
            }
          }
        }
        callback({ current: counter, req: regCounter, guest: guestCounter });
        socket.emit('userStatistic', { current: counter, req: regCounter, guest: guestCounter });
      });
    });
    serverSocketStaticInstance = this;
  }

  addSocketToUser(userID, socketID) {
    const info = {
      userID,
      alive: true,
      timer: setInterval(() => { this.checkAlive(socketID); }, 30000),
    };
    connections[socketID] = info;
  }

  checkAlive = (socketID) => {
    if (connections[socketID]) {
      if (connections[socketID].alive) {
        io.to(socketID).emit('checkingAlive', {});
        connections[socketID].alive = false;
      } else {
        clearInterval(connections[socketID].timer);
      }
    }
  };
}
