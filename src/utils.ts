import * as cheerio from 'cheerio';
import * as rp from 'request-promise';

import { AntiDDoS } from './anti-ddos';

export const getRandomInt = (min: number = 1, max: number = 100): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRawImage = (url: string) => {
  const bpcToken = AntiDDoS.getInstance().bpcToken;
  return rp.get(url, {
    timeout: 5000,
    encoding: null,
    headers: {
      Cookie: `bpc=${bpcToken}`,
    },
  });
};

export const getCheerioContent = (url: string) => {
  const bpcToken = AntiDDoS.getInstance().bpcToken;
  return rp.get(url, {
    timeout: 5000,
    transform: (body: string) => cheerio.load(body),
    headers: {
      Cookie: `bpc=${bpcToken}`,
    },
  });
};

export const getXHRContent = (url: string) => {
  return rp.get(url, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    json: true,
  });
};
