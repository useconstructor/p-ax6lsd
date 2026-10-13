import { constructorRouteConfig } from './constructor-routes.mjs';
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {allowedDevOrigins: ['127.0.0.1']};
export default constructorRouteConfig(nextConfig);
