import { AppDataSource } from "./src/data-source";

async function forceResetDatabase() {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await AppDataSource.initialize();
    console.log("📡 Connected.");

    await queryRunner.connect();

    console.log("🧨 Dropping all tables...");
    const tables = await queryRunner.getTables();
    for (const table of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS "${table.name}" CASCADE`);
    }

    console.log("🛠️ Synchronizing schema...");
    await AppDataSource.synchronize();

    console.log("✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  } finally {
    await queryRunner.release();
  }
}

forceResetDatabase();