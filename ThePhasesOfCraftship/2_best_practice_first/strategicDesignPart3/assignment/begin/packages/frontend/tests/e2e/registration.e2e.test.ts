import { createUserDTO } from "@dddforum/shared/dtos/user/createUserDTO";
// import request from "supertest";
import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from "path";
import { CreateUserInputBuilder } from "../builders/user/createUserBuilder";
import { Server } from "http";
import { WebServer } from "@dddforum/shared/http/webServer";
import { RESTfulAPIDriver } from "@dddforum/shared/http/apiDriver";
import { CompositionRoot } from "@dddforum/shared/composition/compositionRoot";

const feature = loadFeature(
  path.join(__dirname, "../features/registration.feature")
);

defineFeature(feature, (test) => {
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;

  beforeAll(async () => {
    await webServer.start(3001);
    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3001);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserResponse: any = {};
    let addEmailToMarketingList: any = {};
    let createUserInput: createUserDTO;

    given("I am a new user", () => {
      createUserInput = new CreateUserInputBuilder()
        .withFirstName("")
        .withLastName("")
        .withUsername("")
        .withEmail("")
        .build();
    });

    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        createUserResponse = await driver?.post("/users/new", createUserInput);

        addEmailToMarketingList = await driver?.post("/marketing/new", {
          email: createUserResponse.body.data?.email,
        });
      }
    );

    then("I should be granted access to my account", () => {
      const { data, success } = createUserResponse.body;

      expect(success).toBeTruthy();
      expect(data!.id).toBeDefined();
      expect(data!.email).toEqual(createUserInput.email);
      expect(data!.firstName).toEqual(createUserInput.firstName);
      expect(data!.lastName).toEqual(createUserInput.lastName);
      expect(data!.username).toEqual(createUserInput.username);
    });

    and("I should expect to receive marketing emails", () => {
      const { success } = addEmailToMarketingList.body;

      expect(addEmailToMarketingList.status).toBe(201);
      expect(success).toBeTruthy();
    });
  });

  test("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserInput: createUserDTO;
    let createUserResponse: any = {};
    let declineMarketingEmails: any = {};

    given("I am a new user", async () => {
      createUserInput = new CreateUserInputBuilder()
        .withFirstName("")
        .withLastName("")
        .withUsername("")
        .withEmail("")
        .build();

      createUserResponse = await driver?.post("/users/new", createUserInput);
    });

    when(
      "I register with valid account details declining marketing emails",
      async () => {
        declineMarketingEmails = await driver?.post("/marketing/negative", {
          email: createUserResponse.body.data?.email,
        });
      }
    );

    then("I should be granted access to my account", () => {
      const { data, success } = createUserResponse.body;

      expect(success).toBeTruthy();
      expect(data!.id).toBeDefined();
      expect(data!.email).toEqual(createUserInput.email);
      expect(data!.firstName).toEqual(createUserInput.firstName);
      expect(data!.lastName).toEqual(createUserInput.lastName);
      expect(data!.username).toEqual(createUserInput.username);
    });

    and("I should not expect to receive marketing emails", () => {
      const { success } = declineMarketingEmails.body;
      expect(success).toBeTruthy();
    });
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserInput: createUserDTO;
    let createUserResponse: any = {};

    given("I am a new user", () => {
      createUserInput = new CreateUserInputBuilder()
        .withFirstName("")
        .withLastName("")
        .withUsername("")
        .withEmail("invalidEmail")
        .build();
    });

    when("I register with invalid account details", async () => {
      createUserResponse = await driver?.post("/users/new", createUserInput);
    });

    then("I should see an error notifying me that my input is invalid", () => {
      const { error } = createUserResponse.body;
      expect(error).toBeDefined();
    });

    and("I should not have been sent access to account details", () => {
      const { success } = createUserResponse.body;
      expect(success).toBeFalsy();
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    let userInputs: createUserDTO[] = [];
    let createUserResponses: any[] = []; // Specify the type of responses

    given("a set of users already created accounts", (table: any[]) => {
      userInputs = table.map((row: any) => {
        return new CreateUserInputBuilder()
          .withFirstName(row.firstName)
          .withLastName(row.lastName)
          .withUsername(row.userName)
          .withEmail(row.email)
          .build();
      });
    });

    when("new users attempt to register with those emails", async () => {
      createUserResponses = await Promise.all(
        userInputs.map((userInput) => {
          return driver?.post("/users/new", userInput);
        })
      );
    });

    then(
      "they should see an error notifying them that the account already exists",
      () => {
        for (const response of createUserResponses) {
          expect(response.error).toBeDefined();
          expect(response.success).toBeFalsy();
          expect(response.body.error).toEqual("EmailAlreadyInUse");
        }
      }
    );

    and("they should not have been sent access to account details", () => {
      createUserResponses.forEach((response) => {
        expect(response.body.success).toBe(false);
        expect(response.data).toBe(undefined);
        expect(response.body.error).toBeDefined();
      });
    });
  });

  test("Username already taken", ({ given, when, then, and }) => {
    let createUserResponses: any[] = []
    let createUsersInput: any[] = []

    given(
      "a set of users have already created their accounts with valid details",
      async (table: any[]) => {

        createUsersInput = table.map((row) => {
          return new CreateUserInputBuilder()
          .withFirstName(row.firstName)
          .withLastName(row.lastName)
          .withUsername(row.username)
          .withEmail(row.email)
          .build()
        }) 

        createUserResponses = await Promise.all(
          createUsersInput.map((userInput) => {
            return driver?.post('/users/new', userInput)
          })
        )
        console.log(createUserResponses[0].body)
      }
    );

    when(
      "new users attempt to register with already taken usernames",
      async (table: any[]) => {

        createUsersInput = table.map((row) => {
          return new CreateUserInputBuilder()
          .withFirstName(row.firstName)
          .withLastName(row.lastName)
          .withUsername(row.username)
          .withEmail(row.email)
          .build()
        }) 

        createUserResponses = await Promise.all(
          createUsersInput.map((userInput) => {
            return driver?.post('/users/new', userInput)
          })
        )
        console.log(createUserResponses[0].body)
      }
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {
        createUserResponses.forEach((response) => {
          expect(response.body.error).toBe("UserNameAlreadyTaken")
        })
      }
    );

    and("they should not have been sent access to account details", () => {
      createUserResponses.forEach((response) => {
        expect(response.body.error).toBeDefined()
        expect(response.data).toBeUndefined()
        expect(response.body.success).toBeFalsy()
      })
    });
  });
});
