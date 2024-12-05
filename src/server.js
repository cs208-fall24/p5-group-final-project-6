import express from 'express';
import sql from 'sqlite3';

const sqlite3 = sql.verbose()
const local = { comments: []};

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

// Create student1 table
db.run(`CREATE TABLE student1 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL,
  author TEXT NOT NULL)`)

// Create student2 table
db.run(`CREATE TABLE student2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL,
  author TEXT NOT NULL)`)

// Create student3 table
db.run(`CREATE TABLE student3 (
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
  console.log('GET called')
  res.render('student1')
})

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

// Render student2 page
app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

app.get('/comments', function (req, res) {
  console.log('GET called')
  res.render('student2/comments')
})

app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})