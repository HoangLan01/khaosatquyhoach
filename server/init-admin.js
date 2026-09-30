const { findAdminByUsername, createAdmin, getAdminCount } = require('./database');
const { hashPassword } = require('./auth');

const defaultUsername = process.env.ADMIN_USER || 'admin';
const defaultPassword = process.env.ADMIN_PASS || 'TungThien@2026';
const defaultFullName = 'Cán bộ Quản trị Phường Tùng Thiện';

function initDefaultAdmin() {
  const existing = findAdminByUsername(defaultUsername);
  if (!existing) {
    const passwordHash = hashPassword(defaultPassword);
    createAdmin({
      username: defaultUsername,
      passwordHash,
      fullName: defaultFullName
    });
    console.log(`[INIT] Đã tạo tài khoản quản trị ban đầu:`);
    console.log(`       - Tên đăng nhập: ${defaultUsername}`);
    console.log(`       - Mật khẩu: ${defaultPassword}`);
  } else {
    console.log(`[INIT] Tài khoản quản trị '${defaultUsername}' đã tồn tại.`);
  }
}

if (require.main === module) {
  initDefaultAdmin();
  process.exit(0);
}

module.exports = { initDefaultAdmin };
