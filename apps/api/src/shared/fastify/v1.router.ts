import type { FastifyInstance } from "fastify";

// declare module "fastify" {
//   export interface FastifyRequest {
//     user: {
//       userId: string;
//       email: string;
//     };
//   }
// }

export const v1Router = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get("/", async () => {
    return {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};
