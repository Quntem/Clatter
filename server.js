import express from "express";
import ViteExpress from "vite-express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import cors from "cors"

const app = express();

app.use(
    cors({
      origin: "http://localhost:3000", // Replace with your frontend's origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);

app.all("/api/auth/*", toNodeHandler(auth));

app.get("/message", (_, res) => res.send("Hello from express!"));

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));