import { CompositionRoot } from "shared/composition/compositionRoot";
import { Config } from "backend/src/shared/config/config";

const config = new Config("start");

const composition = CompositionRoot.createCompositionRoot(config);
const webServer = composition.getWebServer();
const dbConnection = composition.getDBConnection();

export async function bootstrap() {
  await dbConnection.connect();
  await webServer.start();
}

export const app = webServer.getApplication();
export const database = dbConnection;