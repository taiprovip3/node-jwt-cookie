interface GetEnvOptions<T> {
  default?: T
  required?: boolean
};

function parseValue<T>(value: string, defaultValue?: T): T {
  if (defaultValue === undefined) {
    return value as unknown as T;
  }

  if (typeof defaultValue === 'number') {
    const n = Number(value);
    if (Number.isNaN(n)) {
      throw new Error(`Env "${value}" is not a valid number`);
    }
    return n as unknown as T;
  }

  if (typeof defaultValue === 'boolean') {
    return (value === 'true' || value === '1') as unknown as T;
  }

  if (typeof defaultValue === 'object') {
    try {
      return JSON.parse(value) as T;
    } catch {
      throw new Error(`Env "${value}" is not valid JSON`);
    }
  }

  return value as unknown as T;
}

export function getEnv<T = string>(key: string, options: GetEnvOptions<T> = {}): T {
  const raw = process.env[key];

  if (raw === undefined || raw === '') {
    if (options.required) {
      throw new Error(`Missing required env variable: ${key}`);
    }
    return options.default as T;
  }

  return parseValue(raw, options.default);
}