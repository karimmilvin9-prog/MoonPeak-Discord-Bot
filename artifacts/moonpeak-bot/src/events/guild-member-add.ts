import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";
import { logger } from "../utils/logger.js";
import { welcomeEmbed } from "../embeds/security.js";

export const handleGuildMemberAdd = async (member: GuildMember) => {
  try {
    await member.send({
      embeds: [welcomeEmbed()],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("guide:beginner")
            .setLabel("Start Here")
            .setEmoji("🚀")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("guide:security")
            .setLabel("Security Guide")
            .setEmoji("🛡️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("guide:rules")
            .setLabel("Rules")
            .setEmoji("📜")
            .setStyle(ButtonStyle.Secondary),
        ),
      ],
    });
  } catch (error) {
    logger.warn("Welcome DM could not be delivered", {
      userId: member.id,
      reason: "DMs may be disabled or the bot may lack access",
      error: String(error),
    });
  }
};