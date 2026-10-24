import { siteConfig } from "@/data/config";

/** The editable links client components need (no server-only code here). */
export type ClientSettings = { setupCall: string; setupCheckout: string; planCheckout: string; companyCall: string };

export const defaultSettingsClient: ClientSettings = {
  setupCall: siteConfig.ladder.setupCall,
  setupCheckout: siteConfig.ladder.setupCheckout,
  planCheckout: siteConfig.ladder.planCheckout,
  companyCall: siteConfig.cal.companyCall,
};
