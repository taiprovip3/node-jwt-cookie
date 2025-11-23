interface JwtConfig {
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  accessTokenExpirationTime: string; // Ví dụ: '1h', '30m'
  refreshTokenExpirationTime: string; // Ví dụ: '7d', '30d'
}



// Thường bạn sẽ gọi dotenv.config() ở file khởi động ứng dụng chính (ví dụ: index.ts)
// Nhưng để đảm bảo các biến môi trường được tải trước khi sử dụng config này,
// ta có thể gọi nó ở đầu nếu cần kiểm tra tính chắc chắn.
// Tuy nhiên, phương pháp tốt nhất là gọi MỘT LẦN ở điểm khởi động.
// Giả định rằng nó đã được gọi ở đâu đó trước khi file này được import.
// import * as dotenv from 'dotenv';
// dotenv.config();

/**
 * Hàm kiểm tra và lấy biến môi trường, đảm bảo giá trị phải là string.
 * @param key Tên biến môi trường
 * @returns Giá trị biến môi trường (kiểu string)
 * @throws Error nếu biến môi trường không được đặt
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`🚨 LỖI CẤU HÌNH: Biến môi trường '${key}' không được đặt.`); // Nên sử dụng cơ chế ghi log thay vì console.error trong ứng dụng thực tế
    // process.exit(1); // Thoát ứng dụng nếu cấu hình quan trọng bị thiếu
    // Hoặc chỉ ném lỗi: throw new Error(`Biến môi trường '${key}' không được đặt.`);
    throw new Error(`Biến môi trường '${key}' không được đặt.`);
  }
  return value;
}

/**
 * Cấu hình cho JSON Web Token (JWT) được lấy từ biến môi trường.
 */
export const jwtConfig: JwtConfig = {
      jwtAccessSecret: getRequiredEnv('JWT_ACCESS_SECRET'),
      jwtRefreshSecret: getRequiredEnv('JWT_REFRESH_SECRET'),
      accessTokenExpirationTime: getRequiredEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      refreshTokenExpirationTime: getRequiredEnv('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
};

// Nếu cần dùng các cấu hình khác (ví dụ: PORT) ở cùng nơi, bạn có thể thêm:
// export const appConfig = {
//   port: parseInt(process.env.PORT || '3000', 10),
//   isDevelopment: process.env.NODE_ENV === 'development',
// };