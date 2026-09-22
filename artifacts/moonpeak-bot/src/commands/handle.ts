import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { config } from "../config/env.js";
import { updateConfig } from "../config/env.js";
import { persistConfig } from "../config/runtime.js";
import { errorEmbed, moonpeakEmbed } from "../embeds/branding.js";
import { beginnerResponse, commandEmbed } from "../embeds/commands.js";
import { createScamReport } from "../moderation/reports.js";
import { restartSecurityWarnings } from "../security/warnings.js";

const textCommandNames = new Set([
  "help",
  "rules",
  "security",
  "faq",
  "support",
  "about",
  "glossary",
  "links",
  "videos",
]);

export const handleCommand = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.commandName === "report") {
    await createScamReport(interaction);
    return;
  }

  if (interaction.commandName === "config") {
    await handleConfig(interaction);
    return;
  }

  if (interaction.commandName === "beginner") {
    await interaction.reply(beginnerResponse());
    return;
  }

  if (textCommandNames.has(interaction.commandName)) {
    await interaction.reply({ embeds: [commandEmbed(interaction.commandName)] });
    return;
  }

  if (interaction.commandName === "suggestions") {
    await interaction.reply({
      embeds: [moonpeakEmbed("Share a suggestion", "Send your idea to the appropriate MoonPeak feedback channel. Do not include seed phrases, private keys, or passwords.")],
      ephemeral: true,
    });
    return;
  }

  if (interaction.commandName === "pro") {
    await interaction.reply({
      embeds: [moonpeakEmbed("Advanced Learning", "Explore market structure, risk management, chart concepts, liquidity, and on-chain research. Advanced knowledge does not remove risk, so verify information and size responsibly.")],
    });
    return;
  }

  if (interaction.commandName === "news") {
    await interaction.reply({
      embeds: [moonpeakEmbed("MoonPeak News", "Treat crypto news as unverified until checked against primary sources. Never trade because of a DM, giveaway, urgency, or guaranteed-return claim.")],
    });
    return;
  }

  if (interaction.commandName === "server") {
    const guild = interaction.guild;
    await interaction.reply({
      embeds: [moonpeakEmbed("Server Snapshot", guild ? `**${guild.name}**\nMembers: **${guild.memberCount}**\nUse \`/help\` to explore MoonPeak.` : "This command is only available inside a server.")],
    });
    return;
  }

  if (interaction.commandName === "roles") {
    await interaction.reply({
      embeds: [moonpeakEmbed("MoonPeak Roles", "Only trust role names and permissions visible in the official server. Staff will not ask you to verify a role through a random DM.")],
    });
    return;
  }

  if (interaction.commandName === "embed") {
    await handleAdminEmbed(interaction);
  }
};

const handleConfig = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
    await interaction.reply({ embeds: [errorEmbed("Only administrators can change MoonPeak configuration.")], ephemeral: true });
    return;
  }

  const subcommand = interaction.options.getSubcommand();
  if (subcommand === "warning-channel" || subcommand === "report-channel") {
    const channel = interaction.options.getChannel("channel", true);
    if (channel.type !== ChannelType.GuildText) {
      await interaction.reply({ embeds: [errorEmbed("Choose a standard text channel.")], ephemeral: true });
      return;
    }
    updateConfig(subcommand === "warning-channel" ? { warningChannelId: channel.id } : { reportChannelId: channel.id });
    persistConfig();
    if (subcommand === "warning-channel") restartSecurityWarnings(interaction.client);
    await interaction.reply({
      embeds: [moonpeakEmbed("Configuration updated", `${subcommand === "warning-channel" ? "Security warnings" : "Scam reports"} will use <#${channel.id}>.`)],
      ephemeral: true,
    });
    return;
  }

  const minutes = interaction.options.getInteger("minutes", true);
  updateConfig({ warningIntervalMs: minutes * 60 * 1000 });
  persistConfig();
  restartSecurityWarnings(interaction.client);
  await interaction.reply({
    embeds: [moonpeakEmbed("Configuration updated", `Security warnings will repeat every **${minutes} minute${minutes === 1 ? "" : "s"}**.`)],
    ephemeral: true,
  });
};

const handleAdminEmbed = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
    await interaction.reply({ embeds: [errorEmbed("Only administrators can create MoonPeak embeds.")], ephemeral: true });
    return;
  }

  const title = interaction.options.getString("title", true);
  const description = interaction.options.getString("description", true);
  const footer = interaction.options.getString("footer");
  const selectedChannel = interaction.options.getChannel("channel");
  const channel = selectedChannel ?? interaction.channel;

  if (!channel || !("send" in channel) || (selectedChannel && selectedChannel.type !== ChannelType.GuildText)) {
    await interaction.reply({ embeds: [errorEmbed("Choose a standard text channel for the embed.")], ephemeral: true });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0x9b7cff)
    .setTitle(`🌙 ${title}`)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: footer || "MoonPeak" });

  try {
    await channel.send({ embeds: [embed] });
    await interaction.reply({ embeds: [moonpeakEmbed("Embed published", `Posted in <#${channel.id}>.`)], ephemeral: true });
  } catch (error) {
    await interaction.reply({ embeds: [errorEmbed(`The embed could not be published: ${String(error)}`)], ephemeral: true });
  }
};