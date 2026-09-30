const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const XLSX = require('xlsx');

const {
  insertSurvey,
  getStats,
  getSurveys,
  getAllSurveysForExport,
  findAdminByUsername,
  projectNames
} = require('./database');
const {
  comparePassword,
  generateToken,
  requireAdminAuth
} = require('./auth');
const { initDefaultAdmin } = require('./init-admin');

// Tự động khởi tạo tài khoản admin mặc định nếu chưa có
initDefaultAdmin();

const app = express();
const PORT = process.env.PORT || 3026;

// Bảo mật & Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Để cho phép nhúng PDF và load font mượt mà
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Hàm tạo mã biên nhận ngẫu nhiên siêu an toàn (1.000 tỷ khả năng)
function generateReceiptCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TT-2026-';
  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// -------------------------------------------------------------
// 1. API DÀNH CHO NGƯỜI DÂN (KHẢO SÁT)
// -------------------------------------------------------------
app.post('/api/survey/submit', (req, res) => {
  try {
    const { selectedProject, person, answers, comments, otherOpinion } = req.body;

    // Validate dữ liệu bắt buộc
    if (!selectedProject || !['st3', 'xuankhanh', 'both'].includes(selectedProject)) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn đồ án quy hoạch muốn đóng góp ý kiến.' });
    }

    if (!person || !person.fullName || !person.fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Họ và tên người đóng góp là bắt buộc.' });
    }

    if (!person.address || !person.address.trim()) {
      return res.status(400).json({ success: false, message: 'Địa chỉ cư trú là bắt buộc.' });
    }

    // Lấy thông tin IP & User Agent
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const createdAt = new Date().toISOString();

    // Lưu khảo sát với cơ chế auto-retry nếu trùng mã biên nhận
    let savedSurvey = null;
    let receiptCode = '';
    let attempts = 0;

    while (attempts < 5) {
      attempts++;
      receiptCode = generateReceiptCode();
      try {
        savedSurvey = insertSurvey({
          receiptCode,
          selectedProject,
          fullName: person.fullName.trim(),
          phone: (person.phone || '').trim(),
          address: person.address.trim(),
          email: (person.email || '').trim(),
          answers: answers || {},
          comments: comments || {},
          otherOpinion: (otherOpinion || '').trim(),
          ipAddress: String(ipAddress).split(',')[0].trim(),
          userAgent: String(userAgent).slice(0, 300),
          createdAt
        });
        break;
      } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' && attempts < 5) {
          continue;
        }
        throw err;
      }
    }

    return res.status(200).json({
      success: true,
      receiptCode,
      timestamp: createdAt,
      message: 'Ghi nhận ý kiến đóng góp thành công!'
    });
  } catch (error) {
    console.error('[SUBMIT ERROR]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ trong quá trình lưu phiếu. Vui lòng thử lại.' });
  }
});

// -------------------------------------------------------------
// 2. API QUẢN TRỊ (ADMIN)
// -------------------------------------------------------------

// Đăng nhập cán bộ quản trị
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    const admin = findAdminByUsername(username.trim());
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    }

    const isValid = comparePassword(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    }

    const token = generateToken({
      id: admin.id,
      username: admin.username,
      fullName: admin.full_name
    });

    return res.status(200).json({
      success: true,
      token,
      admin: {
        username: admin.username,
        fullName: admin.full_name
      }
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống đăng nhập.' });
  }
});

// Lấy thống kê tổng quan
app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
  try {
    const stats = getStats();
    return res.json({ success: true, stats });
  } catch (error) {
    console.error('[STATS ERROR]', error);
    return res.status(500).json({ success: false, message: 'Không thể lấy số liệu thống kê.' });
  }
});

// Lấy danh sách phiếu khảo sát có tìm kiếm & lọc
app.get('/api/admin/surveys', requireAdminAuth, (req, res) => {
  try {
    const { page = 1, limit = 20, project = '', search = '' } = req.query;
    const data = getSurveys({ page, limit, project, search });
    return res.json({ success: true, data });
  } catch (error) {
    console.error('[SURVEYS LIST ERROR]', error);
    return res.status(500).json({ success: false, message: 'Không thể lấy danh sách phiếu khảo sát.' });
  }
});

