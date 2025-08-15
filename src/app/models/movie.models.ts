/**
 * Source: src/app/models/movie.models.ts
 * @file
 */
// src/app/models/movie.models.ts
export interface Genre { name: string; description?: string; }
export interface Director { name: string; bio?: string; birth?: string; death?: string; }

/** Current normalized movie used by the app */
export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre?: Genre;
  director?: Director;
  ImageUrl?: string;         // normalized image url (absolute or proxied)
  featured?: boolean;
}

/** Legacy shapes as stored by older API documents */
export interface LegacyMovie {
  _id: string;
  Title: string;
  Description: string;
  Genre?: { Name: string; Description?: string };
  Director?: { Name: string; Bio?: string; Birth?: string; Death?: string };
  ImagePath?: string;        // legacy image field (may be relative or absolute)
  Featured?: boolean;
}

/** Helper: coalesce first non-empty string */
const first = (...vals: (string | undefined | null)[]) =>
  vals.find(v => typeof v === 'string' && v.trim().length > 0)?.trim();

/** If path looks relative, proxy it via /api so it goes to Heroku */
function toServedImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  const p = path.trim();
  if (/^https?:\/\//i.test(p)) return p;           // already absolute
  // ensure one leading slash and send through the Angular proxy
  const withSlash = p.startsWith('/') ? p : `/${p}`;
  return `/api${withSlash}`;
}

/** Normalize a single movie (legacy -> current) */
export function normalizeMovie(raw: any): Movie {
  const legacy: LegacyMovie = raw as LegacyMovie;

  // Names
  const title = first((raw as any).title, legacy.Title) ?? '';
  const description = first((raw as any).description, legacy.Description) ?? '';

  // Image: try many common keys, then proxy if relative
  const rawImage = first(
    (raw as any).ImageUrl,
    (raw as any).imageUrl,
    (raw as any).image,
    (raw as any).Poster,
    legacy.ImagePath
  );
  const ImageUrl = toServedImageUrl(rawImage);

  // Genre/Director mapping
  const genre = legacy.Genre
    ? { name: legacy.Genre.Name, description: legacy.Genre.Description }
    : (raw.genre as Genre | undefined);

  const director = legacy.Director
    ? { name: legacy.Director.Name, bio: legacy.Director.Bio, birth: legacy.Director.Birth, death: legacy.Director.Death }
    : (raw.director as Director | undefined);

  return {
    _id: raw._id ?? legacy._id,
    title,
    description,
    genre,
    director,
    ImageUrl,
    featured: (raw as any).featured ?? legacy.Featured
  };
}

/** Normalize arrays */
export function normalizeMovies(list: any[]): Movie[] {
  return Array.isArray(list) ? list.map(normalizeMovie) : [];
}
