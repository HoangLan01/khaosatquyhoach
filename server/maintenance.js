const fs = require('fs');
const path = require('path');

const flagFile = path.join(__dirname, '..', 'maintenance.flag');
const action = (process.argv[2] || '').toLowerCase();

if (action === 'on' || action === 'dong' || action === 'close') {
  fs.writeFileSync(flagFile, JSON.stringify({
    enabled: true,
    updatedAt: new Date().toISOString()
  }, null, 2));
  console.log('🛑 [CHẾ ĐỘ TẠM ĐÓNG TRANG ĐÃ ĐƯỢC BẬT]');
  console.log('👉 Người dân truy cập website sẽ thấy trang THÔNG BÁO MỞ VÀO NGÀY MAI.');
  console.log('👉 Cán bộ vẫn có thể đăng nhập /admin bình thường.');
} else if (action === 'off' || action === 'mo' || action === 'open') {
  if (fs.existsSync(flagFile)) {
    fs.unlinkSync(flagFile);
  }
  console.log('✅ [CHẾ ĐỘ TẠM ĐÓNG ĐÃ TẮT]');
  console.log('🚀 Cổng khảo sát đã MỞ LẠI BÌNH THƯỜNG cho người dân truy cập và đóng góp ý kiến!');
} else {
  const isEnabled = fs.existsSync(flagFile);
  console.log('ℹ TRẠNG THÁI CỔNG HIỆN TẠI:', isEnabled ? '🛑 ĐANG TẠM ĐÓNG (Hiển thị trang thông báo)' : '🟢 ĐANG MỞ HOẠT ĐỘNG');
  console.log('\nCách sử dụng:');
  console.log('  node server/maintenance.js on   -> Tạm đóng trang (hiện thông báo)');
  console.log('  node server/maintenance.js off  -> Mở lại trang web bình thường');
}
