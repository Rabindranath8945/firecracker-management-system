import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";

async function bootstrap() {
  await connectDatabase();

  app.listen(env.PORT, "0.0.0.0", () => {
    logger.info(`🚀 Server running on port ${env.PORT}`);
  });
}

bootstrap();
