"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
//Import Controllers
const organizations_1 = __importDefault(require("../controller/organizations"));
//Import UserController
const user_1 = __importDefault(require("../controller/user"));
//OrganizationTypes
const OrganizationsType = new graphql_1.GraphQLObjectType({
    name: "Organizations",
    description: "information about Organitions",
    fields: () => ({
        organization: {
            type: graphql_1.GraphQLString,
            description: "The name of the organization",
        },
        createdAt: {
            type: graphql_1.GraphQLString,
            description: "New Date",
        },
        updatedAt: {
            type: graphql_1.GraphQLString,
            description: "New Date",
        },
        products: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            description: "The list of Products",
        },
        marketValue: {
            type: graphql_1.GraphQLString,
            description: "The value of the marketValu",
        },
        address: {
            type: graphql_1.GraphQLString,
            description: "The address details",
        },
        ceo: {
            type: graphql_1.GraphQLString,
            description: "The of CEO",
        },
        country: {
            type: graphql_1.GraphQLString,
            description: "The country name",
        },
        id: {
            type: graphql_1.GraphQLString,
        },
        noOfEmployees: {
            type: graphql_1.GraphQLString,
            description: "The number of employees",
        },
        employees: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            description: "The list of Products",
        },
    }),
});
//UserType
const UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    description: " Users details",
    fields: () => ({
        email: { type: graphql_1.GraphQLString, description: "The email of user" },
        firstName: { type: graphql_1.GraphQLString, description: "The firstname of user" },
        lastName: { type: graphql_1.GraphQLString, description: "The lastname of user" },
        password: { type: graphql_1.GraphQLString, description: "The password" },
    }),
});
//Root Query
const query = new graphql_1.GraphQLObjectType({
    name: "Root",
    description: "The root query",
    fields: () => ({
        getOneByID: {
            type: OrganizationsType,
            args: {
                id: { type: graphql_1.GraphQLID },
            },
            resolve: (parent, args, context) => {
                if (!context.headers.authorization)
                    throw new Error("Authentication failed");
                const { id } = args;
                let company = organizations_1.default.getOrganization(id);
                return company;
            },
        },
        organizations: {
            type: new graphql_1.GraphQLList(OrganizationsType),
            description: "Organizations Details",
            resolve: (parent, args, context) => {
                if (!context.headers.authorization)
                    throw new Error("Authentication failed");
                let company = organizations_1.default.getAllOrganizations();
                return company;
            },
        },
        //GET USER
        getUsers: {
            type: new graphql_1.GraphQLList(UserType),
            description: "Users Details",
            resolve: (parent, args) => {
                let user = user_1.default.getAllUsers();
                return user;
            },
        },
        getAUserByID: {
            type: UserType,
            args: {
                email: { type: graphql_1.GraphQLString },
                password: { type: graphql_1.GraphQLString },
            },
            resolve: async (parent, args) => {
                //const { email, password } = args;
                let company = await user_1.default.getUser(args);
                return company;
            },
        },
    }),
});
// POST MUTATION
const mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        addOrganization: {
            type: OrganizationsType,
            args: {
                organization: { type: graphql_1.GraphQLString },
                products: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                marketValue: { type: graphql_1.GraphQLInt },
                address: { type: graphql_1.GraphQLString },
                ceo: { type: graphql_1.GraphQLString },
                country: { type: graphql_1.GraphQLString },
                noOfEmployees: { type: graphql_1.GraphQLInt },
                employees: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
            },
            async resolve(parent, args) {
                try {
                    args.noOfEmployees = args.employees.length;
                    let organization = organizations_1.default.CreateOrganization(args);
                    return organization;
                }
                catch {
                    (err) => {
                        console.log(err);
                    };
                }
            },
        },
        //END OF POST
        updateOrganization: {
            type: OrganizationsType,
            args: {
                id: { type: graphql_1.GraphQLID },
                organization: { type: graphql_1.GraphQLString },
                products: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                marketValue: { type: graphql_1.GraphQLInt },
                address: { type: graphql_1.GraphQLString },
                ceo: { type: graphql_1.GraphQLString },
                country: { type: graphql_1.GraphQLString },
                noOfEmployees: { type: graphql_1.GraphQLInt },
                employees: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
            },
            async resolve(parent, args) {
                try {
                    const { id, ...others } = args;
                    others.noOfEmployees = others.employees.length;
                    const result = await organizations_1.default.UpdateOrganization(id, others);
                    return result;
                }
                catch {
                    (err) => {
                        console.log(err.message);
                    };
                }
            },
        },
        // delete
        deleteOrganization: {
            type: OrganizationsType,
            args: {
                id: { type: graphql_1.GraphQLID },
            },
            async resolve(parent, args) {
                try {
                    const { id } = args;
                    const result = organizations_1.default.DeleteOrganization(id);
                    return result;
                }
                catch {
                    (err) => {
                        console.log(err.message);
                    };
                }
            },
        },
        addUser: {
            type: UserType,
            args: {
                email: { type: graphql_1.GraphQLString },
                firstName: { type: graphql_1.GraphQLString },
                lastName: { type: graphql_1.GraphQLString },
                password: { type: graphql_1.GraphQLString },
            },
            async resolve(parent, args) {
                try {
                    let user = user_1.default.CreateUser(args);
                    return user;
                }
                catch {
                    (err) => {
                        console.log(err);
                    };
                }
            },
        },
    },
});
const schema = new graphql_1.GraphQLSchema({
    query,
    mutation,
});
exports.default = schema;
