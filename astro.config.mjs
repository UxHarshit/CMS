// @ts-check
// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import partytown from '@astrojs/partytown';

import node from '@astrojs/node';

import  dotenv from 'dotenv';
dotenv.config();

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(
    {
      applyBaseStyles: false,
    }
  ), react(), partytown()],
  output: 'server',
  site: "http://localhost:4321",

  adapter: node({
    mode: 'standalone'
  })
});