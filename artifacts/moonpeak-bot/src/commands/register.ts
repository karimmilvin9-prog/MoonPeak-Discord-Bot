import { Client, REST, Routes } from "discord.js";
import { commandDefinitions } from "./definitions.js";
import { config } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const registerCommands = async (client: Client) => {
  const clientId = config.clientId ?? client.user?.id;
  if (!clientId) {
    logger.warn("No Discord application ID is available; slash commands were not registered.");
    return;
  }

  const rest = new REST({ version: "10" }).setToken(config.discordToken);
  const route = config.guildId
    ? Routes.applicationGuildCommands(clientId, config.guildId)
    : Routes.applicationCommands(clientId);

  try {
    await rest.put(route, { body: commandDefinitions });
    logger.info("Slash commands registered", {
      scope: config.guildId ? `guild:${config.guildId}` : "global",
      count: commandDefinitions.length,
    });
  } catch (error) {
    logger.error("Slash command registration failed", { error: String(error) });
  }
};