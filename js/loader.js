function loadComponent(id, path, callback) {
  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar: " + path);
      return response.text();
    })
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback(); // 🔥 ponto-chave
    })
    .catch(error => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("footer", "/components/footer.html");
});