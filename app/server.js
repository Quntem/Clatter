import express from "express";
import ViteExpress from "vite-express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";
import cors from "cors"
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import { createServer } from "http"

const app = express();
const server = createServer(app)
const prisma = new PrismaClient()
const io = new Server(server)

app.use(
    cors({
      origin: "*", // Replace with your frontend's origin
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

app.get("/api/channel/:channelid/info", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    var channel = await prisma.channel.findUnique({
      where: {
        parentworkspace: session.session.activeOrganizationId,
        id: req.params.channelid
      }
    })
    res.json(channel)
  } catch(err) {
    console.log(err)
  }
})

app.get("/api/channel/:channelid/messages/list", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  var messages = await prisma.message.findMany({
    where: {
      parentid: req.params.channelid
    }
  })
  res.json(messages)
})

app.post("/api/channel/:channelid/messages/send", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  var message = await prisma.message.create({
    data: {
      content: req.query.message,
      sender: session.session.userId,
      parentid: req.params.channelid,
      sendername: session.user.name
    }
  })
  res.json(message)
})

io.on("connection", (socket) => {
  socket.on("clatter.channel.join", async (args) => {
    var argjson = JSON.parse(args)
    socket.rooms.forEach((room) => {
      if (!room.includes("systemnotif_")) {
        socket.leave(room);
      }
    });
    socket.join(argjson.room)
    socket.emit("clatter.channel.join.response", "Joined " + argjson.room)
  }) 
  socket.on("clatter.channel.message.send", async (args) => {
    var argjson = JSON.parse(args)
    
    socket.emit("clatter.channel.message.send.response", "Sent Message")
    socket.to(argjson.room).emit("clatter.channel.message.recieve", args)
  }) 
});

server.listen(3000)

ViteExpress.bind(app, server)

// ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));