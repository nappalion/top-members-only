const pool = require("./pool");

async function getUser(username) {
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

async function setMember() {}

async function setAdmin() {}

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
  getUser,
  createUser,
  getMessages,
  createMessage,
  deleteMessage,
  setMember,
  setAdmin,
};
