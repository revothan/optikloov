
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock window.fs for file operations
global.window = {
  ...global.window,
  fs: {
    readFile: vi.fn(),
  },
} as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Intersection Observer
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
