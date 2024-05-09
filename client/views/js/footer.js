window.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("wrap");
  const footer = document.createElement("div");
  footer.className = "footer";

  footer.innerHTML = `
    <div class="footer-logo">
      <img src="/images/logo4.png" />
    </div>
    <div class="copywright">@2024 CRAFTERS CORP. All Rights Reserved</div>
  `;
  wrapper.insertAdjacentElement("beforeend", footer);
});
