const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const app = express();
const port = 1010;
const server = http.createServer(app);

app.use(express.json());

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let balanceValue = 5000;

let allMoneyArrFifteen = [
  0.00001, 0.00258, 0.000089, 0.00874, 0.00259, 0.00096, 0.000123, 0.00657,
];

let condT = false;

io.on("connection", function (socket) {
  socket.on("usdRequest", (data) => {
    io.emit("requestUsd", "doen");
  });

  socket.on("stopSocket", (info) => {
    condT = info;
  });

  socket.on("runSocket", (info) => {
    condT = false;

    let sstop = setInterval(() => handleCounterFifteen(sstop), 1000);
  });

  // stopSocket

  function handleCounterFifteen(sstop) {
    let evenOrOdd =
      Math.floor(Math.random() * 8 + 1) % 2 === 0 ? "even" : "odd";
    let indexNumber = Math.floor(Math.random() * allMoneyArrFifteen.length);

    if (evenOrOdd == "even") {
      balanceValue += Number(allMoneyArrFifteen[indexNumber]);
      balanceValue = Math.round(balanceValue * 100000000) / 100000000;

      io.emit("socketRun", {
        data: balanceValue,
      });
    } else {
      balanceValue -= Number(allMoneyArrFifteen[indexNumber]);
      balanceValue = Math.round(balanceValue * 100000000) / 100000000;
      io.emit("socketRun", {
        data: balanceValue,
      });
    }

    if (condT) {
      clearInterval(sstop);
    }
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ error: "The requested URL was not found." });
});

server.listen(port, () => {
  console.log(`My App listening On Port http://localhost:${port}`);
});
