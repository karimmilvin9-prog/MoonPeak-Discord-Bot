import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { config, updateConfig } from "./env.js";

const filePath = "data/moonpeak-config.json";

type PersistedConfig = {
  warningChannelId?: string;
  reportChannelId?: string;
  warningIntervalMs?: number;
};

const load = (): PersistedConfig => {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as PersistedConfig;
  } catch {
    return {};
  }
};

const persisted = load();
updateConfig({
  warningChannelId: persisted.warningChannelId ?? config.warningChannelId,
  reportChannelId: persisted.reportChannelId ?? config.reportChannelId,
  warningIntervalMs: persisted.warningIntervalMs ?? config.warningIntervalMs,
});

export const persistConfig = () => {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(
    filePath,
    JSON.stringify(
      {
        warningChannelId: config.warningChannelId,
        reportChannelId: config.reportChannelId,
        warningIntervalMs: config.warningIntervalMs,
      },
      null,
      2,
    ),
  );
};