export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function slugifyBlockLabel(label: string): string {
  return label
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\d\-_]+/g, '');
}
