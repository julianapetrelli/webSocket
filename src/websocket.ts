import { io } from "./http"

io.on("connectioon", socket => {
    console.log(socket.id)
});
