import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function runMigration(scriptName: string) {
  const scriptPath = path.join(__dirname, "scripts", `${scriptName}.ts`);

  if (!fs.existsSync(scriptPath)) {
    console.error(`Migration script '${scriptName}' not found.`);
    process.exit(1);
  }

  try {
    const migrationModule = await import(scriptPath);
    if (typeof migrationModule.default === "function") {
      await migrationModule.default();
    } else {
      console.error(
        `Migration script '${scriptName}' does not export a default function.`,
      );
    }
  } catch (error) {
    console.error(`Error running migration script '${scriptName}':`, error);
  }
}

const scriptName = process.argv[2];

if (!scriptName) {
  console.error("Please provide a migration script name.");
  process.exit(1);
}

runMigration(scriptName);
