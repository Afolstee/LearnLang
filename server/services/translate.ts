import { createRequire } from 'module';
import type { Language } from '@shared/schema';

const require = createRequire(import.meta.url);
const translate = require('./google-translate.js');

// Language mapping between our app's language codes and Google Translate codes
const languageMap: Record<Language, string> = {
  'spanish': 'es',
  'french': 'fr', 
  'mandarin': 'zh-cn'
};

export async function translateToNativeLanguage(text: string, nativeLanguage: Language): Promise<string> {
  try {
    const targetLanguage = languageMap[nativeLanguage];
    if (!targetLanguage) {
      throw new Error(`Unsupported native language: ${nativeLanguage}`);
    }

    const result = await translate(text, { from: 'en', to: targetLanguage });
    return result.text;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text as fallback
    return text;
  }
}

export { translate as googleTranslate };