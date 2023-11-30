// const Stripe = require("stripe"); // Replace with your Stripe Secret Key
// const express = require("express");
// const app = express();

// require("dotenv").config();

// const stripe = Stripe(process.env.STRIPE_KEY);
// const router = express.Router();
// // Function to create a payment intent
// /* const createPaymentIntent = async (amount, currency, paymentMethod) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount, // Payment amount in cents
//       currency: currency, // Currency code (e.g., 'usd')
//       payment_method: paymentMethod, // Payment method ID obtained from the client
//       confirm: true, // Confirm the payment immediately
//     });

//     // Return the payment intent object
//     return paymentIntent;
//   } catch (error) {
//     throw error;
//   }
// };

// // Function to create a customer
// const createCustomer = async (email) => {
//   try {
//     const customer = await stripe.customers.create({
//       email: email,
//     });

//     // Return the customer object
//     return customer;
//   } catch (error) {
//     throw error;
//   }
// }; */

// // router.post("/create-checkout-session", async (req, res) => {
// //   const session = await stripe.checkout.sessions.create({
// //     line_items: [
// //       {
// //         price_data: {
// //           currency: "usd",
// //           product_data: {
// //             name: "Rent",
// //           },
// //           unit_amount: 2000,
// //         },
// //         quantity: 1,
// //       },
// //     ],
// //     mode: "payment",
// //     success_url: "${process.env.CLIENT_URL}/checkout-success",
// //     cancel_url: "${process.env.CLIENT_URL}/profile",
// //   });

// //   res.send({ url: session.url });
// // });
// app.post("/create-checkout-session", async (req, res) => {
//   const { currency, amount } = req.body; // Accept currency and amount from the request body

//   // Use the received currency and amount to create the checkout session
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: currency, // Use the received currency value
//           product_data: {
//             name: "Rent",
//           },
//           unit_amount: amount, // Use the received amount value
//         },
//         quantity: 1,
//       },
//     ],
//     payment_method_types: ["card"],
//     mode: "payment",
//     success_url: `${process.env.CLIENT_URL}/`,
//     cancel_url: `${process.env.CLIENT_URL}/profile`,
//   });

//   res.send({ url: session.url });
// });

// module.exports = router;
// /* module.exports = {
//   createPaymentIntent,
//   createCustomer,
// }; */
