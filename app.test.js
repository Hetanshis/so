"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("./server"));
// Mock AuthController to isolate the testing of AuthRoutes
describe("Test the root path", () => {
    test("It should response the GET method", done => {
        (0, supertest_1.default)(server_1.default)
            .get("/users")
            .then(response => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