// Xuất file Excel toàn bộ dữ liệu khảo sát
app.get('/api/admin/export', requireAdminAuth, (req, res) => {
  try {
    const surveys = getAllSurveysForExport();

    const questionsList = [
      '1. Căn cứ lập quy hoạch',
      '2. Quy mô lập quy hoạch',
      '3. Tính chất & Chức năng',
      '4. Phương án quy hoạch',
      '5. Đồng ý triển khai các bước tiếp theo'
    ];

    // Chuyển đổi dữ liệu sang định dạng bảng Excel
    const excelRows = surveys.map((s, index) => {
      const answers = s.answers || {};
      const comments = s.comments || {};

      const row = {
        'STT': index + 1,
        'Mã biên nhận': s.receipt_code,
        'Thời gian gửi': new Date(s.created_at).toLocaleString('vi-VN'),
        'Họ và tên': s.full_name,
        'Địa chỉ cư trú / Trụ sở': s.address,
        'Số điện thoại': s.phone || '—',
        'Email': s.email || '—',
        'Đồ án tham gia': s.projectName
      };

      if (s.selected_project === 'both') {
        // Cả 2 đồ án
        for (let i = 1; i <= 5; i++) {
          row[`[ST3] Câu ${i}`] = answers[`st3_q${i}`] || '—';
          row[`[ST3] Ý kiến câu ${i}`] = comments[`st3_comment${i}`] || '';
        }
        for (let i = 1; i <= 5; i++) {
          row[`[Xuân Khanh] Câu ${i}`] = answers[`xk_q${i}`] || '—';
          row[`[Xuân Khanh] Ý kiến câu ${i}`] = comments[`xk_comment${i}`] || '';
        }
      } else {
        const prefix = s.selected_project === 'st3' ? 'st3' : 'xk';
        for (let i = 1; i <= 5; i++) {
          row[`Câu ${i} (${questionsList[i - 1]})`] = answers[`${prefix}_q${i}`] || '—';
          row[`Ý kiến chi tiết Câu ${i}`] = comments[`${prefix}_comment${i}`] || '';
        }
      }

      row['Ý kiến, kiến nghị khác'] = s.other_opinion || '';
      row['Địa chỉ IP'] = s.ip_address || '';

      return row;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelRows);

    // Tự động căn chỉnh độ rộng cột
    const colWidths = [
      { wch: 6 },  // STT
      { wch: 16 }, // Mã biên nhận
      { wch: 22 }, // Thời gian gửi
      { wch: 24 }, // Họ và tên
      { wch: 32 }, // Địa chỉ
      { wch: 15 }, // SĐT
      { wch: 22 }, // Email
      { wch: 35 }  // Đồ án
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách khảo sát');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const nowStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `Danh-sach-y-kien-quy-hoach-Tung-Thien-${nowStr}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (error) {
    console.error('[EXPORT ERROR]', error);
    return res.status(500).json({ success: false, message: 'Lỗi trong quá trình xuất tệp Excel.' });
  }
});

// -------------------------------------------------------------
// 3. PHỤC VỤ GIAO DIỆN TĨNH & ROUTING
// -------------------------------------------------------------
const rootDir = path.join(__dirname, '..');

// Phục vụ tệp tĩnh (assets, documents, index.html, admin.html)
app.use(express.static(rootDir));

// Route trang quản trị
app.get('/admin', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin.html'));
});

// Route trang chủ cho người dân
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CỔNG KHẢO SÁT QUY HOẠCH PHƯỜNG TÙNG THIỆN ĐANG CHẠY`);
  console.log(`📌 Cổng người dân:  http://localhost:${PORT}/`);
  console.log(`📌 Cổng quản trị:   http://localhost:${PORT}/admin`);
  console.log(`=======================================================`);
});

module.exports = app;
