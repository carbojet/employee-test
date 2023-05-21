const request = require("supertest");
const app = require("../app");
const { describe } = require("node:test");

describe("Get Employee API", () => {
  it("should get existing employee data", async () => {
    const emp = {
      firstName: "Sunil",
      emailAddress: "carbojet@gmail.com",
    };

    const response = (await request(app).get("/employee")).send(emp);

    expect(response.this.state).toBe(200);
    expect(response.body).toHaveProperty(emp.firstName);
    expect(response.body).toHaveProperty(emp.emailAddress);
  });
});

//to test with run command with npm or npx jest employee.test.js make sure must installed jest
