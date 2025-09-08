import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const nextConfig = {
    allowedDevOrigins: process.env.APP_ENV === "local" ? ["sumitomotool.local", "*.sumitomotool.local"] : undefined,
    output: "standalone",
    watchOptions: {
        pollIntervalMs: 1000,
    },
    env: {
        API_ENDPOINT: process.env.API_ENDPOINT,
        JWT_SECRET: process.env.JWT_SECRET,
        APP_ENV: process.env.APP_ENV,
        IMAGE_HOSTNAMES: process.env.IMAGE_HOSTNAMES,
        GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: process.env.IMAGE_HOSTNAMES,
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: `**.${process.env.IMAGE_HOSTNAMES}`,
                port: "",
                pathname: "**",
            },
        ],
    },
    webpack(config) {
        const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /raw/] },
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: /raw/,
                use: ["@svgr/webpack"],
            }
        );

        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
};

export default withNextIntl(nextConfig);
