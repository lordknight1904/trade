/**
 * Client Socket handle
 */
const io = require('socket.io-client');
export default class ChatSocket {
  constructor() {
    this.userID = null;
    this.connected = false;
    this.socket = io.connect('http://localhost:8000');
  }

  doConnect(user) {
    this.userID = user.id;
    this.socket.emit('NewUserConnect', user);
    this.connected = true;
  }
  registerUserId(id) {
    this.socket.emit('registerUserId', id);
  }

  disconnect() {
    if (this.connected === true) {
      this.userID = null;
      this.connected = false;
      this.socket.disconnect();
    }
  }

  listening(callback) {
    this.socket.on('checkingAlive', () => {
      this.socket.emit('stillAlive', {});
      callback('hello');
    });
    this.socket.on('updateOrderList', (message) => {
      callback(message);
    });
    this.socket.on('ordersAndHold', (message) => {
      callback(message);
    });
    this.socket.on('ordersIndividualAndHold', (message) => {
      callback(message);
    });
  }
}
