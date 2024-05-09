// 리스트 시작

function getUsers() {
  const userCardList = document.querySelector(".user_card-list");

  const BASE_URL = "http://kdt-ai-10-team04.elicecoding.com";

  const baseInstance = axios.create({
    baseURL: BASE_URL, // 기본 URL 설정
  });
  baseInstance
    .get("/api", {})
    .then((res) => {
      const users = res.data;
      // console.log(users);
      users.forEach(async (user) => {
        const { _id, name, email, introduce } = user;
        userCardList.insertAdjacentHTML(
          "beforeend",
          `
          <div class="user_card">
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
      </div>
          `
        );
      });
    })
    .catch(() => {
      window.location.href = "/signin";
    });
}

getUsers();

{
  /* <a href = "localhost:8080/otherspage/${_id}">자세히보기 ></a> */
}
// 일단 주석처리
