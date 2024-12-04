import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()
const local = { comments: []};

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

// Create student1 table
db.run(`CREATE TABLE student3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL,
  author TEXT NOT NULL)`)

// Create student2 table
db.run(`CREATE TABLE student2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL,
  author TEXT NOT NULL)`)

// Create student3 table
db.run(`CREATE TABLE student1 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL,
  author TEXT NOT NULL)`)

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  local.comments = [];
  console.log('GET called')
  res.render('index')
})

// Render student1 page
app.get('/student1', function (req, res) {

  local.comments = [];

  // Get 5 rand comments
  db.all(
    `SELECT id, comment, author FROM student1 ORDER BY RANDOM() LIMIT 5`,
    function (err, rows) {
      if (err) {
        console.log(err);
      }
      local.comments = rows;
      res.render('student1');
    }
  );
});

// Render student1 page
app.get('/student2', function (req, res) {

  local.comments = [];

  // Get 5 rand comments
  db.all(
    `SELECT id, comment, author FROM student2 ORDER BY RANDOM() LIMIT 5`,
    function (err, rows) {
      if (err) {
        console.log(err);
      }
      local.comments = rows;
      res.render('student2');
    }
  );
});

// Populate student3 page
app.get('/student3', function (req, res) {

  // Get 5 rand comments
  db.all(
    `SELECT id, comment, author FROM student3 ORDER BY RANDOM() LIMIT 5`,
    function (err, rows) {
      if (err) {
        console.log(err);
      }
      local.comments = rows; 
      res.render('student3', local);
    }
  );
});

app.get('/:student/comments', (req, res) => {
  const { student } = req.params;

  // Get all comments for given student
  db.all(
    `SELECT id, comment, author FROM ${student} ORDER BY RANDOM()`,
    (err, rows) => {
      if (err) {
        console.error(err);
      }
      local.comments = rows;
      res.render('student3/comments', local);
    }
  );
});

/**
 * Add new comment to a specific student table
 */
app.post('/:student/comments', function (req, res) {
  const { student } = req.params;

  const stmt_insert = db.prepare(`INSERT INTO ${student} (comment, author) VALUES (?, ?)`);
  stmt_insert.run(req.body.comment, req.body.author);
  stmt_insert.finalize();
  res.redirect(`/${student}/comments`);
});

/**
 * Delete comment from a specific student table
 */
app.post('/:student/comments/delete', function (req, res) {
  const { student } = req.params;

  const stmt_delete = db.prepare(`DELETE FROM ${student} WHERE id = ?`);
  stmt_delete.run(req.body.id);
  stmt_delete.finalize();
  res.redirect(`/${student}/comments`);
});

/**
 * Load page for updating comments
 */
app.get('/:student/comments/update', (req, res) => {
  const { student } = req.params;
  const { id } = req.query;

  // Get specific object from db
  db.get(
    `SELECT id, comment, author FROM ${student} WHERE id = ? ORDER BY id ASC`,
    [id],
    (err, row) => {
      local.comments = row;
      res.render(student + '/commentUpdate', local);
    }
  );
});

/**
 * Update comment from a specific student table
 */
app.post('/:student/comments/update', (req, res) => {
  const { student } = req.params;
  const { id, comment, author } = req.body;

  // Update the comment in the database
  const stmt_update = db.prepare(`UPDATE ${student} SET comment = ?, author = ? WHERE id = ?`);
  stmt_update.run(comment, author, id, function (err) {
    if (err) {
      console.error(err);
    }
    // Go back to comment page afterwards
    res.redirect(`/${student}/comments`);
  });
});

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
