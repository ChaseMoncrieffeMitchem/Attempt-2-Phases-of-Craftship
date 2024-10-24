class InvalidRequestBodyException extends Error {
    constructor(missingKeys: string[]) {
      super("Body is missing required key: " + missingKeys.join(", "));
    }
  }


class UsernameTakenException extends Error {
    constructor() {
      super("Username is Already In Use");
    }
  }

class EmailTakenException extends Error {
    constructor() {
      super("Email is Already In Use");
    }
  }

class ClientException extends Error {
    constructor() {
      super("Error on the Client");
    }
  }

class ServerException extends Error {
    constructor() {
      super("Error on the Server");
    }
  }

class UserNotFoundException extends Error {
    constructor() {
      super("User Cannot Be Found");
    }
  }

class InvalidEmailException extends Error {
  constructor() {
    super("This email is not in a valid format")
  }
}

export {
    InvalidRequestBodyException,
    UsernameTakenException,
    EmailTakenException,
    ClientException,
    ServerException,
    UserNotFoundException,
    InvalidEmailException
}