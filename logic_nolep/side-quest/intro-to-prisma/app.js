// app.js
import { PrismaClient } from "./generated/client/index.js";

const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
    },
  });

  console.log("User created:", newUser);

  const users = await prisma.user.findMany();
  console.log("All users:", users);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
