import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Configurar rewrites para proxy las solicitudes al backend
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/backend/:path*',
          destination: 'http://127.0.0.1:8000/:path*',
        },
      ],
    };
  },

  // Agregar headers para CORS
  async headers() {
    return [
      {
        source: '/api/backend/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
