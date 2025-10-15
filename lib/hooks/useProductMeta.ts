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
<<<<<<< HEAD
    const flavors = get('flavors');

    console.log("flovorts", flavors);
    
=======
    const flavorValue = get('flavors');
>>>>>>> 04f8836fac5863b3f52b152287ef4665005b97ec

    const effects = effectsValue ? (JSON.parse(effectsValue) as string[]) : [];
    const terpenes = terpenesValue ? (JSON.parse(terpenesValue) as string[]) : [];
    const flavors = flavorValue ? (JSON.parse(flavorValue) as string[]) : [];

    return { 
      caseColor, 
      effects, 
      terpenes, 
      category, 
      concentration, 
      indica, 
      sativa,
      flavors 
    };
  }, [product]);
}


