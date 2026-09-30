const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { initDefaultAdmin } = require('./init-admin');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'surveys.db');

console.log('🔄 Đang tiến hành reset dữ liệu khảo sát về trạng thái ban đầu...\n');

if (fs.existsSync(dbPath)) {
  try {
    const db = new Database(dbPath);
    
    // Xóa toàn bộ phiếu khảo sát
    const countBefore = db.prepare('SELECT COUNT(*) as count FROM surveys').get().count;
    db.prepare('DELETE FROM surveys').run();
    
    // Đặt lại số thứ tự tự tăng (AUTOINCREMENT) về 0
    try {
      db.prepare("DELETE FROM sqlite_sequence WHERE name = 'surveys'").run();
    } catch (e) {}

    console.log(`✅ Đã xóa sạch toàn bộ ${countBefore} phiếu khảo sát thử nghiệm.`);
    console.log(`✅ Đã đặt lại chỉ số tự tăng (ID) của bảng surveys về 0.`);
    
    db.close();
  } catch (err) {
    console.error('⚠ Không thể xóa bảng trực tiếp, tiến hành xóa file database cũ...', err.message);
    // Fallback: xóa file .db, .db-wal, .db-shm
    ['surveys.db', 'surveys.db-wal', 'surveys.db-shm'].forEach(file => {
      const p = path.join(dataDir, file);
      if (fs.existsSync(p)) {
        try { fs.unlinkSync(p); } catch (e) {}
      }
    });
    console.log('✅ Đã xóa toàn bộ file database cũ.');
  }
} else {
  console.log('ℹ Chưa có file database nào trong thư mục data/.');
}

// Khởi tạo lại tài khoản admin mặc định
initDefaultAdmin();

console.log('\n🎉 Hoàn tất! Hệ thống đã được đưa về trạng thái trắng (sẵn sàng đón nhận khảo sát chính thức).');
