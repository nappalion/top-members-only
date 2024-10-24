const pool = require("./pool");

async function getUserByUsername(username) {
  const { rows } = await pool
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then((res) => {
      console.log(`Retrieved user.`);
      return res;
    })
    .catch((err) => {
      throw err;
    });

  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool
    .query(`SELECT * FROM users WHERE id=$1`, [id])
    .then((res) => {
      console.log(`Retrieved user.`);
      return res;
    })
    .catch((err) => {
      throw err;
    });

  return rows[0];
}

async function createUser(first_name, last_name, username, password) {
  await pool
    .query(
      `INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)`,
      [first_name, last_name, username, password]
    )
    .then(() => console.log(`Created user.`))
    .catch((err) => {
      throw err;
    });
}

async function setMember(id) {
  await pool
    .query(`UPDATE users SET membership_status=true WHERE id = $1`, [id])
    .then(() => console.log(`Updated user to member.`))
    .catch((err) => {
      throw err;
    });
}

async function setAdmin(id) {
  await pool
    .query(`UPDATE users SET admin_status=true WHERE id = $1`, [id])
    .then(() => console.log(`Updated user to admin.`))
    .catch((err) => {
      throw err;
    });
}

async function getAdminSecret() {
  const { rows } = await pool
    .query(`SELECT password AS admin_password FROM secrets WHERE type='admin'`)
    .then((res) => {
      console.log(`Retrieved admin secret.`);
      return res;
    })
    .catch((err) => {
      throw err;
    });

  return rows[0].admin_password;
}

async function getMemberSecret() {
  const { rows } = await pool
    .query(
      `SELECT password AS member_password FROM secrets WHERE type='member'`
    )
    .then((res) => {
      console.log(`Retrieved member secret.`);
      return res;
    })
    .catch((err) => {
      throw err;
    });

  return rows[0].member_password;
}

async function getMessages() {
  const { rows } = await pool
    .query(`SELECT * FROM messages`)
    .then((res) => {
      console.log(`Retrieved all messages.`);
      return res;
    })
    .catch((err) => {
      throw err;
    });

  return rows;
}

async function createMessage(title, text, user_id) {
  await pool
    .query(`INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)`, [
      title,
      text,
      user_id,
    ])
    .then(() => console.log(`Created message.`))
    .catch((err) => {
      throw err;
    });
}

async function deleteMessage(id) {
  await pool
    .query(`DELETE FROM messages WHERE id=$1`, [id])
    .then(() => console.log(`Deleted item.`))
    .catch((err) => {
      throw err;
    });
}

module.exports = {
  getUserByUsername,
  getUserById,
  createUser,
  getMessages,
  createMessage,
  deleteMessage,
  setMember,
  setAdmin,
  getAdminSecret,
  getMemberSecret,
};
