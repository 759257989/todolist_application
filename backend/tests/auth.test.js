// use super test to simulate HTTP requests to server without starting it manually.
const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose"); 
const User = require("../models/User");

// Starts a test suite called
describe("Auth Routes", () => {
  // clean up test user after all tests in this suite
  afterAll(async () => {
    await User.deleteOne({ email: "testuser@example.com" });
    await mongoose.connection.close(); 
  });
  // Test for create user
  it("should register a new user", async () => {
    const res = await request(app).post("/api/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/User created/i);
  });

  // Test for login user when incorrect password
  it("should not login with wrong password", async () => {
    const res = await request(app).post("/api/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/match/i);
  });

  // Test for prevent duplicate username 
  it("should not register with a duplicate username", async () => {
    // First registration
    await request(app).post("/api/register").send({
      username: "duplicateuser",
      email: "unique1@example.com",
      password: "123456",
    });

    // Attempt to register with same username again
    const res = await request(app).post("/api/register").send({
      username: "duplicateuser", // same username
      email: "unique2@example.com", // different email
      password: "123456",
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.error || res.body.message).toMatch(/username.*taken/i);
  });

  //Test for invalid email format when registering
  it("should not register a user with an invalid email format", async () => {
    const res = await request(app).post("/api/register").send({
      username: "bademailuser",
      email: "not-an-email", // invalid email
      password: "123456",
    });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.message).toMatch(/email.*invalid/i);
  });


});
