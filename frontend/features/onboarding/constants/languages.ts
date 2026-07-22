import { Languages } from "lucide-react";

export interface LanguageType {
  id: string;
  name: string;
  nativeName: string;
  icon: typeof Languages;
}

export const LANGUAGES: LanguageType[] = [
  {
    id: "en",
    name: "English",
    nativeName: "English",
    icon: Languages,
  },
  {
    id: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    icon: Languages,
  },
] as const;
