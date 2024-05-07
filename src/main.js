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
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectMongo from "connect-mongo"; // Importa connect-mongo
import mongoose from "mongoose"; // Asegúrate de importar mongoose
import { createRoles } from "./config/initialSetup.js";
import authRouter from "./routes/auth.routes.js";
import cookieRouter from "./routes/cookies.routes.js";
import sessionRouter from "./routes/session.routes.js";


const app = express();
createRoles();
const PUERTO = 8080;

app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(cookieParser(process.env.SECRETCOOKIE));
app.use(bodyParser.urlencoded({ extended: true }))

// Crea una instancia de MongoStore utilizando la conexión de mongoose
const store = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'session' // Nombre de la colección para las sesiones
  });
// Configura express-session con connect-mongo
const MongoStore = connectMongo(session);
// Conecta mongoose a la base de datos
mongoose.connect("mongodb+srv://fmalbran93:coderhouse@clustercoder.nqsqgsl.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=ClusterCoder");



app.use(
  session({
    secret: "SECRETSESSION",
    resave: true,
    saveUninitialized: true,
    store: store // Usa la instancia de MongoStore creada
  })
);
 
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", routerProduct);
app.use("/", routerViews);
app.use("/api/carts", routerCart);
app.use("/api/auth", authRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/session", sessionRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});


const socketServer = new Server(httpServer); // Creamos una nueva instancia de 'Server' con 'httpServer'

socketProducts(socketServer);
socketChat(socketServer);

