const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Double check this path to your DB config

router.get('/', async (req, res) => {
  try {
    // Your screenshot showed categories are in the 'categories' table
    const [rows] = await db.query('SELECT id, name FROM categories');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;