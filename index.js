// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import multer from "multer";
import sharp from "sharp";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  furniture;
  projects;
  constructor() {
    this.furniture = /* @__PURE__ */ new Map();
    this.projects = /* @__PURE__ */ new Map();
    this.initializeFurniture();
  }
  initializeFurniture() {
    const initialFurniture = [
      {
        id: "sofa-1",
        name: "Sof\xE1 Moderno Cinzento",
        category: "living",
        imageUrl: "/generated_images/Modern_gray_sofa_furniture_ba24cb6a.png",
        style: "Moderno",
        price: "\u20AC899",
        brand: "DecorAR"
      },
      {
        id: "coffee-table-1",
        name: "Mesa de Centro Madeira",
        category: "living",
        imageUrl: "/generated_images/Wooden_coffee_table_furniture_db5c91e8.png",
        style: "Escandinavo",
        price: "\u20AC249",
        brand: "DecorAR"
      },
      {
        id: "armchair-1",
        name: "Poltrona Confort\xE1vel",
        category: "living",
        imageUrl: "/attached_assets/generated_images/Beige_armchair_furniture_3fe1efe7.png",
        style: "Contempor\xE2neo",
        price: "\u20AC449",
        brand: "DecorAR"
      },
      {
        id: "bookshelf-1",
        name: "Estante Branca",
        category: "office",
        imageUrl: "/attached_assets/generated_images/White_bookshelf_furniture_00172115.png",
        style: "Minimalista",
        price: "\u20AC329",
        brand: "DecorAR"
      },
      {
        id: "dining-table-1",
        name: "Mesa de Jantar Redonda",
        category: "living",
        imageUrl: "/attached_assets/generated_images/Round_dining_table_furniture_2fc15cdc.png",
        style: "Moderno",
        price: "\u20AC599",
        brand: "DecorAR"
      },
      {
        id: "desk-1",
        name: "Secret\xE1ria Madeira",
        category: "office",
        imageUrl: "/attached_assets/generated_images/Wooden_desk_furniture_90fcd8ba.png",
        style: "Escandinavo",
        price: "\u20AC399",
        brand: "DecorAR"
      },
      {
        id: "lamp-1",
        name: "Candeeiro de Ch\xE3o",
        category: "decor",
        imageUrl: "/attached_assets/generated_images/Modern_floor_lamp_e66ff688.png",
        style: "Contempor\xE2neo",
        price: "\u20AC179",
        brand: "DecorAR"
      },
      {
        id: "plant-1",
        name: "Planta Decorativa",
        category: "decor",
        imageUrl: "/attached_assets/generated_images/Decorative_plant_pot_3efd1a1f.png",
        style: "Natural",
        price: "\u20AC89",
        brand: "DecorAR"
      }
    ];
    initialFurniture.forEach((item) => {
      this.furniture.set(item.id, item);
    });
  }
  async getFurniture() {
    return Array.from(this.furniture.values());
  }
  async getProjects() {
    return Array.from(this.projects.values());
  }
  async getProject(id) {
    return this.projects.get(id);
  }
  async createProject(insertProject) {
    const id = randomUUID();
    const project = {
      ...insertProject,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.projects.set(id, project);
    return project;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var furniture = pgTable("furniture", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  style: text("style").notNull(),
  price: text("price"),
  brand: text("brand")
});
var projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomImageUrl: text("room_image_url").notNull(),
  furnitureItems: jsonb("furniture_items").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertFurnitureSchema = createInsertSchema(furniture).omit({
  id: true
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Tipo de ficheiro n\xE3o suportado. Use JPG, PNG ou WEBP."));
  }
});
async function registerRoutes(app2) {
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const serverAssetsDir = path.join(process.cwd(), "server", "generated_images");
  app2.get("/api/furniture", async (_req, res) => {
    try {
      const furniture2 = await storage.getFurniture();
      res.json(furniture2);
    } catch (error) {
      console.error("Error fetching furniture:", error);
      res.status(500).json({ error: "Erro ao carregar m\xF3veis" });
    }
  });
  app2.get("/api/projects", async (_req, res) => {
    try {
      const projects2 = await storage.getProjects();
      res.json(projects2);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Erro ao carregar projetos" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) return res.status(404).json({ error: "Projeto n\xE3o encontrado" });
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Erro ao carregar projeto" });
    }
  });
  app2.post("/api/projects", async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }
      const project = await storage.createProject(result.data);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Erro ao criar projeto" });
    }
  });
  app2.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "Nenhum ficheiro enviado" });
      const filename = `room-${Date.now()}.webp`;
      const filepath = path.join(uploadsDir, filename);
      await sharp(req.file.buffer).resize(1920, 1080, { fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toFile(filepath);
      const imageUrl = `/uploads/${filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Erro ao fazer upload da imagem" });
    }
  });
  app2.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });
  app2.use("/uploads", async (req, res, next) => {
    const cleanPath = req.path.replace(/^\//, "");
    const filePath = path.join(uploadsDir, cleanPath);
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else next();
  });
  app2.use("/attached_assets/generated_images", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });
  app2.use("/attached_assets/generated_images", async (req, res, next) => {
    const cleanPath = req.path.replace(/^\//, "");
    const filePath = path.join(serverAssetsDir, cleanPath);
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else next();
  });
  app2.use("/generated_images", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });
  app2.use("/generated_images", async (req, res, next) => {
    const cleanPath = req.path.replace(/^\//, "");
    const filePath = path.join(serverAssetsDir, cleanPath);
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else next();
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
