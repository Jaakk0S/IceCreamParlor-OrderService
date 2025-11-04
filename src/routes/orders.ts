// @ts-check

import express from "express";

const router = express.Router();

router.post('/v1/place', async (req, res) => {

  var jsonObj;
  try {
    jsonObj = JSON.parse(req.body);
  } catch (e) {
    return res.status(400).send('JSON parse error: ' + e);
  }

  try {
    const { customer_name } = jsonObj;
    const { products } = jsonObj;
    console.log(customer_name);
    console.log(products);
  } catch (e) {
    return res.status(400).send('products and customer_name are required');
  }
  res.send('not implemented');
});

module.exports = router;
