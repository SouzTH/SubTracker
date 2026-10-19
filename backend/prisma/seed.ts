// Popula o banco com uma conta de teste, pra não precisar cadastrar um
// usuário manualmente só pra explorar a API. Os dados aqui são ilustrativos
// (não é uma cópia do antigo frontend/db.json) — ajuste como quiser.
// Rodar:  npm run seed   (pode rodar várias vezes: não duplica nada)
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TEST_EMAIL = "teste@subtracker.com";
const TEST_PASSWORD = "123456";

async function main() {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: TEST_EMAIL },
    update: {},
    create: {
      nome: "Usuário de Teste",
      email: TEST_EMAIL,
      passwordHash,
      telefone: "(11) 99999-0000",
      paymentMethod: "Cartão de crédito",
    },
  });

  const existing = await prisma.subscription.count({ where: { userId: user.id } });
  if (existing === 0) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        name: "Netflix",
        category: "Streaming",
        value: 39.9,
        period: "Mensal",
        nextCharge: "2026-11-15",
        paymentMethod: "Cartão de crédito",
        status: "Ativa",
        color: "#E50914",
        icon: "🎬",
        history: {
          create: [
            { date: "2026-10-15", value: 39.9, status: "Pago" },
            { date: "2026-09-15", value: 39.9, status: "Pago" },
          ],
        },
      },
    });

    await prisma.subscription.create({
      data: {
        userId: user.id,
        name: "Spotify",
        category: "Música",
        value: 21.9,
        period: "Mensal",
        nextCharge: "2026-11-20",
        paymentMethod: "Cartão de crédito",
        status: "Ativa",
        color: "#1DB954",
        icon: "🎵",
        history: { create: [{ date: "2026-10-20", value: 21.9, status: "Pago" }] },
      },
    });
  }

  console.log(`Seed concluído. Login de teste: ${TEST_EMAIL} / ${TEST_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
