import request from "supertest";
import server from "./server";


describe("POST /users" , () => {
    describe("given a username and password", () => {
        test("should responsed with a 200 status code", async() => {
            const response = await request(server).post("/users").send({
                username:"username",
                password:"password"
            })
            expect(response.statusCode).toBe(200)
        })
    })
})
