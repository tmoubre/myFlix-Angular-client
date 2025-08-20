/**
 * Source: src/app/app.routes.server.ts
 * @packageDocumentation
 */
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];


