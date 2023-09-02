import uniqueSlug from 'unique-slug'

export const slugify = (str = '', prefix = '', hasRandomSuffix = false) => {
  const baseSlug = str.toLowerCase().replace(/\s+/g, '-').slice(0, 200)
  return hasRandomSuffix ? [prefix, baseSlug, uniqueSlug()].filter(Boolean).join('-') : [prefix, baseSlug].filter(Boolean).join('-')
}