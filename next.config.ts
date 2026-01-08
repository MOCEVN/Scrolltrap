import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "static.photos",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
