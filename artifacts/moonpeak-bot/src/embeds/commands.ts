import { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { beginnerEmbed } from "./security.js";
import { moonpeakEmbed } from "./branding.js";

export const beginnerButtons = () =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("guide:beginner")
      .setLabel("Beginner Guide")
      .setEmoji("📚")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("guide:security")
      .setLabel("Security Guide")
      .setEmoji("🛡️")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("guide:glossary")
      .setLabel("Glossary")
      .setEmoji("📖")
      .setStyle(ButtonStyle.Secondary),
  );

export const commandEmbed = (command: string): EmbedBuilder => {
  const content: Record<string, { title: string; description: string }> = {
    help: {
      title: "MoonPeak Command Center",
      description:
        "Use `/security` for scam protection, `/beginner` for a safe learning path, `/report` to alert staff, and mention MoonPeak for beginner-friendly crypto explanations.",
    },
    rules: {
      title: "MoonPeak Rules",
      description:
        "Be respectful, do not impersonate staff, do not share scams or phishing links, and keep financial claims responsible. Staff decisions prioritize member safety.",
    },
    security: {
      title: "MoonPeak Security",
      description:
        "Never answer random DMs. MoonPeak staff will never ask for your password, private key, seed phrase, or crypto. Report suspicious messages to staff.",
    },
    faq: {
      title: "MoonPeak FAQ",
      description:
        "MoonPeak is an education and community server. Ask the AI assistant about crypto concepts, use `/glossary` for terminology, and report suspicious DMs with `/report`.",
    },
    support: {
      title: "MoonPeak Support",
      description:
        "For account or server help, contact verified MoonPeak staff in the server. Never trust support accounts that contact you first by DM.",
    },
    about: {
      title: "About MoonPeak",
      description:
        "MoonPeak brings together community, education, security reminders, and useful crypto explanations without promising profits or guaranteed trading success.",
    },
    glossary: {
      title: "Crypto Glossary",
      description:
        "**Liquidity** is the available trading depth. **Market cap** is price multiplied by circulating supply. **Slippage** is the difference between expected and executed price. **DYOR** means do your own research.",
    },
    links: {
      title: "MoonPeak Links",
      description:
        "Only trust links posted by verified MoonPeak staff in official channels. Never connect a wallet to a link sent by a random account.",
    },
    videos: {
      title: "MoonPeak Beginner Videos",
      description:
        "Start with videos on wallets, DEXs, liquidity, market cap, chart basics, and scam prevention. Staff can add approved links to this command as the server grows.",
    },
  };
  const selected = content[command] ?? content.help;
  return moonpeakEmbed(selected.title, selected.description);
};

export const beginnerResponse = () => ({
  embeds: [beginnerEmbed()],
  components: [beginnerButtons()],
});