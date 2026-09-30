const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'surveys.db');
const db = new Database(dbPath);

// Tối ưu hóa hiệu năng cao cho SQLite (WAL mode xử lý đọc ghi đồng thời cực tốt)
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

// Khởi tạo bảng dữ liệu
db.exec(`
  CREATE TABLE IF NOT EXISTS surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_code TEXT UNIQUE NOT NULL,
    selected_project TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    email TEXT,
    answers_json TEXT NOT NULL,
    comments_json TEXT NOT NULL,
    other_opinion TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_surveys_project ON surveys(selected_project);
  CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at);
  CREATE INDEX IF NOT EXISTS idx_surveys_receipt_code ON surveys(receipt_code);
`);

const projectNames = {
  st3: 'Quy hoạch phân khu đô thị ST3',
  xuankhanh: 'Quy hoạch vùng hồ Xuân Khanh và phụ cận',
  both: 'Cả hai đồ án (ST3 & Xuân Khanh)'
};

// Insert khảo sát
function insertSurvey(data) {
  const stmt = db.prepare(`
    INSERT INTO surveys (
      receipt_code, selected_project, full_name, phone, address, email,
      answers_json, comments_json, other_opinion, ip_address, user_agent, created_at
    ) VALUES (
      @receipt_code, @selected_project, @full_name, @phone, @address, @email,
      @answers_json, @comments_json, @other_opinion, @ip_address, @user_agent, @created_at
    )
  `);

  return stmt.run({
    receipt_code: data.receiptCode,
    selected_project: data.selectedProject,
    full_name: data.fullName,
    phone: data.phone || null,
    address: data.address,
    email: data.email || null,
    answers_json: JSON.stringify(data.answers || {}),
    comments_json: JSON.stringify(data.comments || {}),
    other_opinion: data.otherOpinion || null,
    ip_address: data.ipAddress || null,
    user_agent: data.userAgent || null,
    created_at: data.createdAt || new Date().toISOString()
  });
}

// Thống kê số liệu tóm tắt
function getStats() {
  const totalRow = db.prepare('SELECT COUNT(*) as count FROM surveys').get();
  const st3Row = db.prepare("SELECT COUNT(*) as count FROM surveys WHERE selected_project = 'st3'").get();
  const xkRow = db.prepare("SELECT COUNT(*) as count FROM surveys WHERE selected_project = 'xuankhanh'").get();
  const bothRow = db.prepare("SELECT COUNT(*) as count FROM surveys WHERE selected_project = 'both'").get();

  // Đếm tỷ lệ đồng thuận trên toàn bộ câu trả lời
  const allSurveys = db.prepare('SELECT answers_json FROM surveys').all();
  let totalVotes = 0;
  let agreeVotes = 0;
  let disagreeVotes = 0;

  allSurveys.forEach(row => {
    try {
      const answers = JSON.parse(row.answers_json || '{}');
      Object.values(answers).forEach(val => {
        totalVotes++;
        if (val === 'Đồng thuận') agreeVotes++;
        else if (val === 'Chưa đồng thuận') disagreeVotes++;
      });
    } catch (e) {}
  });

  const agreeRate = totalVotes > 0 ? Math.round((agreeVotes / totalVotes) * 100) : 0;
  const disagreeRate = totalVotes > 0 ? (100 - agreeRate) : 0;

  return {
    totalSurveys: totalRow.count,
    projectCounts: {
      st3: st3Row.count,
      xuankhanh: xkRow.count,
      both: bothRow.count
    },
    votingStats: {
      totalVotes,
      agreeVotes,
      disagreeVotes,
      agreeRate,
      disagreeRate
    }
  };
}

// Lấy danh sách khảo sát có tìm kiếm & lọc
function getSurveys({ page = 1, limit = 20, project = '', search = '' }) {
  let query = 'SELECT * FROM surveys WHERE 1=1';
  const params = {};

  if (project && project !== 'all') {
    query += ' AND selected_project = @project';
    params.project = project;
  }

  if (search && search.trim()) {
    query += ' AND (full_name LIKE @search OR address LIKE @search OR phone LIKE @search OR receipt_code LIKE @search)';
    params.search = `%${search.trim()}%`;
  }

  // Count total
  const countSql = query.replace('SELECT *', 'SELECT COUNT(*) as count');
  const totalCount = db.prepare(countSql).get(params).count;

  // Pagination
  query += ' ORDER BY id DESC LIMIT @limit OFFSET @offset';
  params.limit = Number(limit) || 20;
  params.offset = (Math.max(1, Number(page)) - 1) * params.limit;

  const rows = db.prepare(query).all(params);

  // Parse JSON fields
  const surveys = rows.map(r => ({
    ...r,
    projectName: projectNames[r.selected_project] || r.selected_project,
    answers: JSON.parse(r.answers_json || '{}'),
    comments: JSON.parse(r.comments_json || '{}')
  }));

  return {
    total: totalCount,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(totalCount / params.limit) || 1,
    surveys
  };
}

// Lấy toàn bộ danh sách để xuất Excel
function getAllSurveysForExport() {
  const rows = db.prepare('SELECT * FROM surveys ORDER BY id DESC').all();
  return rows.map(r => ({
    ...r,
    projectName: projectNames[r.selected_project] || r.selected_project,
    answers: JSON.parse(r.answers_json || '{}'),
    comments: JSON.parse(r.comments_json || '{}')
  }));
}

// Admin management
function findAdminByUsername(username) {
  return db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
}

function createAdmin({ username, passwordHash, fullName }) {
  const stmt = db.prepare(`
    INSERT INTO admins (username, password_hash, full_name, created_at)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(username, passwordHash, fullName, new Date().toISOString());
}

function getAdminCount() {
  return db.prepare('SELECT COUNT(*) as count FROM admins').get().count;
}

module.exports = {
  db,
  insertSurvey,
  getStats,
  getSurveys,
  getAllSurveysForExport,
  findAdminByUsername,
  createAdmin,
  getAdminCount,
  projectNames
};
