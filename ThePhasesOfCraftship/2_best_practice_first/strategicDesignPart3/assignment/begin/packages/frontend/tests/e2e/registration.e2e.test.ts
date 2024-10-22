import { defineFeature, loadFeature } from "jest-cucumber";
import * as path from 'path';

const feature = loadFeature(
    path.join(
      __dirname,
      "../features/registration.feature"
    )
  );

  defineFeature(feature, (test) => {

    test('Successful registration with marketing emails accepted', ({ given, when, then, and }) => {
      let createUserResponse: any = {};
      let addEmailToMarketingList: any = {};

      given('I am a new user', () => {
        createUserInput = new CreateUserInputBuilder()
          .withAllRandomDetails()
          .build();
      });

      when('I register with valid account details accepting marketing emails', async () => {
        createUserResponse = await request(app).post("/users/new").send(createUserCommand)

        addEmailToMarketingList = await request(app).post("/marketing/new").send({ email: createUserCommand.email })
      });

      then('I should be granted access to my account', () => {
        expect(createUserResponse.status).toBe(201)
      });

      and('I should expect to receive marketing emails', () => {
        expect(addEmailToMarketingList.status).toBe(201)
      });
  });
  });
  