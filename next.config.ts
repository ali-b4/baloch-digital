import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/dash/open-compute-inference': ['./data/open-compute/**/*'],
    '/dash/open-compute-inference/download': ['./data/open-compute/**/*'],
  },
  outputFileTracingExcludes: {
    '/dash/open-compute-inference': ['./.preview/**/*'],
    '/dash/open-compute-inference/download': ['./.preview/**/*'],
  },
};
export default nextConfig;
