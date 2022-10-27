import { io } from "./http";

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  room: string;
  text: string;
  createdAt: Date;
  username: string;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

// create server websocket
io.on("connection", (socket) => {
  socket.on("select_room", (data, callback) => {
    socket.join(data.room);

    const messagesRoom = getMessagesRoom(data.room);
    const userInRoom = users.find((user) => {
      user.room === data.room && user.username === data.username;
    });

    // retrieving messages sent in chat room
    callback(messagesRoom);

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
      return;
    }

    users.push({
      socket_id: socket.id,
      username: data.username,
      room: data.room,
    });

    socket.on("message", (data) => {
      
      // save messages
      const message: Message = {
        room: data.room,
        username: data.username,
        text: data.message,
        createdAt: new Date(),
      };

      messages.push(message);

      // send to room users
      io.to(data.room).emit("message", message);
    });
  });
});

function getMessagesRoom(room: string) {
    const messagesRoom = messages.filter((message) => message.room === room);
    return messagesRoom;
}
