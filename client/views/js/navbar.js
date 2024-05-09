window.addEventListener("DOMContentLoaded", function () {
  const body = document.getElementsByTagName("body")[0];
  const navbar = document.createElement("div");

  navbar.className = "navbar";
  navbar.innerHTML = `
    <div class="navbar-logo">
        <img src="/images/logo2.png" />
    </div>
    <div class="navbar-menu">
        <a href="">서비스소개</a>
        <a href="/signin">로그인</a>
        <a href="/signup">회원가입</a>
        <a href="/mypage">마이페이지</a>
    </div>
    `;

  body.insertBefore(navbar, body.firstChild);
  const loginLink = document.querySelector('.navbar-menu a[href="/signin"]');
  const myPageLink = document.querySelector('.navbar-menu a[href="/mypage"]');
  const signUpLink = document.querySelector('.navbar-menu a[href="/signup"]');

  function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userId");
  }

  async function logout() {
    const BASE_URL = "http://localhost:3000";

    const baseInstance = await axios.create({
      baseURL: BASE_URL, // 기본 URL 설정
    });
    await baseInstance.post("/api/logout");
  }

  function updateLoginText() {
    const userId = getUserIdFromUrl();

    if (userId) {
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
