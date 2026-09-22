import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import { config } from "./config/env.js";
import { answerMention } from "./ai/assistant.js";
import { handleCommand } from "./commands/handle.js";
import { registerCommands } from "./commands/register.js";
import { handleGuildMemberAdd } from "./events/guild-member-add.js";
import { handleReportAction } from "./moderation/reports.js";
import { startSecurityWarnings } from "./security/warnings.js";
import { logger } from "./utils/logger.js";

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
];

if (config.enablePrivilegedIntents) {
  intents.push(GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent);
}

const client = new Client({
  intents,
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, async (readyClient) => {
  logger.info("MoonPeak is online", { tag: readyClient.user.tag });
  await registerCommands(readyClient);
  startSecurityWarnings(readyClient);
});

client.on(Events.GuildMemberAdd, (member) => void handleGuildMemberAdd(member));

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (await handleReportAction(interaction)) return;
    if (interaction.isChatInputCommand()) await handleCommand(interaction);
    if (interaction.isButton() && interaction.customId.startsWith("guide:")) {
      const guide = interaction.customId.split(":")[1];
      await interaction.reply({
        content:
          guide === "security"
            ? "🛡️ Never answer random DMs. Never share passwords, private keys, seed phrases, or crypto. Report suspicious messages to verified staff."
            : guide === "rules"
              ? "📜 Be respectful, avoid scams and phishing, and follow verified staff guidance."
              : "📚 Start with `/beginner`, then learn wallets, DEXs, liquidity, market cap, scams, and safe chart basics.",
        ephemeral: true,
      });
    }
  } catch (error) {
    logger.error("Interaction handler failed", { error: String(error) });
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "MoonPeak could not complete that action. Please try again.", ephemeral: true }).catch(() => undefined);
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.mentions.has(client.user ?? "")) return;
  const question = message.content.replace(/<@!?\d+>/g, "").trim();
  if (!question) {
    await message.reply("🌙 Ask me a question about crypto, security, or getting started.").catch(() => undefined);
    return;
  }

  try {
    await message.channel.sendTyping();
    const answer = await answerMention(question);
    await message.reply(answer.slice(0, 1900));
  } catch (error) {
    logger.error("Mention response failed", { error: String(error) });
  }
});

process.on("unhandledRejection", (error) => logger.error("Unhandled promise rejection", { error: String(error) }));
process.on("uncaughtException", (error) => logger.error("Uncaught exception", { error: String(error) }));

void client.login(config.discordToken).catch((error) => {
  logger.error("MoonPeak could not log in to Discord", { error: String(error) });
  process.exitCode = 1;
});