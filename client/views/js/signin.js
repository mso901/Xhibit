// 유저 이메일
const inputEmail = document.querySelector("#email");

// 유저 네임
const inputPassword = document.querySelector("#password");

// 폼 sumbit 버튼
const submitButton = document.querySelector(".form-control-submit-button");

const form = document.getElementsByTagName("form")[0];

async function onLoginSubmit(e) {
  e.preventDefault();
  // console.log(inputEmail.value, inputPassword.value);

  const BASE_URL = "http://localhost:3000";

  const baseInstance = await axios.create({
    baseURL: BASE_URL, // 기본 URL 설정
  });

  // 로그인 요청
  const response = await baseInstance
    .post(
      `${BASE_URL}/api/signin`,
      {
        email: inputEmail.value,
        password: inputPassword.value,
      },
      { withCredentials: true }
    )
    .then(() => {
      window.location.href = "/main";
    })
    .catch(() => {
      console.log("login error");
    });
}
form.addEventListener("submit", onLoginSubmit);
