const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const flagFile = path.join(rootDir, 'maintenance.flag');
const indexPath = path.join(rootDir, 'index.html');
const indexRealBackupPath = path.join(rootDir, 'index.real.html');
const maintenancePath = path.join(rootDir, 'maintenance.html');

const action = (process.argv[2] || '').toLowerCase();

if (action === 'on' || action === 'dong' || action === 'close') {
  try {
    // 1. Sao lưu file index.html gốc nếu chưa có bản sao lưu
    if (fs.existsSync(indexPath) && !fs.existsSync(indexRealBackupPath)) {
      fs.copyFileSync(indexPath, indexRealBackupPath);
    }

    // 2. Ghi đè file maintenance.html vào index.html để Nginx phục vụ ngay lập tức
    if (fs.existsSync(maintenancePath)) {
      fs.copyFileSync(maintenancePath, indexPath);
    }

    // 3. Đánh dấu cờ bảo trì
    fs.writeFileSync(flagFile, JSON.stringify({
      enabled: true,
      updatedAt: new Date().toISOString()
    }, null, 2));

    console.log('🛑 [ĐÃ TẠM ĐÓNG TRANG THÀNH CÔNG]');
    console.log('👉 Người dân truy cập website sẽ thấy ngay trang THÔNG BÁO MỞ VÀO NGÀY 01/10/2026.');
    console.log('👉 Cán bộ vẫn có thể đăng nhập https://domain/admin bình thường.');
  } catch (err) {
    console.error('Lỗi khi bật chế độ tạm đóng:', err);
  }
} else if (action === 'off' || action === 'mo' || action === 'open') {
  try {
    // 1. Khôi phục lại file index.html gốc từ bản sao lưu
    if (fs.existsSync(indexRealBackupPath)) {
      fs.copyFileSync(indexRealBackupPath, indexPath);
      fs.unlinkSync(indexRealBackupPath);
    }

    // 2. Xóa cờ bảo trì
    if (fs.existsSync(flagFile)) {
      fs.unlinkSync(flagFile);
    }

    console.log('✅ [ĐÃ MỞ LẠI TRANG WEB THÀNH CÔNG]');
    console.log('🚀 Cổng khảo sát đã trở lại hoạt động bình thường để người dân đóng góp ý kiến!');
  } catch (err) {
    console.error('Lỗi khi mở lại trang:', err);
  }
} else {
  const isEnabled = fs.existsSync(flagFile) || fs.existsSync(indexRealBackupPath);
  console.log('ℹ TRẠNG THÁI CỔNG HIỆN TẠI:', isEnabled ? '🛑 ĐANG TẠM ĐÓNG (Hiển thị trang thông báo)' : '🟢 ĐANG MỞ HOẠT ĐỘNG');
  console.log('\nCách sử dụng:');
  console.log('  npm run dong-trang   -> Tạm đóng trang (hiện thông báo ngay)');
  console.log('  npm run mo-trang     -> Mở lại trang web bình thường');
}

