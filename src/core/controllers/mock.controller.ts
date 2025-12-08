import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class MockController {
  @Get('mockServiceWorker.js')
  getMockServiceWorker(@Res() res: Response) {
    // Return an empty service worker file
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
      // This is a placeholder service worker file
      self.addEventListener('install', () => {
        self.skipWaiting();
      });
      
      self.addEventListener('activate', () => {
        self.clients.claim();
      });
      
      self.addEventListener('fetch', (event) => {
        event.respondWith(fetch(event.request));
      });
    `);
  }
}
