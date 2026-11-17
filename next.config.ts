import type { NextConfig } from "next";

/**
 * Pages render per request: every screen reads the signed-in user's data from
 * Supabase (row-level security), so nothing is prerendered at build time.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
