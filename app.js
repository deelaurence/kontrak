require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const auth = require("./middleware/authentication");
const authRoutes = require("./routes/authRoute");
const contractsRoutes = require("./routes/contractRoute");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const connectDB = require("./db/connect");
app.use(express.json());
// extra security packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send('<h3 style="color:purple">Kontrak API</h3>');
});

// routes
app.use(authRoutes);
app.use("/contracts", auth, contractsRoutes);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;
//switch between local and cloud db

const local = process.env.LOCAL_URI;
const cloud = process.env.CLOUD_URI;

const start = async () => {
  try {
    await connectDB(cloud);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
