import path from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    root: workspaceRoot,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
