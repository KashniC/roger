"use client";

import { createContext, useContext } from "react";
import { defaultSettingsClient, type ClientSettings } from "@/lib/settings-shared";

const Ctx = createContext<ClientSettings>(defaultSettingsClient);

export function SettingsProvider({ value, children }: { value: ClientSettings; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);
