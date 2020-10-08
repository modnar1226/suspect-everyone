"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Account",
    embedded: false
  },
  {
    name: "AccountCustomField",
    embedded: false
  },
  {
    name: "AccountCustomValue",
    embedded: false
  },
  {
    name: "Admin",
    embedded: false
  },
  {
    name: "Contact",
    embedded: false
  },
  {
    name: "ContactCustomField",
    embedded: false
  },
  {
    name: "ContactCustomValue",
    embedded: false
  },
  {
    name: "Job",
    embedded: false
  },
  {
    name: "Migration",
    embedded: false
  },
  {
    name: "Org",
    embedded: false
  },
  {
    name: "PasswordReset",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "UsersRoleEnum",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
