import app from "./app.js";
import { env } from "./config/env.js";

const databaseUrl = new URL(env.DATABASE_URL);
const databasePort = databaseUrl.port;

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);


  console.log(`Database running on port ${databasePort}`);
});

server.on("error", (error) => {

  console.error("Server failed to start", error);
  
  process.exit(1);
});
