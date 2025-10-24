AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-in-out-quad',
  offset: 120
});
  // Disable specific key combinations
document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();

  // F12
  if (e.keyCode === 123) e.preventDefault();

  // Ctrl+Shift+I / J
  if (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j')) e.preventDefault();

  // Ctrl+U / S
  if (e.ctrlKey && (key === 'u' || key === 's')) e.preventDefault();

  // Cmd+Alt+I (macOS)
  if (e.metaKey && e.altKey && key === 'i') e.preventDefault();

  // Cmd+U / S (macOS)
  if (e.metaKey && (key === 'u' || key === 's')) e.preventDefault();
});