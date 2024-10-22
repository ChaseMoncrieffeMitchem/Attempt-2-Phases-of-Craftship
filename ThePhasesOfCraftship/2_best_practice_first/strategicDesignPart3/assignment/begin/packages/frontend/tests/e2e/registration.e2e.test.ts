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
      given('I am a new user', () => {

      });

      when('I register with valid account details accepting marketing emails', () => {

      });

      then('I should be granted access to my account', () => {

      });

      and('I should expect to receive marketing emails', () => {

      });
  });
  });
  