import { useMemo } from 'react'
import { Product } from '@/lib/shopify/types'

export function useProductMeta(product: Product | null) {
  return useMemo(() => {
    const get = (key: string): string | null => {
      if (!product?.metafields) return null;
      const mf = product.metafields.find((m) => m.key === key);
      return mf?.value || null;
    };
    const caseColor = get('case_color');
    const terpenesValue = get('terpenes');
    const effectsValue = get('effects');
    const category = get('category');
    const concentration = get('concentration');
    const indica = get('indica');
    const sativa = get('sativa');
    const flavors = get('flavors');

    const effects = effectsValue ? (JSON.parse(effectsValue) as string[]) : [];
    const terpenes = terpenesValue ? (JSON.parse(terpenesValue) as string[]) : [];

    return { 
      caseColor, 
      effects, 
      terpenes, 
      category, 
      concentration, 
      indica, 
      sativa 
    };
  }, [product]);
}


