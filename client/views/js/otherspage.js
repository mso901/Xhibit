// 포폴값 받아오는 함수
async function getUserPortfolio() {
  // const userId =
  let query = window.location.search;
  let idParams = new URLSearchParams(query);
  let userId = idParams.get("userId");

  const BASE_URL = "http://localhost:3000";

  const baseInstance = axios.create({
    baseURL: BASE_URL, // 기본 URL 설정
  });
  const response = await baseInstance.get(`/api/${userId}`);
  const { user, education, award, certificate, project } = response.data;
  console.log(user);

  const myCardDiv = document.querySelector(".my-card");
  const { name, email, introduce } = user[0];

  myCardDiv.innerHTML = `<div class="my-card-header">
  <img
    src="../../public/images/img-profile01.png"
    alt="profile_img"
    class="profile_img"
  />
  <div class="my-card-intro">
    <p class="card-name">${name}</p>
    <p class="card-email">${email}</p>
  </div>
</div>

<div class="my-card-content">
  ${introduce}
</div>`;
}

getUserPortfolio();

const portfolioSection = [
  { className: "education", title: "학력" },
  { className: "awards", title: "수상이력" },
  { className: "certificate", title: "자격증" },
  { className: "projects", title: "프로젝트" },
];

{
  /* 
<div class="my-card-header">
  <img
    src="../public/images/img-profile01.png"
    alt="profile_img"
    class="profile_img"
  />
  <div class="my-card-intro">
    <p class="card-name">김철수</p>
    <p class="card-email">test@test.com</p>
  </div>
</div>

<div class="my-card-content">
  안녕하세요! 프론트엔드 개발자를 지망하는 김철수라고 합니다!
  <button class="modified-button">수정</button>
</div>
*/
}
