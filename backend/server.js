require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= AUTH ================= */

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT id, username, role, password_hash FROM users WHERE username = $1",
    [username],
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "User not found" });
  }

  const user = result.rows[0];

  // sementara plain text (nanti bisa bcrypt)
  if (user.password_hash !== password) {
    return res.status(401).json({ message: "Wrong password" });
  }

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
  });
});

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username & password required" });
  }

  try {
    // cek username sudah ada
    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // sementara plain text (nanti bisa bcrypt)
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, role)
       VALUES ($1, $2, 'user')
       RETURNING id, username, role`,
      [username, password],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user" });
  }
});

/* ================= POSTS ================= */

// List posts (public + admin)
app.get("/api/posts", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM posts ORDER BY created_at DESC",
  );
  res.json(result.rows);
});

// Single post
app.get("/api/posts/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [
    req.params.id,
  ]);
  res.json(result.rows[0]);
});

// Create post (admin)
app.post("/api/posts", async (req, res) => {
  const { title, excerpt, content, category, featured_image, author_name } =
    req.body;

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  const result = await pool.query(
    `INSERT INTO posts 
     (title, slug, excerpt, content, category, featured_image, author_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [title, slug, excerpt, content, category, featured_image, author_name],
  );

  res.json(result.rows[0]);
});

// Update post
app.put("/api/posts/:id", async (req, res) => {
  const { title, excerpt, content, category, featured_image, author_name } =
    req.body;

  const result = await pool.query(
    `UPDATE posts SET
      title=$1,
      excerpt=$2,
      content=$3,
      category=$4,
      featured_image=$5,
      author_name=$6,
      updated_at=NOW()
     WHERE id=$7
     RETURNING *`,
    [
      title,
      excerpt,
      content,
      category,
      featured_image,
      author_name,
      req.params.id,
    ],
  );

  res.json(result.rows[0]);
});

// Delete post
app.delete("/api/posts/:id", async (req, res) => {
  await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

/* ================= COMMENTS ================= */

// List comments (nested nanti di frontend)
app.get("/api/posts/:id/comments", async (req, res) => {
  const result = await pool.query(
    `SELECT c.*, u.username 
     FROM comments c
     LEFT JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [req.params.id],
  );

  res.json(result.rows);
});

// Add comment
app.post("/api/posts/:id/comments", async (req, res) => {
  const { user_id, content, parent_id } = req.body;

  const result = await pool.query(
    `INSERT INTO comments (post_id, user_id, parent_id, content)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [req.params.id, user_id, parent_id || null, content],
  );

  res.json(result.rows[0]);
});

app.listen(process.env.PORT, () => {
  console.log("Backend running on port", process.env.PORT);
});
