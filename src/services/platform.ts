import type { Platform } from '../domain/sim/keys';
import type { PlatformPreference } from '../domain/state';

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'windows';
  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  const source = uaData?.platform || navigator.platform || navigator.userAgent;
  return /mac|iphone|ipad|ipod/i.test(source) ? 'mac' : 'windows';
}

export function resolvePlatform(preference: PlatformPreference): Platform {
  return preference === 'auto' ? detectPlatform() : preference;
}

/** Tela de toque sem mouse: sugere o teclado virtual. */
export function isCoarsePointer(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches;
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
