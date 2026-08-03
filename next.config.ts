import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPagesBuild ? "export" : undefined,
  trailingSlash: isGitHubPagesBuild,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
