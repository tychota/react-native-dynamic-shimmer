export const MOCK_USER = {
  id: "1",
  name: "Alice Martin",
  role: "Product designer",
  bio: "Designs interfaces and the systems behind them. Loves typography.",
  avatarUrl: "https://i.pravatar.cc/112?img=1",
};

export const LONG_BIO_USER = {
  ...MOCK_USER,
  bio: Array(12).fill("Lorem ipsum dolor sit amet.").join(" "),
};

export const COLORS = {
  light: { base: "#e4e4e7", highlight: "#f4f4f5" },
  dark: { base: "#1f1f23", highlight: "#2a2a2f" },
};
