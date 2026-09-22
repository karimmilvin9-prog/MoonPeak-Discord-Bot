import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const commandDefinitions = [
  new SlashCommandBuilder().setName("help").setDescription("Show the MoonPeak command center"),
  new SlashCommandBuilder().setName("rules").setDescription("Show MoonPeak server rules"),
  new SlashCommandBuilder().setName("suggestions").setDescription("Share an idea for MoonPeak"),
  new SlashCommandBuilder().setName("security").setDescription("Show the MoonPeak security guide"),
  new SlashCommandBuilder().setName("beginner").setDescription("Open the beginner crypto roadmap"),
  new SlashCommandBuilder().setName("pro").setDescription("Show responsible advanced learning topics"),
  new SlashCommandBuilder().setName("videos").setDescription("Show beginner video topics"),
  new SlashCommandBuilder().setName("news").setDescription("Show the MoonPeak news guidance"),
  new SlashCommandBuilder().setName("links").setDescription("Show safe link guidance"),
  new SlashCommandBuilder().setName("faq").setDescription("Show frequently asked questions"),
  new SlashCommandBuilder().setName("support").setDescription("Show support guidance"),
  new SlashCommandBuilder().setName("about").setDescription("Learn about MoonPeak"),
  new SlashCommandBuilder().setName("server").setDescription("Show server information"),
  new SlashCommandBuilder().setName("roles").setDescription("Show role guidance"),
  new SlashCommandBuilder().setName("glossary").setDescription("Show a short crypto glossary"),
  new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure MoonPeak security settings (staff only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("warning-channel")
        .setDescription("Set the channel for recurring security warnings")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("Destination text channel").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("report-channel")
        .setDescription("Set the private staff report channel")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("Destination text channel").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("warning-interval")
        .setDescription("Set the recurring warning interval in minutes")
        .addIntegerOption((option) =>
          option
            .setName("minutes")
            .setDescription("Between 1 and 1440 minutes")
            .setMinValue(1)
            .setMaxValue(1440)
            .setRequired(true),
        ),
    ),
  new SlashCommandBuilder()
    .setName("report")
    .setDescription("Privately report a suspected scammer to MoonPeak staff")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user you are reporting").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("What happened? Do not share private keys or seed phrases.")
        .setRequired(true)
        .setMaxLength(1500),
    ),
  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create a MoonPeak embed (staff only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) =>
      option.setName("title").setDescription("Embed title").setRequired(true).setMaxLength(256),
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Embed body")
        .setRequired(true)
        .setMaxLength(4000),
    )
    .addStringOption((option) =>
      option.setName("footer").setDescription("Optional footer").setMaxLength(2048),
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription("Optional destination channel"),
    ),
].map((command) => command.toJSON());