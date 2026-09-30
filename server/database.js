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
db.pragma('busy_timeout = 5000');
db.pragma('cache_size = -64000');
db.pragma('temp_store = MEMORY');
db.pragma('mmap_size = 268435456');

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
  merged: 'Quy hoạch phân khu đô thị ST3, tỷ lệ 1/2000; Quy hoạch phân khu khu chức năng vùng hồ Xuân Khanh và phụ cận, tỷ lệ 1/2000.',
  both: 'Quy hoạch phân khu đô thị ST3, tỷ lệ 1/2000; Quy hoạch phân khu khu chức năng vùng hồ Xuân Khanh và phụ cận, tỷ lệ 1/2000.',
  st3: 'Quy hoạch phân khu đô thị ST3, tỷ lệ 1/2000',
  xuankhanh: 'Quy hoạch phân khu khu chức năng vùng hồ Xuân Khanh và phụ cận, tỷ lệ 1/2000'
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
    selected_project: data.selectedProject || 'merged',
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

let cachedStats = null;
let cachedStatsTime = 0;

// Thống kê số liệu tóm tắt (có bộ đệm 2s siêu tốc)
function getStats() {
  const now = Date.now();
  if (cachedStats && (now - cachedStatsTime < 2000)) {
    return cachedStats;
  }

  const totalRow = db.prepare('SELECT COUNT(*) as count FROM surveys').get();
  const mergedRow = db.prepare("SELECT COUNT(*) as count FROM surveys WHERE selected_project = 'merged' OR selected_project = 'both'").get();

  // Đếm tỷ lệ đồng thuận trên toàn bộ câu trả lời và theo từng câu hỏi
  const allSurveys = db.prepare('SELECT answers_json FROM surveys').all();
  let totalVotes = 0;
  let agreeVotes = 0;
  let disagreeVotes = 0;

  const questionStats = {
    q1: { agree: 0, disagree: 0, title: 'Tính chất và chức năng khu vực' },
    q2: { agree: 0, disagree: 0, title: 'Phương án quy hoạch' },
    q3: { agree: 0, disagree: 0, title: 'Đồng ý triển khai các bước tiếp theo' }
  };

  allSurveys.forEach(row => {
    try {
      const answers = JSON.parse(row.answers_json || '{}');
      Object.entries(answers).forEach(([key, val]) => {
        let mappedKey = null;
        if (key === 'q1' || key === 'st3_q3' || key === 'xk_q3' || key === 'merged_q1') {
          mappedKey = 'q1';
        } else if (key === 'q2' || key === 'st3_q4' || key === 'xk_q4' || key === 'merged_q2') {
          mappedKey = 'q2';
        } else if (key === 'q3' || key === 'st3_q5' || key === 'xk_q5' || key === 'merged_q3') {
          mappedKey = 'q3';
        }

        if (mappedKey) {
          totalVotes++;
          if (val === 'Đồng thuận') {
            agreeVotes++;
            questionStats[mappedKey].agree++;
          } else if (val === 'Chưa đồng thuận') {
            disagreeVotes++;
            questionStats[mappedKey].disagree++;
          }
        }
      });
    } catch (e) {}
  });

  const agreeRate = totalVotes > 0 ? Math.round((agreeVotes / totalVotes) * 100) : 0;
  const disagreeRate = totalVotes > 0 ? (100 - agreeRate) : 0;

  // Tính tỷ lệ theo từng câu hỏi
  ['q1', 'q2', 'q3'].forEach(k => {
    const qTotal = questionStats[k].agree + questionStats[k].disagree;
    questionStats[k].total = qTotal;
    questionStats[k].rate = qTotal > 0 ? Math.round((questionStats[k].agree / qTotal) * 100) : 0;
  });

  const resData = {
    totalSurveys: totalRow.count,
    mergedCount: mergedRow.count,
    questionStats,
    votingStats: {
      totalVotes,
      agreeVotes,
      disagreeVotes,
      agreeRate,
      disagreeRate
    }
  };

  cachedStats = resData;
  cachedStatsTime = now;
  return resData;
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
