const promisePool = require("../config/db");

// student can talk only with instructor/admin
// instructor can talk with anyone (student/admin/instructor)
// admin can talk with anyone
function canChat(roleA, roleB) {
  if (roleA === "student") return roleB === "instructor" || roleB === "admin";
  if (roleA === "instructor")
    return roleB === "student" || roleB === "admin" || roleB === "instructor";
  if (roleA === "admin") return true;
  return false;
}

function normalizeEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

exports.listConversations = async (req, res, next) => {
  try {
    const myId = Number(req.user.id);

    const lastMessageSql = `(SELECT m.body FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1)`;
    const lastTimeSql = `(SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1)`;

    const [rows] = await promisePool.query(
      `
      SELECT 
        c.id,

        CASE WHEN c.user1_id = ?
          THEN COALESCE(u2.username, SUBSTRING_INDEX(u2.email,'@',1))
          ELSE COALESCE(u1.username, SUBSTRING_INDEX(u1.email,'@',1))
        END AS other_name,

        CASE WHEN c.user1_id = ?
          THEN u2.email
          ELSE u1.email
        END AS other_email,

        CASE WHEN c.user1_id = ?
          THEN u2.role
          ELSE u1.role
        END AS other_role,

        CASE WHEN c.user1_id = ?
          THEN u2.image_path
          ELSE u1.image_path
        END AS other_image,

        ${lastMessageSql} AS last_message,
        ${lastTimeSql} AS last_time

      FROM conversations c
      JOIN users u1 ON u1.id = c.user1_id
      JOIN users u2 ON u2.id = c.user2_id
      WHERE c.user1_id = ? OR c.user2_id = ?

      ORDER BY
        COALESCE(${lastTimeSql}, '1970-01-01 00:00:00') DESC,
        c.id DESC
      `,
      [myId, myId, myId, myId, myId, myId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

exports.startConversation = async (req, res, next) => {
  try {
    const myId = Number(req.user.id);
    const myRole = req.user.role;
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email is required" });
    }

    const [otherRows] = await promisePool.query(
      `
      SELECT id, username, email, role, image_path
      FROM users
      WHERE LOWER(email) = ?
      LIMIT 1
      `,
      [email]
    );

    const other = otherRows?.[0];
    if (!other) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (Number(other.id) === myId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot chat with yourself." });
    }

    if (!canChat(myRole, other.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to chat with this user.",
      });
    }

    // store ordered pair so duplicates never happen
    const a = Math.min(myId, Number(other.id));
    const b = Math.max(myId, Number(other.id));

    const [existingRows] = await promisePool.query(
      "SELECT id FROM conversations WHERE user1_id = ? AND user2_id = ? LIMIT 1",
      [a, b]
    );

    if (existingRows.length) {
      return res.json({
        success: true,
        data: {
          conversation_id: existingRows[0].id,
          other: {
            id: other.id,
            username: other.username || String(other.email).split("@")[0],
            email: other.email,
            role: other.role,
            image_path: other.image_path,
          },
        },
      });
    }

    const [result] = await promisePool.query(
      "INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)",
      [a, b]
    );

    res.json({
      success: true,
      data: {
        conversation_id: result.insertId,
        other: {
          id: other.id,
          username: other.username || String(other.email).split("@")[0],
          email: other.email,
          role: other.role,
          image_path: other.image_path,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const myId = Number(req.user.id);
    const convId = Number(req.params.id);

    const [convRows] = await promisePool.query(
      "SELECT id FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?) LIMIT 1",
      [convId, myId, myId]
    );

    if (!convRows.length) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    const [msgs] = await promisePool.query(
      `
      SELECT 
        m.id,
        m.sender_id,
        COALESCE(u.username, SUBSTRING_INDEX(u.email,'@',1)) AS sender_username,
        m.body,
        m.created_at
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
      `,
      [convId]
    );

    res.json({ success: true, data: msgs });
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const myId = Number(req.user.id);
    const convId = Number(req.params.id);
    const body = String(req.body.body || "").trim();

    if (!body) {
      return res.status(400).json({ success: false, message: "Message is empty" });
    }

    const [convRows] = await promisePool.query(
      "SELECT user1_id, user2_id FROM conversations WHERE id = ? LIMIT 1",
      [convId]
    );

    if (!convRows.length) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    const user1 = Number(convRows[0].user1_id);
    const user2 = Number(convRows[0].user2_id);

    if (user1 !== myId && user2 !== myId) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    const otherId = user1 === myId ? user2 : user1;

    const [result] = await promisePool.query(
      "INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)",
      [convId, myId, body]
    );

    const [meRows] = await promisePool.query(
      `SELECT COALESCE(username, SUBSTRING_INDEX(email,'@',1)) AS sender_username
       FROM users WHERE id = ? LIMIT 1`,
      [myId]
    );

    const payload = {
      id: result.insertId,
      conversation_id: convId,
      sender_id: myId,
      sender_username: meRows?.[0]?.sender_username || "User",
      body,
      created_at: new Date().toISOString(),
    };

    const io = req.app.get("io");

    if (io) {
      // open chat updates
      io.to(`conv:${convId}`).emit("message:new", payload);

      // sidebar updates for both users
      io.to(`user:${myId}`).emit("conversation:update", {
        id: convId,
        last_message: body,
        last_time: payload.created_at,
      });

      io.to(`user:${otherId}`).emit("conversation:update", {
        id: convId,
        last_message: body,
        last_time: payload.created_at,
      });
    }

    res.json({ success: true, data: payload });
  } catch (err) {
    next(err);
  }
};



