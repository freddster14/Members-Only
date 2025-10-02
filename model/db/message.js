const pool = require('./pool');

exports.createMessage = async (content) => {
  await pool.query(
    'INSERT INTO messages (title, message, author_id) VALUES ($1,$2,$3)',
    [
      content.title,
      content.message,
      content.authorId,
    ],
  );
};
