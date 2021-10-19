const express = require("express");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const settings = require("./settings");

const server = express();

server.set("view engine", "pug");
server.set("views", "./views");

server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use("/public", express.static('public'));
server.use("/", routes);

server.listen(settings.listen_port, settings.listen_ip, () => {
    console.log(`Server started at http://${settings.listen_ip}:${settings.listen_port}`);
});
