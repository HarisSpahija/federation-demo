const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    teams: [Team]
  }

  type Team @key(fields: "id") {
    id: ID!
    organizationName: String
    members: [User]
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    role: Role
  }

  type Role {
    id: ID
    roleName: String
    createdAt: String
    permissions: [Permissions]
  }

  enum Permissions {
    createShow,
    editShow,
    createInvites,
    addMembers,
    removeMembers,
    guest
  }
`;

const resolvers = {
  Query: {
    teams() {
        return teamTable;
    }
  },
  User: {
    role(user) {
      console.log("This is the user", user)

      return rolesTable.find(role => role.id === user.role)
    },
    __resolveReference(object) {
      console.log(object)

      return users.find(user => user.id === object.id);
    }
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const teamTable = [
  {
    id: "1",
    organizationName: "TeamA",
    members: [{ id: "1", username: "@ada", role: "1" }],
  },
]

const rolesTable = [
  {
    id: "1",
    roleName: "admin",
    createdAt: "Thu Jul 09 2020",
    permissions: [
      "createShow",
      "editShow",
      "createInvites",
      "addMembers",
      "removeMembers",
    ],
  },
  {
    id: "2",
    roleName: "cast",
    createdAt: "Thu Jul 09 2020",
    permissions: ["editShow", "createdInvites", "addMembers", "removeMembers"],
  },
  {
    id: "3",
    roleName: "guest",
    createdAt: "Thu Jul 09 2020",
    permissions: ["guest"],
  },
]

const invitesTable = [
  {
    id: "1",
    organization: "1",
    createdAt: "Thu Jul 09 2020",
    validTill: "Fri Jul 10 2020",
    recipient: {
      email: "haris.spahija@gmail.com",
    },
  },
]
