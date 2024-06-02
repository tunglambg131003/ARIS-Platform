/** @type {import('next').NextConfig} */
const nextConfig = {
    modularizeImports: {
        'antd/lib/QRCode': {
            transform: 'antd/lib/qrcode',
        },
    },
}
module.exports = nextConfig
