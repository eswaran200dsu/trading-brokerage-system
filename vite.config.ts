import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 8080,
      allowedHosts: [
        "trading-brokerage-system-1.onrender.com",
        "trading-brokerage-system-2.onrender.com",
        ".onrender.com",
      ],
    },
  },
});