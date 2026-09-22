import { EmbedBuilder } from "discord.js";
import { DANGER_COLOR, MOONPEAK_COLOR, SECURITY_COLOR } from "./branding.js";

const securityBody = [
  "⚠️ **NEVER ANSWER RANDOM DMs.**",
  "",
  "All random DMs can be scams. Never trust anyone claiming to be MoonPeak staff, an admin, moderator, developer, support agent, or trader.",
  "",
  "MoonPeak staff will **never** ask for:",
  "🔐 Your password\n🔑 Your private key\n🌱 Your seed phrase\n💰 Your crypto",
  "",
  "If someone DMs you:",
  "❌ Do not answer\n❌ Do not click links\n❌ Do not connect your wallet\n✅ Report it to MoonPeak staff",
].join("\n");

const warningStyles = [
  { title: "🚨 SECURITY ALERT", color: DANGER_COLOR },
  { title: "🛡️ MOONPEAK SECURITY", color: MOONPEAK_COLOR },
  { title: "⚠️ IMPORTANT WARNING", color: SECURITY_COLOR },
  { title: "🔐 STAY SAFE", color: MOONPEAK_COLOR },
  { title: "🚨 SCAM WARNING", color: DANGER_COLOR },
] as const;

export const securityWarning = (index: number) => {
  const style = warningStyles[index % warningStyles.length];
  return new EmbedBuilder()
    .setColor(style.color)
    .setTitle(style.title)
    .setDescription(securityBody)
    .setTimestamp()
    .setFooter({ text: "MoonPeak Security • Stay alert" });
};

export const welcomeEmbed = () =>
  new EmbedBuilder()
    .setColor(MOONPEAK_COLOR)
    .setTitle("🌙 WELCOME TO MOONPEAK!")
    .setDescription(
      [
        "Thank you for joining MoonPeak! 🚀",
        "",
        "Before you start, remember this important rule:",
        "🚨 **NEVER ANSWER RANDOM DMs.**",
        "",
        "Do not click suspicious links, connect your wallet to random websites, send crypto, or share your password, private key, or seed phrase.",
        "",
        "If someone tries to scam you, report them to MoonPeak staff. We will investigate and ban scammers when appropriate.",
        "",
        "🛡️ Stay safe.",
      ].join("\n"),
    )
    .setTimestamp()
    .setFooter({ text: "MoonPeak • Community, education & security" });

export const beginnerEmbed = () =>
  new EmbedBuilder()
    .setColor(MOONPEAK_COLOR)
    .setTitle("🌱 MOONPEAK BEGINNER ROADMAP")
    .setDescription(
      [
        "Start slowly, learn the basics, and protect yourself first.",
        "",
        "1️⃣ Learn crypto basics\n2️⃣ Learn wallets\n3️⃣ Learn DEXs\n4️⃣ Understand liquidity",
        "5️⃣ Understand market cap\n6️⃣ Learn common scams\n7️⃣ Learn basic chart concepts\n8️⃣ Practice safely",
      ].join("\n"),
    )
    .setTimestamp()
    .setFooter({ text: "Education is not financial advice." });