export const PRESET_AVATARS = [
  "🦊",
  "🐼",
  "🐨",
  "🐸",
  "🦁",
  "🐯",
  "🐧",
  "🐙",
  "🦋",
  "🌻",
] as const;

export function isPresetAvatar(avatar: string | null | undefined): boolean {
  return PRESET_AVATARS.some((preset) => preset === avatar);
}
