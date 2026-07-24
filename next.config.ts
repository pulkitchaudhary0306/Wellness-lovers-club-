import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.21", "192.168.1.21:3000", "192.168.1.4", "192.168.1.4:3000", "localhost:3000", "97.74.88.64"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
