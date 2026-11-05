// Vite embeds this value into the frontend at dev/build time.
export const discordWebhookUrl = (import.meta.env.VITE_DISCORD_WEBHOOK_URL as string | undefined)?.trim() ?? '';
