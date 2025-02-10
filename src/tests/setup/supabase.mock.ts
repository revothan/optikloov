
import { vi } from "vitest";

export const mockSupabase = {
  auth: {
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    onAuthStateChange: vi.fn(() => ({
      subscription: { unsubscribe: vi.fn() },
    })),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
      order: vi.fn(() => ({
        desc: vi.fn(() => ({
          range: vi.fn(() => Promise.resolve({ data: [], error: null })),
          limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      range: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
    update: vi.fn(() => Promise.resolve({ data: [], error: null })),
    delete: vi.fn(() => Promise.resolve({ error: null })),
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(() => Promise.resolve({ data: { path: "test.jpg" }, error: null })),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://test.com/test.jpg" } })),
    })),
  },
};

