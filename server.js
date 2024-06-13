require("appdynamics").profile({
  controllerHostName: "baseball202406100516177.saas.appdynamics.com",
  controllerPort: 443,
  // If SSL, be sure to enable the next line
  controllerSslEnabled: true,
  accountName: "baseball202406100516177",
  accountAccessKey: "9sc7nfhk9mie",
  applicationName: "ozoneapp",
  tierName: "oneozone",
  nodeName: "process", // The controller will automatically append the node name with a unique number
});
const express = require("express");
const app = express();
const port = 3000;

const FIB_CACHE = {};

/**
 * Intercept and cache the fibonacci function, using a in-memory object.
 *
 * Server-side cache, preper HTTP layer caching when possible.
 */
const withCache = (fibonacci) => (num) => {
  if (FIB_CACHE[num]) {
    console.log(`cache found for ${num}`);
    return FIB_CACHE[num];
  }

  const result = fibonacci(num);

  console.log(`adding cache for ${num}`);
  FIB_CACHE[num] = result;

  return result;
};

function fibonacci(num) {
  var n1 = 0; // declaration of variables n1, n2, i and temp.
  var n2 = 1;
  var temp;
  var i = 0;
  for (i = 0; i < num; i++) {
    temp = n1 + n2; // store the sum of n1 and n2 in temp variable.
    n1 = n2; // assign the n2 value into the n1 variable
    n2 = temp; // assign the new value of temp into n2 variable
  }
  return n2;
}

/**
 * min and max included
 */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

app.get("/", async (req, res) => {
  const num = randomIntFromInterval(100000000, 100000050); // 50 number range

  console.time(`fibonacci(${num})`);
  const result = withCache(fibonacci)(num);
  console.timeEnd(`fibonacci(${num})`);

  res.status(200).send({fib: result});
});

app.get("/error", async (req, res) => {
  res.status(500).send({error: "Internal server error"});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}, pid ${process.pid}`);
});
