window.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("wrap");
  const navbar = document.createElement("div");
  // 세션에서 토큰 값 가져온다.
  const token = sessionStorage.getItem("token");
  const userId = this.sessionStorage.getItem("userId");

  navbar.className = "navbar";
  navbar.innerHTML = `
    <div class="navbar-logo">
        <img src="/images/logo2.png" />
    </div>
    <div class="navbar-menu">
        <a href="/main">메인페이지</a>
        <a href="/mypage">마이페이지</a>
        <a href="/signin">로그인</a>
        <a href="/signup">회원가입</a>
    </div>
    `;

  wrapper.insertBefore(navbar, wrapper.firstChild);
  const mainLink = document.querySelector('.navbar-menu a[href="/main"]');
  const loginLink = document.querySelector('.navbar-menu a[href="/signin"]');
  const myPageLink = document.querySelector('.navbar-menu a[href="/mypage"]');
  const signUpLink = document.querySelector('.navbar-menu a[href="/signup"]');

  async function logout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
  }

  function updateLoginText() {
    if (token) {
      mainLink.setAttribute("href", `/main`);
      loginLink.textContent = "로그아웃";
      loginLink.setAttribute("href", "/signin");
      loginLink.addEventListener("click", logout);
      myPageLink.setAttribute("href", `/myPage?userId=${userId}`);
      signUpLink.style.display = "none";
    } else {
      loginLink.textContent = "로그인";
      loginLink.setAttribute("href", "/signIn");
      myPageLink.style.display = "none";
    }
  }
  updateLoginText();
  window.addEventListener("load", updateLoginText);
});
