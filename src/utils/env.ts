import 'dotenv/config'; // Load biến môi trường ngay khi file được import

export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value;
};

/**
 * Utility để chuyển đổi giá trị sang Number (ví dụ cho PORT)
 */
export const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (value === undefined && defaultValue !== undefined) return defaultValue;
  
  const parsedValue = Number(value);
  if (isNaN(parsedValue)) {
    throw new Error(`❌ Environment variable ${key} must be a number`);
  }
  
  return parsedValue;
};