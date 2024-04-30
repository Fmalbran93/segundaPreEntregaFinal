import express from "express";
import { __dirname } from "./path.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import routerProduct from "./routes/productos.routes.js";
import routerViews from "./routes/views.routes.js";
import routerCart from "./routes/cart.routes.js";
import socketProducts from "./listeners/socketProducts.js";
import socketChat from "./listeners/socketChat.js";
import "./database.js";

const app = express();
const PUERTO = 8080;

app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", routerProduct);
app.use("/", routerViews);
app.use("/api/carts", routerCart);


const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});


const socketServer = new Server(httpServer); // Creamos una nueva instancia de 'Server' con 'httpServer'

socketProducts(socketServer);
socketChat(socketServer);


 