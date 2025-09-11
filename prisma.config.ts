import { defineConfig } from '@prisma/config';

// Minimal Prisma config; can be expanded later for telemetry, preview features, etc.
export default defineConfig({
  schema: './prisma/schema.prisma'
});