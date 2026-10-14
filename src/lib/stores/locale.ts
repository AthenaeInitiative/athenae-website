export const locales = ['en', 'fr'] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
	return value !== undefined && locales.includes(value as Locale);
}

export function resolveLocale(value: string | undefined): Locale {
	return isLocale(value) ? value : 'en';
}
