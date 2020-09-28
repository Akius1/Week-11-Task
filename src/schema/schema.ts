import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";

import { HttpError } from "http-errors";
//Import Controllers
import controller from "../controller/organizations";

//Import UserController
import userController from "../controller/user";

//OrganizationTypes
const OrganizationsType = new GraphQLObjectType({
  name: "Organizations",
  description: "information about Organitions",
  fields: () => ({
    organization: {
      type: GraphQLString,
      description: "The name of the organization",
    },
    createdAt: {
      type: GraphQLString,
      description: "New Date",
    },
    updatedAt: {
      type: GraphQLString,
      description: "New Date",
    },
    products: {
      type: new GraphQLList(GraphQLString),
      description: "The list of Products",
    },
    marketValue: {
      type: GraphQLString,
      description: "The value of the marketValu",
    },
    address: {
      type: GraphQLString,
      description: "The address details",
    },
    ceo: {
      type: GraphQLString,
      description: "The of CEO",
    },
    country: {
      type: GraphQLString,
      description: "The country name",
    },
    id: {
      type: GraphQLString,
    },
    noOfEmployees: {
      type: GraphQLString,
      description: "The number of employees",
    },
    employees: {
      type: new GraphQLList(GraphQLString),
      description: "The list of Products",
    },
  }),
});

//UserType
const UserType = new GraphQLObjectType({
  name: "User",
  description: " Users details",
  fields: () => ({
    email: { type: GraphQLString, description: "The email of user" },
    firstName: { type: GraphQLString, description: "The firstname of user" },
    lastName: { type: GraphQLString, description: "The lastname of user" },
    password: { type: GraphQLString, description: "The password" },
  }),
});

//Root Query
const query = new GraphQLObjectType({
  name: "Root",
  description: "The root query",
  fields: () => ({
    getOneByID: {
      type: OrganizationsType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args, context) => {
        if (!context.headers.authorization)
          throw new Error("Authentication failed");
        const { id } = args;
        let company = controller.getOrganization(id);
        return company;
      },
    },
    organizations: {
      type: new GraphQLList(OrganizationsType),
      description: "Organizations Details",
      resolve: (parent, args, context) => {
        if (!context.headers.authorization)
          throw new Error("Authentication failed");
        let company = controller.getAllOrganizations();
        return company;
      },
    }, //END
    //GET USER
    getUsers: {
      type: new GraphQLList(UserType),
      description: "Users Details",
      resolve: (parent, args) => {
        let user = userController.getAllUsers();
        return user;
      },
    }, //End of All User

    getAUserByID: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        //const { email, password } = args;
        let company = await userController.getUser(args);
        return company;
      },
    },
  }),
});

// POST MUTATION
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addOrganization: {
      type: OrganizationsType,
      args: {
        organization: { type: GraphQLString },
        products: { type: new GraphQLList(GraphQLString) },
        marketValue: { type: GraphQLInt },
        address: { type: GraphQLString },
        ceo: { type: GraphQLString },
        country: { type: GraphQLString },
        noOfEmployees: { type: GraphQLInt },
        employees: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          args.noOfEmployees = args.employees.length;
          let organization = controller.CreateOrganization(args);
          return organization;
        } catch {
          (err: HttpError) => {
            console.log(err);
          };
        }
      },
    },
    //END OF POST
    updateOrganization: {
      type: OrganizationsType,
      args: {
        id: { type: GraphQLID },
        organization: { type: GraphQLString },
        products: { type: new GraphQLList(GraphQLString) },
        marketValue: { type: GraphQLInt },
        address: { type: GraphQLString },
        ceo: { type: GraphQLString },
        country: { type: GraphQLString },
        noOfEmployees: { type: GraphQLInt },
        employees: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          const { id, ...others } = args;
          others.noOfEmployees = others.employees.length;
          const result = await controller.UpdateOrganization(id, others);
          return result;
        } catch {
          (err: HttpError) => {
            console.log(err.message);
          };
        }
      },
    }, //END OF UPDATE

    // delete
    deleteOrganization: {
      type: OrganizationsType,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parent, args) {
        try {
          const { id } = args;
          const result = controller.DeleteOrganization(id);
          return result;
        } catch {
          (err: HttpError) => {
            console.log(err.message);
          };
        }
      },
    }, //END Delete
    addUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          let user = userController.CreateUser(args);
          return user;
        } catch {
          (err: HttpError) => {
            console.log(err);
          };
        }
      },
    },
  },
});

const schema = new GraphQLSchema({
  query,
  mutation,
});

export default schema;
