import { vi } from "vitest";

vi.mock("@react-pdf/renderer", () => ({
  Document: vi.fn(() => null),
  Page: vi.fn(() => null),
  Text: vi.fn(() => null),
  View: vi.fn(() => null),
  StyleSheet: {
    create: vi.fn(() => ({})),
  },
  pdf: vi.fn(() => ({
    toBlob: vi.fn(() => Promise.resolve(new Blob())),
  })),
  PDFDownloadLink: vi.fn(() => null),
}));
