import { createUserDTO } from "@dddforum/shared/dtos/user/createUserDTO";
import request from "supertest";
import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from 'path';
import { CreateUserInputBuilder } from "../builders/user/createUserBuilder";
import { app } from "../../../backend/src/index"
import { Server } from "http";
import { WebServer } from "@dddforum/shared/http/webServer"
import { RESTfulAPIDriver } from "@dddforum/shared/http/apiDriver"

const feature = loadFeature(
    path.join(
      __dirname,
      "../features/registration.feature"
    )
  );

  defineFeature(feature, (test) => {
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let driver: RESTfulAPIDriver;


    beforeAll(async () => {
      await webServer.start(3000);
      driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3000);
    });

    afterAll(async () => {
      await webServer.stop();
    });

    test('Successful registration with marketing emails accepted', ({ given, when, then, and }) => {
      let createUserResponse: any = {};
      let addEmailToMarketingList: any = {};
      let createUserInput: createUserDTO;

      given('I am a new user', () => {
        createUserInput = new CreateUserInputBuilder()
        .withFirstName("")
        .withLastName("")
        .withUsername("")
        .withEmail("")
        .build()
      });

      when('I register with valid account details accepting marketing emails', async () => {
        createUserResponse = await request(app).post("/users/new").send(createUserInput)

        addEmailToMarketingList = await request(app).post("/marketing/new").send({ email: createUserResponse.body.data.email })
      });

      then('I should be granted access to my account', () => {
        const { data, success } = createUserResponse.body

        expect(success).toBeTruthy();
        expect(data!.id).toBeDefined();
        expect(data!.email).toEqual(createUserInput.email);
        expect(data!.firstName).toEqual(createUserInput.firstName);
        expect(data!.lastName).toEqual(createUserInput.lastName);
        expect(data!.username).toEqual(createUserInput.username);
      });

      and('I should expect to receive marketing emails', () => {
        const { success } = addEmailToMarketingList.body

        expect(addEmailToMarketingList.status).toBe(201)
        expect(success).toBeTruthy();
      });
  });
  });
  