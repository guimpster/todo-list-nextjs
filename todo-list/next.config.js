/** @type {import('next').NextConfig} */

module.exports = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        apiUrl: `${process.env.HOST_ADDRESS}/api`
    }
}
