import {
  ChannelType,
  Client,
  TextChannel,
} from "discord.js";
import { config } from "../config/env.js";
import { securityWarning } from "../embeds/security.js";
import { logger } from "../utils/logger.js";

let warningTimer: NodeJS.Timeout | undefined;
let warningIndex = 0;

const findWarningChannel = (client: Client): TextChannel | undefined => {
  if (!config.warningChannelId) return undefined;
  const channel = client.channels.cache.get(config.warningChannelId);
  return channel?.type === ChannelType.GuildText ? channel : undefined;
};

export const sendSecurityWarning = async (client: Client) => {
  const channel = findWarningChannel(client);
  if (!channel) {
    logger.warn("Security warning skipped: MOONPEAK_WARNING_CHANNEL_ID is not configured or channel is unavailable.");
    return;
  }

  try {
    await channel.send({ embeds: [securityWarning(warningIndex)] });
    warningIndex += 1;
  } catch (error) {
    logger.error("Security warning could not be sent", { error: String(error) });
  }
};

export const startSecurityWarnings = (client: Client) => {
  if (warningTimer) clearInterval(warningTimer);
  void sendSecurityWarning(client);
  warningTimer = setInterval(() => void sendSecurityWarning(client), config.warningIntervalMs);
  warningTimer.unref();
  logger.info("Security warning scheduler started", { intervalMs: config.warningIntervalMs });
};

export const restartSecurityWarnings = (client: Client) => {
  startSecurityWarnings(client);
};