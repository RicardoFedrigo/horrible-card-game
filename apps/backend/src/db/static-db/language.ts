export function isPortuguese(language?: string): boolean {
  const normalized = (language ?? '').trim().toLowerCase();
  return (
    normalized === 'pt-br' ||
    normalized === 'pt_br' ||
    normalized === 'ptbr' ||
    normalized === 'pt' ||
    normalized === 'portuguese' ||
    normalized === 'português'
  );
}
