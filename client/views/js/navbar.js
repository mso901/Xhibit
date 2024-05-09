window.addEventListener("DOMContentLoaded", function () {
  const body = document.getElementsByTagName("body")[0];
  const navbar = document.createElement("div");

  navbar.className = "navbar";
  navbar.innerHTML = `
    <div class="navbar-logo">
        <img src="../public/images/logo2.png" />
    </div>
    <div class="navbar-menu">
        <a href="">서비스소개</a>
        <a href="./signin.html">로그인</a>
        <a href="./signup.html">회원가입</a>
        <a href="./mypage.html">마이페이지</a>
    </div>
    `;

  body.insertBefore(navbar, body.firstChild);
  const loginLink = document.querySelector(
    '.navbar-menu a[href="./signin.html"]'
  );
  const myPageLink = document.querySelector(
    '.navbar-menu a[href="./mypage.html"]'
  );
  const signUpLink = document.querySelector(
    '.navbar-menu a[href="./signup.html"]'
  );

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
      loginLink.setAttribute("href", "./signin.html");
      loginLink.addEventListener("click", logout);
      myPageLink.setAttribute("href", `./myPage.html?userId=${userId}`);
      signUpLink.style.display = "none";
    } else {
      loginLink.textContent = "로그인";
      loginLink.setAttribute("href", "./signIn.html");
      myPageLink.style.display = "none";
    }
  }
  updateLoginText();
  window.addEventListener("load", updateLoginText);
});
