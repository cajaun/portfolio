export function getAvatarDragShadow(theme: string | undefined) {
  return theme === "dark"
    ? "0 0 0 1px #ffffff14, 0px 16px 32px rgba(0, 0, 0, 0.45), 0px 4px 12px rgba(0, 0, 0, 0.3)"
    : "0 0 0 1px #0000000f, 0px 16px 32px rgba(0, 0, 0, 0.12), 0px 4px 12px rgba(0, 0, 0, 0.08)";
}

export function getArticleActionShadow(theme: string | undefined) {
  return theme === "dark" ? "0 0 0 1px #ffffff14" : "0 0 0 1px #0000000f";
}
