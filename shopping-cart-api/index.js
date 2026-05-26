const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); 
});

let products = [
  { id: "1", name: "Guitar", price: 4500, quantity: 3 },
  { id: "2", name: "Vinyl Record", price: 350, quantity: 10 },
  { id: "3", name: "Headphones", price: 1200, quantity: 5 },
];

app.get("/products", (req, res) => {
  let result = [...products];

   if (req.query.name) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }

    if (req.query.sort === "price") {
    result.sort((a, b) => a.price - b.price);
  }

  res.status(200).json(result);
});

app.get("/products/:id", (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.status(200).json(product);
});

app.post("/products", (req, res, next) => {
  const { name, price, quantity } = req.body;

  // Validate — name และ price ต้องมีเสมอ
  if (!name || price === undefined) {
    const err = new Error("name and price are required");
    err.status = 400;
    return next(err);
  }

  if (typeof price !== "number" || price < 0) {
    const err = new Error("price must be a non-negative number");
    err.status = 400;
    return next(err);
  }

  const newProduct = {
    id: String(Date.now()), 
    name,
    price,
    quantity: quantity ?? 1, 
  };

  products.push(newProduct);
  res.status(201).json(newProduct); 
});

app.patch("/products/:id", (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  
  products[index] = { ...products[index], ...req.body };
  res.status(200).json(products[index]);
});


app.delete("/products/:id", (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  const deleted = products.splice(index, 1); 
  res.status(200).json({ message: "Product deleted", product: deleted[0] });
});


app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

