import { defineConfig } from 'vitest/config';

const isCI = process.env['CI'] !== undefined;

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['node_modules', 'dist', 'coverage'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.d.ts',
        'src/index.ts',
        'src/error-types.ts',
        'src/error-types-500.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
    reporters: isCI ? ['default', 'junit'] : ['default'],
    ...(isCI ? { outputFile: { junit: 'reports/junit.xml' } } : {}),
  },
});
