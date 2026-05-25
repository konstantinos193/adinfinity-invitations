export async function copyToClipboard(text: string): Promise<void> {
  try {
    // Modern async clipboard API (requires HTTPS or localhost)
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for HTTP environments
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.top = '-9999px';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
