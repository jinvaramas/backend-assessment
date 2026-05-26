# Backend Assessment Brief

## The Task

Build a REST API for a shopping cart using **Express.js**.

Your API will manage a list of `products`. By the end of the assessment you should have a working server that can create, read, update, and delete products — and you should be able to explain how and why it works.

---

## A Note on AI Tools

You are free to use AI tools (ChatGPT, Claude, Copilot, etc.). This is not a memory test.

What the assessment measures is your **understanding**. You need to be able to explain your code, reason about it, and answer questions on it. If you use AI to generate something you do not understand, it will show in your video.

The best approach: use AI as a learning tool, not a shortcut. Ask it to explain things, not just produce them.

---

## What You Are Building

A REST API with the following routes:

| Method | Route | Description |
|---|---|---|
| GET | `/products` | Return all products |
| GET | `/products/:id` | Return a single product by ID |
| POST | `/products` | Add a new product |
| PUT or PATCH | `/products/:id` | Update an existing product |
| DELETE | `/products/:id` | Remove a product |

### The Product

Each product should have at minimum:

| Field | Type | Notes |
|---|---|---|
| `id` | string | Generated when a product is created (e.g. `String(Date.now())`) |
| `name` | string | Required |
| `price` | number | Required |
| `quantity` | number | Required, defaults to `1` |

---

## Requirements

### Core (everyone)

- [ ] Express server created and listening on a port
- [ ] `node --watch` used to run the server (no need for nodemon)
- [ ] `express.json()` middleware applied
- [ ] All five routes implemented (GET all, GET one, POST, PUT/PATCH, DELETE)
- [ ] Route parameters used to identify a product (`/products/:id`)
- [ ] At least one query string supported (e.g. filter by name or sort by price)
- [ ] Products stored in an in-memory array (no database required)
- [ ] Correct HTTP status codes returned (200, 201, 400, 404)
- [ ] At least one custom middleware written (e.g. a request logger)
- [ ] Error handling middleware included at the end of the middleware chain
- [ ] Meaningful error messages returned when something goes wrong

### Stretch (if you finish early)

- [ ] Connect to a **MongoDB Atlas** database and persist products there
- [ ] Validate incoming request data — reject missing or invalid fields with a 400 response
- [ ] Move your routes into a separate file using `express.Router()`

---

## Folder Structure

### Core

```
your-project/
├── index.js
├── my-understanding.md
└── package.json
```

### With stretch goals

```
your-project/
├── index.js
├── routes/
│   └── products.js
├── models/
│   └── Product.js
├── my-understanding.md
└── package.json
```

---

## Tooling

**Running your server**
```bash
node --watch index.js
```

**Testing your routes**

Use the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension. Create a file called `requests.http` in your project and write your requests there — you can run them with a single click inside VS Code. Postman is also fine if you prefer it.

Example `requests.http`:
```http
### Get all products
GET http://localhost:3000/products

### Add a product
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Keyboard",
  "price": 49.99,
  "quantity": 1
}
```

---

## Submission

Here is what to prepare and where each piece goes:

### 1. GitHub Repository — link goes in the Google Sheet
Push your project to a **public** GitHub repository. Paste the link into the shared Google Sheet your instructor has provided.

> The repo must be set to **public** — a private repo cannot be reviewed.

### 2. my-understanding.md — lives inside your GitHub repo
Use `MY_UNDERSTANDING_TEMPLATE.md` as your starting point — copy it into your project, rename it `my-understanding.md`, and answer all 10 questions in your own words.

Write as if explaining to a friend. Do not copy from documentation or AI output. This file is not marked separately — it exists to prepare you for the video. Learners who complete it first consistently find the video much easier to record.

Once your Loom video is recorded, paste the link into the designated field at the top of `my-understanding.md` and push the update to GitHub.

### 3. Loom Video (5 minutes max) — link goes inside my-understanding.md
Record a screen + camera video using [Loom](https://loom.com) (free account). Once recorded, open the video in Loom, set sharing to **public (anyone with the link)**, copy the link, and paste it into the designated field at the top of your `my-understanding.md`.

> A Loom video set to private cannot be reviewed — check the sharing setting before submitting.

**Structure your 5 minutes like this:**

| What to cover | Time |
|---|---|
| Demo at least one route working live using REST Client | ~1 min |
| Walk through your server setup and middleware | ~1 min |
| Walk through your routes and CRUD logic | ~1.5 min |
| Explain your error handling | ~30 sec |
| Choose a question from the list below, read it out loud, then answer it | ~1 min |

Speak as you go — explain what each part does and *why* you wrote it that way. Do not read from a script.

---

## Question for the Video

At the end of your recording, choose **one** question from the list below. Read it out loud on camera, then answer it before the 5 minutes runs out. Do not prepare a scripted answer — just speak from your understanding.

- "What would break if you removed `express.json()` from your app?"
- "Explain what `req.params` is and give an example from your code."
- "Why does a POST request return a 201 instead of a 200?"
- "What is middleware and why does order matter?"
- "Walk me through exactly what happens on the server when a DELETE request is received."

---

## Tips

- **Start with `index.js` and get the server running first** — a response from any route, even a hardcoded one, is a good foundation.
- **Complete `my-understanding.md` before recording** — it will make the video noticeably easier.
- **Practise your 5-minute run-through once before recording** — Loom cannot be edited after the 5-minute cap cuts you off.
- **Your score reflects your understanding, not your seniority.** A clean, well-explained core submission scores better than a rushed stretch goal you cannot explain.
