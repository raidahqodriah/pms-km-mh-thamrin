/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pdfkit membaca file data font-nya sendiri; jangan di-bundle.
  serverExternalPackages: ["pdfkit"],
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Foto bukti dikompres di browser, tapi beri ruang untuk file mentah.
      bodySizeLimit: "10mb",
      // Akses lewat Cloudflare Tunnel. Tambahkan domain sendiri di sini bila memakai tunnel bernama.
      allowedOrigins: ["*.trycloudflare.com"],
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
