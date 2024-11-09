import { CreateUserDTO } from "@dddforum/shared/dtos/user/createUserDTO";
// import request from "supertest";
import * as path from "path";
import { CreateUserInputBuilder } from "@dddforum/frontend/tests/builders/user/createUserBuilder";
import { RESTfulAPIDriver } from "@dddforum/shared/http/apiDriver";
import { CompositionRoot } from "@dddforum/backend/src/shared/compositionRoot/compositionRoot";
import { Config } from "@dddforum/backend/src/shared/config/config";

describe("User Registration", () => {
  let driver: RESTfulAPIDriver;
  let server: any;
  let dbConnection: any;
  let composition: CompositionRoot;
  let config: Config = new Config("test:e2e");

  beforeAll(async () => {
    composition = CompositionRoot.createCompositionRoot(config);
    server = composition.getWebServer();
    dbConnection = composition.getDBConnection();
    driver = new RESTfulAPIDriver(server);

    await server.start();
    await dbConnection.connect();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should successfully register a new user and accept marketing emails", async () => {
    let createUserResponse: any = {};
    let addEmailToMarketingList: any = {};
    let createUserInput: CreateUserDTO;

    // Given: I am a new user
    createUserInput = new CreateUserInputBuilder()
      .withFirstName("")
      .withLastName("")
      .withUsername("")
      .withEmail("")
      .build();

    console.log("Create User Input:", createUserInput);

    // When: I register with valid account details accepting marketing emails
    createUserResponse = await driver.post("/users/new", createUserInput);

    console.log("Create User Response:", createUserResponse);

    addEmailToMarketingList = await driver.post("/marketing/new", {
      email: createUserResponse.body.data?.email,
    });

    // Then: I should be granted access to my account
    const { data, success } = createUserResponse.body;

    expect(success).toBeTruthy();
    expect(data!.id).toBeDefined();
    expect(data!.email).toEqual(createUserInput.email);
    expect(data!.firstName).toEqual(createUserInput.firstName);
    expect(data!.lastName).toEqual(createUserInput.lastName);
    expect(data!.username).toEqual(createUserInput.username);

    // And: I should expect to receive marketing emails
    const marketingResponse = addEmailToMarketingList.body;
    expect(addEmailToMarketingList.status).toBe(201);
    expect(marketingResponse.success).toBeTruthy();
  });
});
