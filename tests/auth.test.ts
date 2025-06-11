import { describe, test, expect } from "vitest";
import { IncomingHttpHeaders as Headers } from "http";
import getAPIKey from "../src/api/auth";

type TestCase = {
  title: string;
  input: Headers;
  expected: string | null;
  assertionType: string;
};

const testCases: TestCase[] = [
  {
    title: "returns null if empty header",
    input: {},
    expected: null,
    assertionType: "toBeNull",
  },
  {
    title: "returns null if no `authorization` header",
    input: { accept: "" },
    expected: null,
    assertionType: "toBeNull",
  },

  {
    title: "returns null if `authorization` header does not contain `ApiKey`",
    input: { authorization: "notApiKey keyValue" },
    expected: null,
    assertionType: "toBeNull",
  },
  {
    title:
      "returns null if `authorization` header with `ApiKey` but no api key value",
    input: { authorization: "ApiKey" },
    expected: null,
    assertionType: "toBeNull",
  },

  {
    title: "returns ApiKey",
    input: { authorization: "ApiKey keyValue" },
    expected: "keyValue",
    assertionType: "toBe",
  },
];

describe("getAPIKey", () => {
  test.each(testCases)("$title", ({ input, assertionType, expected }) => {
    expect(getAPIKey(input))[assertionType](expected);
  });
});
