{
	/* <div class="user_card-list">
    <div class="user_card">
        <div>
            <img src="../../../public/images/img-profile01.png" alt="profile_img" class="profile_img">
        </div>
        <div class="user_card-intro">
            <p class="card-name">김철수</p>
            <p class="card-email">test@test.com</p>
        </div>
        <div class="user_card-content">
            안녕하세요! 프론트엔드 개발자를 지망하는 김철수라고 합니다!
            <p></p>
        </div>
        <div class="user_card-bottom">
            <a>자세히보기 ></a>
        </div>
    </div>
</div> */
}
// 리스트 시작

function getUsers() {
	const userCardList = document.querySelector(".user_card-list");
	const BASE_URL = "http://localhost:8080";

	const baseInstance = axios.create({
		baseURL: BASE_URL, // 기본 URL 설정
	});
	baseInstance.get("/main").then((res) => {
		const users = res.data;
		console.log(users);
		users.forEach(async (user) => {
			const { _id, name, email, introduce } = user;
			userCardList.insertAdjacentHTML(
				"beforeend",
				`
        <div class="user_card">
        <div>
            <img src="../../../public/images/img-profile01.png" alt="profile_img" class="profile_img">
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
            <a href = "./othersPage.html/${_id}">자세히보기 ></a>
        </div>
    </div>
        `
			);
		});
	});
}

getUsers();
