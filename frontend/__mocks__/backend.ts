export default {
  exchange: {
    convert: vi.fn(),
    getCurrencies: vi.fn(),
    getRate: vi.fn(),
    getRates: vi.fn(),
  },
  blog: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  contact: {
    send: vi.fn(),
  },
  health: {
    check: vi.fn(),
    root: vi.fn(),
  },
  pwaStats: {
    track: vi.fn(),
    stats: vi.fn(),
  },
  aiAnalysis: {
    analyze: vi.fn(),
  },
};