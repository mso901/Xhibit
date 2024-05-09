// 유저 이메일
const inputEmail = document.querySelector("#email");

// 유저 네임
const inputPassword = document.querySelector("#password");

// 로그인 실패 메세지
const loginErrorMessage = document.querySelector(".loginError-message");

// 폼 sumbit 버튼
const submitButton = document.querySelector(".form-control-submit-button");

const form = document.getElementsByTagName("form")[0];

async function onLoginSubmit(e) {
  e.preventDefault();
  // console.log(inputEmail.value, inputPassword.value);

  const BASE_URL = "http://kdt-ai-10-team04.elicecoding.com/";

  const baseInstance = await axios.create({
    baseURL: BASE_URL, // 기본 URL 설정
  });

  // 로그인 유효성 검사 및 로그인 요청
  await baseInstance
    .post(
      `${BASE_URL}/api/signin`,
      {
        email: inputEmail.value,
        password: inputPassword.value,
      },
      { withCredentials: true }
    )
    .then((res) => {
      const userId = res.data.user._id;
      console.log(userId);
      window.location.href = `/main?userId=${userId}`;
    })
    .catch(() => {
      loginErrorMessage.classList.remove("hide"); // 실패 메시지 보임
      console.log("login error");
    });
}
form.addEventListener("submit", onLoginSubmit);

// 로그인 유효성 검사 및 로그인 요청
