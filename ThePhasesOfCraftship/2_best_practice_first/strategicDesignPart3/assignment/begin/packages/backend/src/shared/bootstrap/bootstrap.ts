import { CompositionRoot } from "../compositionRoot/compositionRoot";
import { Config } from "../config/config";

const config = new Config("start");

const composition = CompositionRoot.createCompositionRoot(config);
const webServer = composition.getWebServer();
const dbConnection = composition.getDBConnection();

export async function bootstrap() {
  await dbConnection.connect();
  await webServer.start();
}

export const app = webServer.getHttp(); // This get http could be wrong. to fix go back to lesson and fill out how he created his webserver
export const database = dbConnection;
