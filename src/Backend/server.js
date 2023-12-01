require("dotenv").config();

const exp = require("express");
const connectDB = require("./database");
const cors = require("cors");
const app = exp();
const stripe = require("stripe")(process.env.STRIPE_KEY);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(exp.json());

//db connection
connectDB();
app.options("/create-checkout-session", cors());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { unitPrice } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Rental due",
            },
            unit_amount: unitPrice, // Use the unitPrice received in the request
          },
          quantity: 1, // Adjust quantity if needed
        },
      ],
      success_url: `${process.env.CLIENT_URL}/`,
      cancel_url: `${process.env.CLIENT_URL}/profile`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const communityAPI = require("./APIs/Communitydata");
const ownerAPI = require("./APIs/ownersData");
const userAPI = require("./APIs/usersData");
const maintenanceAPI = require("./APIs/maintenanceData");

app.use("/communitydata", (req, res, next) => {
  communityAPI(req, res, next);
});

// app.use("/ownerData", ownerAPI);

app.use("/ownerData", (req, res, next) => {
  ownerAPI(req, res, next);
});

// app.use("/userData", ownerAPI);

app.use("/userData", (req, res, next) => {
  userAPI(req, res, next);
});

// app.use("/maintenanceData", maintenanceAPI);

app.use("/maintenanceData", (req, res, next) => {
  maintenanceAPI(req, res, next);
});

//handle invalid paths
app.use((err, req, res, next) => {
  res.send({ message: req.url + " is invalid path" });
});

//error handling
app.use((err, req, res, next) => {
  res.send({ message: "Error occured", reason: err.message });
});

app.listen(5000, () => console.log("server is on port 5000"));
