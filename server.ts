// 本機開發伺服器：掛上共用 API（lib/app.ts）+ Vite middleware
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import app from "./lib/app.js";

async function startServer() {
  const PORT = 3000;

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log(`Dev server running at http://localhost:${PORT}`);
  });
}

startServer();
