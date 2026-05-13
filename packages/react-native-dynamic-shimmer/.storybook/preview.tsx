import React from "react";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0b0b0f" },
      ],
    },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, fontFamily: "system-ui, sans-serif" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
