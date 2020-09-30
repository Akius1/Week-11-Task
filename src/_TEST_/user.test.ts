import supertest from "supertest";
import app from "../app";
import mongoose from "mongoose";

const request = supertest(app);

import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = new MongoMemoryServer();

// beforeEach(() => {
//   jest.setTimeout(10000);
// });

describe("Test for all Organizations", () => {
  it("Get all organizations", (done) => {
    return request
      .post("/graphql")
      .send({
        query: "{organizations{organization, id, products}}",
      })
      .set("Accept", "Application/json")
      .expect("Content-Type", /json/)
      .then(async (res) => {
        const datas = await res.body;
        expect(datas).toBeInstanceOf(Object);
        expect(datas.data.organizations.length).toEqual(17);
        done();
      });
  });

  it("Returns organizations with organization", (done) => {
    return request
      .post("/graphql")
      .send({
        query:
          '{ getOneByID(id:"5f6754e2e3a6243fd89d36e9") { organization, ceo, marketValue} }',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.getOneByID).toHaveProperty("organization");
        expect(res.body.data.getOneByID).toHaveProperty("ceo");
        expect(res.body.data.getOneByID).toHaveProperty("marketValue");
        done();
      });
  });
});

describe("Test for all Users", () => {
  it("Get all users", (done) => {
    return request
      .post("/graphql")
      .send({
        query: "{getUsers{firstName, lastName, email}}",
      })
      .set("Accept", "Application/json")
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.getUsers.length).toEqual(10);
        done();
      });
  });

  it("Returns users by Id", (done) => {
    return request
      .post("/graphql")
      .send({
        query:
          '{ getAUserByID(email:"ugoDav@gmail.com", password:"helloWorld") { email, firstName, lastName} }',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.getAUserByID).toHaveProperty("email");
        expect(res.body.data.getAUserByID).toHaveProperty("firstName");
        expect(res.body.data.getAUserByID).toHaveProperty("lastName");
        done();
      });
  });
});

describe("Test for Mutation", () => {
  it("Add an organization", (done) => {
    return request
      .post("/graphql")
      .send({
        query:
          'mutation {addOrganization(organization:"Sky",products: ["Transfer", "Withdrawal"],marketValue: 90,address: "Skybank Tower",ceo:"Mr Uche",country: "Nigeria",employees: ["JohnBosco", "Taiwo", "Shola"]){organization, products}}',
      })
      .set("Accept", "Application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        done();
      });
  });
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});
