module.exports = {
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
    testEnvironment: "node",
    testRegex: "./(src|tests)/.*\\.(ispec)\\.(ts|ts)$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    roots: ["<rootDir>/tests", "<rootDir>/src"],
  };
  