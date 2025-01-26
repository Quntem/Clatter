import express from "express";
import ViteExpress from "vite-express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";
import cors from "cors"
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient()

app.use(
    cors({
      origin: "http://localhost:3000", // Replace with your frontend's origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json())

app.get("/api/test", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  console.log(session)
  res.json(session)
})

app.post("/api/channels/create", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    var newchannel = await prisma.channel.create({
      data: {
        parentworkspace: session.session.activeOrganizationId,
        name: req.query.channelname,
      },
    })
    res.send("done")
  } catch(err) {
    console.log(err)
  }
})

app.get("/api/channels/list", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    var channellist = await prisma.channel.findMany({
      where: {
        parentworkspace: session.session.activeOrganizationId
      }
    })
    res.json(channellist)
  } catch(err) {
    console.log(err)
  }
})


app.get("/message", (_, res) => res.send("Hello from express!"));

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));