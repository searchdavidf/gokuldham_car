const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const dbFile = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(dbFile);

// simple migrations
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    dob TEXT,
    num_members INTEGER,
    num_cars INTEGER,
    car_numbers TEXT,
    status TEXT,
    password_hash TEXT,
    created_at TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    body TEXT,
    image TEXT,
    publish_date TEXT
  )`);
});

const app = express();
app.use(bodyParser.json());
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMeNow!';

function checkAdmin(req, res, next){
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice('Bearer '.length);
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    if(payload.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.admin = payload;
    return next();
  }catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// admin login - returns a token when correct admin password supplied
app.post('/api/admin/login', (req, res)=>{
  const { password } = req.body;
  if(!password) return res.status(400).json({ error: 'Missing password' });
  if(password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid password' });
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

app.post('/api/signup', (req, res) => {
  const { full_name, email, phone, address, dob, num_members, num_cars, car_numbers } = req.body;
  if (!full_name || !email) return res.status(400).json({ error: 'Missing required fields' });
  const now = new Date().toISOString();
  db.run(`INSERT INTO users (full_name,email,phone,address,dob,num_members,num_cars,car_numbers,status,created_at)
          VALUES (?,?,?,?,?,?,?,?,?,?)`, [full_name,email,phone,address,dob,num_members,num_cars,JSON.stringify(car_numbers||[]),'pending',now], function(err){
    if(err) return res.status(500).json({ error: err.message });
    return res.json({ id: this.lastID, status: 'pending' });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing' });
  db.get('SELECT * FROM users WHERE email = ? AND status = "active"', [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    bcrypt.compare(password, row.password_hash || '', (e, ok) => {
      if (e) return res.status(500).json({ error: e.message });
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: row.id, email: row.email, role: 'member' }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token });
    });
  });
});

// admin: list pending
app.get('/api/admin/pending', checkAdmin, (req, res) => {
  db.all('SELECT * FROM users WHERE status = "pending"', [], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r=>({ ...r, car_numbers: JSON.parse(r.car_numbers||'[]') })));
  });
});

// admin approve user (sets password_hash and status active)
app.post('/api/admin/approve', checkAdmin, (req, res) => {
  const { userId, password } = req.body;
  if(!userId || !password) return res.status(400).json({ error: 'Missing' });
  bcrypt.hash(password, 10, (err, hash) => {
    if(err) return res.status(500).json({ error: err.message });
    db.run('UPDATE users SET password_hash = ?, status = "active" WHERE id = ?', [hash, userId], function(e){
      if(e) return res.status(500).json({ error: e.message });
      res.json({ ok: true });
    });
  });
});

app.post('/api/admin/reject', checkAdmin, (req, res) => {
  const { userId } = req.body;
  if(!userId) return res.status(400).json({ error: 'Missing' });
  db.run('DELETE FROM users WHERE id = ?', [userId], function(err){
    if(err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

// notices
app.get('/api/notices', (req, res) => {
  db.all('SELECT * FROM notices ORDER BY publish_date DESC', [], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admin/notice', checkAdmin, upload.single('image'), (req, res) => {
  const { title, body } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;
  const publish_date = new Date().toISOString();
  db.run('INSERT INTO notices (title,body,image,publish_date) VALUES (?,?,?,?)', [title, body, image, publish_date], function(err){
    if(err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend running on', PORT));
