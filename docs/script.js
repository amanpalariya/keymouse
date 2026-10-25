const themeButton = document.querySelector('#theme-toggle');
const themeLabel = document.querySelector('#theme-label');
const themeIcon = document.querySelector('#theme-icon');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
function isDark() {
  return document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : systemTheme.matches;
}
function updateThemeButton() {
  const dark = isDark();
  themeLabel.textContent = dark ? 'Light' : 'Dark';
  themeIcon.textContent = dark ? '☼' : '☾';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
}
themeButton.hidden = false;
updateThemeButton();
systemTheme.addEventListener('change', updateThemeButton);
themeButton.addEventListener('click', () => {
  const theme = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('keymouse-theme', theme); } catch {}
  updateThemeButton();
});
const copyButton = document.querySelector('#copy-command');
if (navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('./scripts/install-app.sh');
      copyButton.textContent = 'Copied';
      document.querySelector('#copy-status').textContent = 'Install command copied.';
      setTimeout(() => { copyButton.textContent = 'Copy'; }, 2000);
    } catch {
      document.querySelector('#copy-status').textContent = 'Could not copy. Select the command to copy it manually.';
    }
  });
}
