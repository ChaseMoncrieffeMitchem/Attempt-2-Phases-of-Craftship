import Server from "./index";

const PORT = Number(process.env.PORT || 3000);

Server.start(PORT);