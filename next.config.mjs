/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    // Dev: polling avoids "EMFILE: too many open files" on some macOS setups where native watchers fail.
    webpack: (config, { dev }) => {
        if (dev) {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            }
        }
        return config
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [{
            protocol: 'https',
            hostname: 'cdn-images-1.medium.com',
        }, ],
    },
}

export default nextConfig