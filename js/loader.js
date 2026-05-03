function loadComponent(id, path, callback) {
  fetch(path)
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao carregar: " + path);
      return response.text();
    })
    .then((data) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = data;
      if (callback) callback();
    })
    .catch((error) => console.error(error));
}

function resolveBaseDir() {
  const scripts = document.getElementsByTagName('script');
  for (const s of scripts) {
    if (s.src && s.src.includes('/js/loader.js')) {
      return s.src.replace(/\/js\/loader\.js.*$/, '/');
    }
  }
  return '/';
}

document.addEventListener("DOMContentLoaded", () => {
  const base = resolveBaseDir();
  loadComponent("footer", base + "components/footer.html");
});
