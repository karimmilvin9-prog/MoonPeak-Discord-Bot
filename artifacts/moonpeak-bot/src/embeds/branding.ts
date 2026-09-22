import { EmbedBuilder } from "discord.js";

export const MOONPEAK_COLOR = 0x9b7cff;
export const SECURITY_COLOR = 0xffb347;
export const DANGER_COLOR = 0xff5c7a;
export const SUCCESS_COLOR = 0x63d7a3;

export const moonpeakEmbed = (title: string, description?: string) =>
  new EmbedBuilder()
    .setColor(MOONPEAK_COLOR)
    .setTitle(`🌙 ${title}`)
    .setDescription(description ?? null)
    .setTimestamp()
    .setFooter({ text: "MoonPeak • Community, education & security" });

export const errorEmbed = (description: string) =>
  new EmbedBuilder()
    .setColor(DANGER_COLOR)
    .setTitle("⚠️ MoonPeak could not complete that")
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: "MoonPeak support" });