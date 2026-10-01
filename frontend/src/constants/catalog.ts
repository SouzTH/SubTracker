// Catálogo único dos serviços conhecidos pelo sistema.
//
// Antes esta lista existia duas vezes: uma em AddSubscription.tsx (para o
// grid de escolha do serviço) e outra em SubscriptionDetails.tsx (só com os
// links de cancelamento). As duas podiam divergir silenciosamente — por
// exemplo, cadastrar um serviço novo aqui e esquecer de adicionar o link de
// cancelamento lá. Agora é uma fonte única: cada serviço já carrega o seu
// próprio `cancelUrl` (quando existe).

export const SERVICES = [
  { name: "Netflix", icon: "🎬", color: "#e50914", category: "Streaming", cancelUrl: "https://www.netflix.com/cancelplan" },
  { name: "Spotify", icon: "🎵", color: "#1db954", category: "Música", cancelUrl: "https://www.spotify.com/br/account/subscription/cancel" },
  { name: "Disney+", icon: "✨", color: "#0063e5", category: "Streaming", cancelUrl: "https://www.disneyplus.com/pt-br/account" },
  { name: "HBO Max", icon: "📺", color: "#5822a4", category: "Streaming", cancelUrl: "https://www.max.com/pt-br/account" },
  { name: "Adobe Creative", icon: "🎨", color: "#ff0000", category: "Trabalho", cancelUrl: "https://account.adobe.com/plans" },
  { name: "GitHub Pro", icon: "💻", color: "#6e5494", category: "Trabalho", cancelUrl: "https://github.com/settings/billing" },
  { name: "Academia", icon: "💪", color: "#f59e0b", category: "Fitness", cancelUrl: "https://www.smartfit.com.br/cancelamento" },
  { name: "PlayStation+", icon: "🎮", color: "#003087", category: "Jogos", cancelUrl: "https://www.playstation.com/pt-br/support/subscriptions/cancel-ps-plus/" },
  { name: "Outro", icon: "📦", color: "#64748b", category: "Outros", cancelUrl: null },
] as const;

export type ServiceCatalogEntry = (typeof SERVICES)[number];

/** Deriva os links de cancelamento a partir do catálogo único acima. */
export const CANCEL_URLS: Record<string, string> = Object.fromEntries(
  SERVICES.filter((s) => s.cancelUrl).map((s) => [s.name, s.cancelUrl as string]),
);
