document.addEventListener("DOMContentLoaded", () => {
  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const input = document.getElementById("object-name");
  const chips = document.querySelectorAll(".chip");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const value = chip.getAttribute("data-object");
      if (input && value) {
        input.value = value;
        input.focus();
      }
    });
  });
});
