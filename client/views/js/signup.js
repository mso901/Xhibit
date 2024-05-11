// 유저 네임
const inputName = document.querySelector("#name");
// 유저 이메일
const inputEmail = document.querySelector("#email");

// 1. 비밀번호 입력창 정보 가져오기
const inputPassword = document.querySelector("#password"); // input#password
// 2. 비밀번호 확인 입력창 정보 가져오기
const inputPasswordRetype = document.querySelector("#password-retype"); // input#password-retype
// 3. 실패 메시지 정보 가져오기 (중복 이메일)
const emailDuplicationMessage = document.querySelector(
  ".emailDuplication-message"
);
// 4. 실패 메시지 정보 가져오기 (비밀번호 불일치)
const mismatchMessage = document.querySelector(".mismatch-message"); // div.mismatch-message.hide
// 5. 실패 메시지 정보 가져오기 (8글자 이상, 영문, 숫자, 특수문자 미사용)
const strongPasswordMessage = document.querySelector(".strongPassword-message"); // div.strongPassword-message.hide

const submitButton = document.querySelector(".form-control-submit-button");
// 전체 폼 입력 확인

// 보안성 높이기위한 패스워드 체크
function strongPassword(str) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
    str
  );
}

// 패스워드 재확인
function isMatch(password1, password2) {
  return password1 === password2;
}

// 패스워드 유효성 검사
inputPassword.onkeyup = function () {
  // 값 입력한 경우
  if (inputPassword.value.length !== 0) {
    if (strongPassword(inputPassword.value)) {
      strongPasswordMessage.classList.add("hide"); //실패 메시지 숨김
    } else if (
      isMatch(inputPassword.value, inputPasswordRetype.value) &&
      strongPassword(inputPassword.value)
    ) {
      strongPasswordMessage.classList.add("hide"); //실패 메시지 숨김
      submitButton.disabled = false;
    } else {
      strongPasswordMessage.classList.remove("hide"); //실패 메시지 보임
      submitButton.disabled = true;
    }
  } else {
    strongPasswordMessage.classList.add("hide");
    submitButton.disabled = true;
  }
};

// 패스워드 일치 검사
inputPasswordRetype.onkeyup = function () {
  if (inputPasswordRetype.value.length !== 0) {
    if (
      isMatch(inputPassword.value, inputPasswordRetype.value) &&
      strongPassword(inputPassword.value)
    ) {
      mismatchMessage.classList.add("hide"); // 실패 메시지 숨김
      submitButton.disabled = false;
    } else {
      mismatchMessage.classList.remove("hide"); // 실패 메시지 보임
      submitButton.disabled = true;
    }
  } else {
    mismatchMessage.classList.add("hide"); //실패 메시지 숨김
    submitButton.disabled = true;
  }
};

// 비밀번호 show / hide
document.addEventListener("DOMContentLoaded", function () {
  const eyeIcon = document.querySelector(".form-group .password-eye");
  const passwordInput = document.querySelector(".form-control-input.password");

  eyeIcon.addEventListener("click", function () {
    passwordInput.classList.toggle("active");

    if (passwordInput.classList.contains("active")) {
      this.className = "fa-solid fa-eye-slash";
      passwordInput.type = "text";
    } else {
      this.className = "fa-solid fa-eye";
      passwordInput.type = "password";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const eyeIcon = document.querySelector(".form-group .password-check-eye");
  const passwordInput = document.querySelector(
    ".form-control-input.password-check"
  );

  eyeIcon.addEventListener("click", function () {
    passwordInput.classList.toggle("active");

    if (passwordInput.classList.contains("active")) {
      this.className = "fa-solid fa-eye-slash";
      passwordInput.type = "text";
    } else {
      this.className = "fa-solid fa-eye";
      passwordInput.type = "password";
    }
  });
});

// axios 테스트 코드 - 일단 회원가입하면 local에있는 db에 데이터가 들어간다.
const form = document.getElementsByTagName("form")[0];

async function onLoginSubmit(e) {
  e.preventDefault();
  // console.log(inputName, inputEmail, inputPassword);
  const BASE_URL = "http://kdt-ai-10-team04.elicecoding.com";

  const baseInstance = await axios.create({
    baseURL: BASE_URL, // 기본 URL 설정
  });

  await baseInstance
    .post("/api/signup", {
      name: inputName.value,
      email: inputEmail.value,
      password: inputPassword.value,
    })
    .then(() => {
      window.location.href = "/welcomePage";
    })
    .catch(() => {
      emailDuplicationMessage.classList.remove("hide"); // 실패 메시지 보임
      console.log("login error");
    });
  // response가 잘 들어왔는지 확인
  // console.log(response.data.data);
}

form.addEventListener("submit", onLoginSubmit);
