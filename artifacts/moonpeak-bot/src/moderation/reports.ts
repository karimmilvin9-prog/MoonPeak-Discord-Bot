import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  Interaction,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import { config } from "../config/env.js";
import { DANGER_COLOR, MOONPEAK_COLOR, SUCCESS_COLOR, errorEmbed } from "../embeds/branding.js";
import { logger } from "../utils/logger.js";

const reportActions = (userId: string) =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`report:ban:${userId}`)
      .setLabel("Ban")
      .setEmoji("🔨")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`report:review:${userId}`)
      .setLabel("Review")
      .setEmoji("👀")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`report:dismiss:${userId}`)
      .setLabel("Dismiss")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Secondary),
  );

export const createScamReport = async (
  interaction: Interaction & { isChatInputCommand(): this is Interaction },
) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "report") return;
  const user = interaction.options.getUser("user", true);
  const reason = interaction.options.getString("reason", true);
  const channel = config.reportChannelId
    ? interaction.client.channels.cache.get(config.reportChannelId)
    : undefined;

  if (!(channel instanceof TextChannel)) {
    await interaction.reply({
      embeds: [errorEmbed("Staff reporting is not configured yet. Please contact a verified moderator.")],
      ephemeral: true,
    });
    return;
  }

  const reportEmbed = new EmbedBuilder()
    .setColor(DANGER_COLOR)
    .setTitle("🚨 NEW SCAM REPORT")
    .addFields(
      { name: "Reported user", value: `<@${user.id}> (${user.id})` },
      { name: "Reported by", value: `<@${interaction.user.id}> (${interaction.user.id})` },
      { name: "Reason", value: reason },
    )
    .setTimestamp()
    .setFooter({ text: "MoonPeak moderation queue" });

  try {
    await channel.send({ embeds: [reportEmbed], components: [reportActions(user.id)] });
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(SUCCESS_COLOR)
          .setTitle("✅ Report received")
          .setDescription("Thank you for helping protect MoonPeak. Staff will review the report privately."),
      ],
      ephemeral: true,
    });
  } catch (error) {
    logger.error("Scam report could not be sent", { error: String(error) });
    await interaction.reply({
      embeds: [errorEmbed("The report could not be delivered. Please try again or contact staff.")],
      ephemeral: true,
    });
  }
};

export const handleReportAction = async (interaction: Interaction) => {
  if (!interaction.isButton() || !interaction.customId.startsWith("report:")) return false;
  const member = interaction.member as GuildMember | null;
  if (!member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
    await interaction.reply({ embeds: [errorEmbed("Only authorized MoonPeak staff can use moderation actions.")], ephemeral: true });
    return true;
  }

  const [, action, userId] = interaction.customId.split(":");
  if (action === "ban") {
    if (!member.permissions.has(PermissionFlagsBits.BanMembers) || !interaction.guild) {
      await interaction.reply({ embeds: [errorEmbed("You need the Ban Members permission to ban a reported user.")], ephemeral: true });
      return true;
    }
    try {
      await interaction.guild.members.ban(userId, { reason: `MoonPeak scam report reviewed by ${interaction.user.tag}` });
      await interaction.update({ embeds: [new EmbedBuilder().setColor(SUCCESS_COLOR).setTitle("🔨 Report action: user banned").setDescription(`Actioned by <@${interaction.user.id}>.`)], components: [] });
    } catch (error) {
      logger.error("Reported user could not be banned", { userId, error: String(error) });
      await interaction.reply({ embeds: [errorEmbed("The ban failed. Check hierarchy and permissions.")], ephemeral: true });
    }
  } else if (action === "review") {
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(MOONPEAK_COLOR).setTitle("👀 Report marked for review").setDescription(`Staff member: <@${interaction.user.id}>.`)], ephemeral: true });
  } else {
    await interaction.update({ embeds: [new EmbedBuilder().setColor(MOONPEAK_COLOR).setTitle("❌ Report dismissed").setDescription(`Dismissed by <@${interaction.user.id}>.`)], components: [] });
  }
  return true;
};