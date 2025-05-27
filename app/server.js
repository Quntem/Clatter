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
const io = new Server(server, {
    cors: {
        origin: "*",
    },
})

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
  // console.log(session)
  res.json(session)
})

app.post("/api/channels/create", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    // console.log(session)
    const orgmember = await auth.api.getActiveMember({
      headers: fromNodeHeaders(req.headers),
    });
    if( orgmember.role = "owner") {
      var newchannel = await prisma.channel.create({
        data: {
          parentworkspace: session.session.activeOrganizationId,
          name: req.query.channelname,
        },
      })
      res.send("done")
    } else {
      res.send("not permitted")
    }
  } catch(err) {
    // console.log(err)
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
    // console.log(err)
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
    // console.log(err)
  }
})

app.get("/api/documents/listown", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    var channellist = await prisma.document.findMany({
      where: {
        owner: session.user.id
      }
    })
    res.json(channellist)
  } catch(err) {
    // console.log(err)
  }
})

app.get("/api/channel/:channelid/messages/list", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  var messages = await prisma.message.findMany({
    where: {
      parentid: req.params.channelid,
      parentmessageid: null
    },
    include: {
      childmessages: true
    }
  })
  res.json(messages)
})

app.post("/api/workspace/users/add", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    const orgmember = await auth.api.getActiveMember({
      headers: fromNodeHeaders(req.headers),
    });
    if( orgmember.role = "owner") {
      const x = await auth.api.addMember({
        body: {
            userId: req.query.id,
            organizationId: session.session.activeOrganizationId,
            role: "member"
        }
      })
      res.json(x)
    } else {
      res.send("not permitted")
    }
  } catch {
    // console.log("test")
  }
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

app.post("/api/channel/:channelid/thread/:messageid/send", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  var message = await prisma.message.create({
    data: {
      content: req.query.message,
      sender: session.session.userId,
      parentid: req.params.channelid,
      sendername: session.user.name,
      parentmessageid: req.params.messageid,
    }
  })
  res.json(message)
})

app.get("/api/channel/:channelid/thread/:messageid/messages/list", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  var messages = await prisma.message.findMany({
    where: {
      parentid: req.params.channelid,
      parentmessageid: req.params.messageid
    },
    include: {
      childmessages: true
    }
  })
  res.json(messages)
})

app.get("/api/channel/:channelid/message/:messageid/delete", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  var message = await prisma.message.findUnique({
    where: {
      id: req.params.messageid,
      parentid: req.params.channelid
    }
  })
  if(message.sender === session.session.userId) {
    await prisma.message.delete({
      where: {
        id: req.params.messageid,
        parentid: req.params.channelid
      }
    })
    res.json("done")
  } else {
    res.json("not permitted")
  }
})

app.get("/api/channel/:channelid/message/:messageid/info", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    var message = await prisma.message.findUnique({
      where: {
        parentid: req.params.channelid,
        id: req.params.messageid
      }
    })
    res.json(message)
  } catch(err) {
    // console.log(err)
  }
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

    argjson.DateCreated = new Date().toISOString()
    
    if(argjson.method === "modern") {
      const session = await auth.api.getSession({
        headers: new Headers({
          authorization: "Bearer " + argjson.token
        })
      });
      if(argjson.parentmessageid) {
        var parentid = argjson.parentmessageid
      } else {
        var parentid = null
      }
      var message = await prisma.message.create({
        data: {
          content: argjson.content,
          sender: session.session.userId,
          parentid: argjson.room,
          parentmessageid: parentid,
          sendername: session.user.name
        }
      })
      argjson.id = message.id
    }
    
    socket.emit("clatter.channel.message.send.response", "Sent Message")
    socket.to(argjson.room).emit("clatter.channel.message.recieve", JSON.stringify(argjson))
  }) 
});

server.listen(3000)

ViteExpress.bind(app, server)

// ViteExpress.listen(app, 3000, () => // console.log("Server is listening..."));