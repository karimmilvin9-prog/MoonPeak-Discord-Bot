const positiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required. Add it as a project secret or environment variable.`);
  }
  return value;
};

export const config: {
  discordToken: string;
  clientId?: string;
  guildId?: string;
  warningChannelId?: string;
  reportChannelId?: string;
  warningIntervalMs: number;
  enablePrivilegedIntents: boolean;
  aiModel: string;
  aiBaseUrl?: string;
  aiApiKey?: string;
} = {
  discordToken: required("DISCORD_TOKEN"),
  clientId: process.env["DISCORD_CLIENT_ID"]?.trim(),
  guildId: process.env["DISCORD_GUILD_ID"]?.trim(),
  warningChannelId: process.env["MOONPEAK_WARNING_CHANNEL_ID"]?.trim(),
  reportChannelId: process.env["MOONPEAK_REPORT_CHANNEL_ID"]?.trim(),
  warningIntervalMs: positiveInt(
    process.env["MOONPEAK_WARNING_INTERVAL_MS"],
    10 * 60 * 1000,
  ),
  enablePrivilegedIntents: process.env["MOONPEAK_ENABLE_PRIVILEGED_INTENTS"] === "true",
  aiModel: process.env["MOONPEAK_AI_MODEL"]?.trim() ||
    (process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"]?.trim() ? "gpt-5.6-terra" : "gpt-4o-mini"),
  aiBaseUrl: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"]?.trim(),
  aiApiKey:
    process.env["AI_INTEGRATIONS_OPENAI_API_KEY"]?.trim() ||
    process.env["OPENAI_API_KEY"]?.trim(),
};

export const hasAi = Boolean(config.aiBaseUrl && config.aiApiKey);

export const updateConfig = (
  patch: Partial<Pick<typeof config, "warningChannelId" | "reportChannelId" | "warningIntervalMs">>,
) => {
  Object.assign(config, patch);
};