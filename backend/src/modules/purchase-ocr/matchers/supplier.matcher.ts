import SupplierRepository from "../../supplier/repositories/supplier.repository.js";

import { normalizeText } from "../helpers/text-normalizer.js";
import { confidence } from "../helpers/confidence-helper.js";

class SupplierMatcher {
  async match(name: string) {
    const suppliers = await SupplierRepository.find();

    const normalizedInput = normalizeText(name);

    let bestMatch: {
      id?: string;
      name: string;
      confidence: number;
    } | null = null;

    for (const supplier of suppliers) {
      const normalizedSupplier = normalizeText(supplier.name);

      const score = confidence(normalizedInput, normalizedSupplier);

      if (!bestMatch || score > bestMatch.confidence) {
        bestMatch = {
          id: supplier.id,
          name: supplier.name,
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

export default new SupplierMatcher();
