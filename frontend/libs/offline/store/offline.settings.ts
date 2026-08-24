import { getDatabase } from "../api/database";

export interface OfflineSettings {
  business: {
    name?: string;
    ownerName?: string;
    logo?: string;
    businessType?: string;
    gstNo?: string;
    panNo?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  invoice: {
    prefix?: string;
    nextNumber?: number;
    footer?: string;
    terms?: string;
    showLogo?: boolean;
    showGST?: boolean;
    showCustomerMobile?: boolean;
    showCustomerAddress?: boolean;
  };

  tax: {
    enabled?: boolean;
    defaultGST?: number;
    taxType?: string;
    currency?: string;
    currencySymbol?: string;
  };
}

const SETTINGS_KEY = "business-settings";

export async function saveOfflineSettings(
  settings: OfflineSettings,
): Promise<void> {
  const db = await getDatabase();

  await db.run(
    `
      INSERT OR REPLACE INTO app_settings (
        key,
        value
      )
      VALUES (?, ?)
    `,
    [SETTINGS_KEY, JSON.stringify(settings)],
  );
}

export async function getOfflineSettings(): Promise<OfflineSettings | null> {
  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT value
      FROM app_settings
      WHERE key = ?
      LIMIT 1
    `,
    [SETTINGS_KEY],
  );

  const value = result.values?.[0]?.value;

  if (!value) {
    return null;
  }

  return JSON.parse(String(value)) as OfflineSettings;
}
