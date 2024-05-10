// 세션에서 토큰 가져온다.
const token = sessionStorage.getItem("token");
const userId = this.sessionStorage.getItem("userId");

// 리스트 시작
function getUsers() {
  const userCardList = document.querySelector(".user_card-list");

  const BASE_URL = "http://kdt-ai-10-team04.elicecoding.com";

  const baseInstance = axios.create({
    baseURL: BASE_URL, // 기본 URL 설정
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  baseInstance
    .get("/api", {})
    .then((res) => {
      const users = res.data;
      console.log(users);
      users.forEach(async (user) => {
        const { _id, name, email, introduce, isDeleted } = user;
        userCardList.insertAdjacentHTML(
          "beforeend",
          `
          ${
            isDeleted
              ? ``
              : userId === _id // 만약 로그인한 유저와 같다면 메인에서 볼때 자기 카드를 표시해준다.
              ? `
      <div class="user_card">
        <div>
          <div class="my-card-mark">
            <img src="/images/clip.png" alt="mycard-mark">
          </div>
          <img src="/images/img-profile01.png" alt="profile_img" class="profile_img">
      </div>
      <div class="user_card-intro">
          <p class="card-name">${name}</p>
          <p class="card-email">${email}</p>
      </div>
      <div class="user_card-content">
          ${introduce}
          <p></p>
      </div>
      <div class="user_card-bottom">
          <a href = /otherspage?userId=${_id}>자세히보기 ></a>
      </div>
  </div>`
              : `<div class="user_card">
  <div>
      <img src="/images/img-profile01.png" alt="profile_img" class="profile_img">
  </div>
  <div class="user_card-intro">
      <p class="card-name">${name}</p>
      <p class="card-email">${email}</p>
  </div>
  <div class="user_card-content">
      ${introduce}
      <p></p>
  </div>
  <div class="user_card-bottom">
      <a href = /otherspage?userId=${_id}>자세히보기 ></a>
  </div>
</div>`
          }
          `
        );
      });
    })
    .catch(() => {
      window.location.href = "/signin";
    });
}

getUsers();
