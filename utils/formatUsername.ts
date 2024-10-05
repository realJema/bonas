export function formatUsername(name: string | null | undefined): string {
  if (!name) {
    return '';
  }
  const trimmedName = name.trim();
  
  const formattedName = trimmedName.replace(/\s+/g, '_');
  
  return formattedName.replace(/[^a-zA-Z0-9_]/g, '');
}