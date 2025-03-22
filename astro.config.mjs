// @ts-check
// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import partytown from '@astrojs/partytown';

import node from '@astrojs/node';

import  dotenv from 'dotenv';
import sitemap from '@astrojs/sitemap';
dotenv.config();

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(
    {
      applyBaseStyles: false,
    }
  ), react(), partytown(), 
  sitemap({
    filter : (page)=> 
      page !== 'https://codecontestpro.tech/admin/'
      && page !== 'https://codecontestpro.tech/admin'
      && page !== 'https://codecontestpro.tech/contest/'
      && page !== 'https://codecontestpro.tech/contest'
      && page !== 'https://codecontestpro.tech/problems/'
      && page !== 'https://codecontestpro.tech/problems'
  })
],
  output: 'server',
  site: "https://codecontestpro.tech",

  adapter: node({
    mode: 'standalone'
  })
});