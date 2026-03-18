/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/__tests__/**/*.test.ts'],
        // 타임아웃 (Commander 타이머 테스트용)
        testTimeout: 15_000,

        // 커버리지 설정
        coverage: {
            provider: 'v8',
            reporter: ['text', 'text-summary', 'json-summary'],
            reportsDirectory: './coverage',
            include: [
                'src/store/**/*.ts',
                'src/cells/**/*.ts',
                'src/services/**/*.ts',
                'src/lib/**/*.ts',
            ],
            exclude: [
                'src/**/__tests__/**',
                'src/**/*.d.ts',
                'src/types/**',
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
