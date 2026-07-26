import ProductRepository from "../../product/repositories/product.repository.js";

import { normalizeText } from "../helpers/text-normalizer.js";
import { confidence } from "../helpers/confidence-helper.js";

class ProductMatcher {
  async match(name: string) {
    const result = await ProductRepository.findAll({
      limit: 100000,
    });

    const products = result.items;

    const normalizedInput = normalizeText(name);

    let bestMatch: {
      id?: string;
      name: string;
      confidence: number;
    } | null = null;

    for (const product of products) {
      const normalizedProduct = normalizeText(product.name);

      const score = confidence(normalizedInput, normalizedProduct);

      if (!bestMatch || score > bestMatch.confidence) {
        bestMatch = {
          id: product.id,
          name: product.name,
          confidence: score,
        };
      }
    }

    if (!bestMatch) {
      return {
        matched: false,
        confidence: 0,
        name,
      };
    }

    return {
      ...bestMatch,
      matched: bestMatch.confidence >= 85,
    };
  }
}

export default new ProductMatcher();
