import { describe, test, expect, vi } from "vitest";
import type { Response } from "express";
import { respondWithError, respondWithJSON } from "../src/api/json";

function createMockResponse(): Partial<Response> {
  return {
    setHeader: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    end: vi.fn(),
  };
}

type TestCase = {
  title: string;
  code: number;
  payload: unknown;
  expectThrows?: boolean;
  expectedStatus?: number;
  expectedHeader?: [string, string];
  expectedBody?: string;
};

const testCases: TestCase[] = [
  {
    title: "sends proper JSON and sets status/header",
    code: 201,
    payload: { foo: "bar" },
    expectedStatus: 201,
    expectedHeader: ["Content-Type", "application/json"],
    expectedBody: JSON.stringify({ foo: "bar" }),
  },
  {
    title: "throws if payload is a number (not string or object)",
    code: 401,
    payload: 123,
    expectThrows: true,
  },
];

describe("respondWithJSON", () => {
  test.each(testCases)("$title", (tc) => {
    const res = createMockResponse() as Response;

    if (tc.expectThrows) {
      expect(() => respondWithJSON(res, tc.code, tc.payload)).toThrow(Error);
    } else {
      respondWithJSON(res, tc.code, tc.payload);

      if (tc.expectedHeader) {
        expect(res.setHeader).toHaveBeenCalledWith(...tc.expectedHeader);
      }

      if (tc.expectedStatus) {
        expect(res.status).toHaveBeenCalledWith(tc.expectedStatus);
      }

      if (tc.expectedBody) {
        expect(res.send).toHaveBeenCalledWith(tc.expectedBody);
      }

      expect(res.end).toHaveBeenCalled();
    }
  });
});

describe("respondWithError", () => {
  test("respondWithError sends expected JSON error response", () => {
    const res = createMockResponse() as Response;
    respondWithError(res, 400, "Bad Request");

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      JSON.stringify({ error: "Bad Request" }),
    );
  });
});
