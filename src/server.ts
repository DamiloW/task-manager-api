import prisma from './config/database';

async function testConnection() {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: "teste@damilo.com",
        name: "Damilo Teste",
        password: "123", // Lembre-se: em produção usaremos hash!
      },
    });
    console.log("✅ Conexão com o banco funcionando! Usuário criado:", newUser);
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();