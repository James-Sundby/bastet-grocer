/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**", // Allow all paths under this hostname
			},
		],
	},
};

export default nextConfig;
