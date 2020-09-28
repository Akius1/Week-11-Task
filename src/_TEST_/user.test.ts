import supertest from "supertest";
import app from "../app";
//import mongoose

//  afterAll((done) => {
//    // Closing the DB connection allows Jest to exit successfully.
//    mongoose.connection.close();
//    done();
//  });
const request = supertest(app);
describe("Test for all Organizations", () => {
  it("Get all organizations", (done) => {
    request
      .post("/graphql")
      .send({
        query: "{organizations{organization, id, products}}",
      })
      .set("Accept", "Application/json")
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) return done(err);
        //console.log(res.body);

        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.organizations.length).toEqual(16);
        done();
      });
  });

  it("Returns organizations with organization", (done) => {
    request
      .post("/graphql")
      .send({
        query:
          '{ getOneByID(id:"5f6754e2e3a6243fd89d36e9") { organization, ceo, marketValue} }',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one organizations
        // console.log(res.body);
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
    request
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
        //console.log(res.body);
        done();
      });
  });

  it("Returns users by Id", (done) => {
    request
      .post("/graphql")
      .send({
        query:
          '{ getAUserByID(email:"ugoDav@gmail.com", password:"helloWorld") { email, firstName, lastName} }',
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one organizations
        //console.log(res.body);
        if (err) return done(err);
        expect(res.body.data.getAUserByID).toHaveProperty("email");
        expect(res.body.data.getAUserByID).toHaveProperty("firstName");
        expect(res.body.data.getAUserByID).toHaveProperty("lastName");
        done();
      });
  });
});

describe("Test for Mutation", () => {
  it("Add an organization", async (done) => {
    request
      .post("/graphql")
      .send({
        query:
          'mutation {addOrganization(organization:"SkyBank",products: ["Transfer", "Withdrawal"],marketValue: 90,address: "Skybank Tower",ceo:"Mr Uche",country: "Nigeria",employees: ["JohnBosco", "Taiwo", "Shola"]){organization, products}}',
      })
      .set("Accept", "Application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        console.log("the res", res.body);
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        done();
      });
  });
});
