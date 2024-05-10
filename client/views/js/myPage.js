import * as formAPI from "./formAPI.js";

// 포폴 섹션 - 학력, 수상이력, 자격증, 플젝
const portfolioSection = [
	{ className: "education", title: "학력" },
	{ className: "award", title: "수상이력" },
	{ className: "certificate", title: "자격증" },
	{ className: "project", title: "프로젝트" },
];

// 수정 버튼 누를때만 수정이 가능하게 만들도록 제어하는 함수
const toggleInputs = (form, disable) => {
	const inputs = form.querySelectorAll("input");
	inputs.forEach((input) => (input.disabled = disable));
	const textareas = form.querySelectorAll("textarea");
	textareas.forEach((input) => (input.disabled = disable));
};

// 버튼들 만들어 주는 함수
const createBtns = (givenForm, section, edit = false) => {
	const params = new URLSearchParams(window.location.search);
	const userId = params.get("userId");

	const btnContainer = document.createElement("div");
	btnContainer.className = "buttons";

	// 확인 버튼 (submit)
	const submitBtn = document.createElement("button");
	submitBtn.className = edit ? "btn save hide" : "btn save";
	submitBtn.innerText = `확인`;
	submitBtn.setAttribute("type", "submit");
	submitBtn.setAttribute("update", edit);
	btnContainer.appendChild(submitBtn);

	// 수정 버튼
	const editBtn = document.createElement("div");
	editBtn.className = edit ? "btn edit" : "btn edit hide";
	editBtn.innerText = `수정`;
	btnContainer.appendChild(editBtn);

	// 수정 버튼 클릭시 input disable하고 확인 버튼 나타나게 해줌
	editBtn.addEventListener("click", function () {
		editBtn.classList.toggle("hide");
		submitBtn.classList.toggle("hide");
		toggleInputs(givenForm, false);
	});

	const deleteBtn = document.createElement("div");
	deleteBtn.className = "btn delete";
	deleteBtn.innerText = "삭제";

	// 삭제 버튼 기능 추가
	deleteBtn.addEventListener("click", () => {
		// 정말 삭제할지 확인하는 모달창
		const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
		modal.show();

		// 사용자가 확인하면 해당 폼 삭제
		const confirmButton = modal._element.querySelector(".btn-primary");
		confirmButton.addEventListener(
			"click",
			() => {
				const form = deleteBtn.closest(".portfolio-section");
				const formId = givenForm.getAttribute("formid");
				form.remove();
				formAPI
					.deleteForm(section, formId)
					.then(() => {
						console.log("폼을 삭제합니다");
					})
					.catch((err) => {
						console.error("폼 삭제 실패:", err);
					});

				modal.hide();
			},
			{ once: true }
		);

		// 삭제 취소 버튼
		const closeButton = modal._element.querySelectorAll("button")[0];
		closeButton.addEventListener(
			"click",
			() => {
				modal.hide();
			},
			{ once: true }
		);
	});

	btnContainer.appendChild(deleteBtn);
	return btnContainer;
};

// 인풋 타입 만들어주는 함수
const createInput = (
	name,
	placeholder,
	isSaved = false,
	value = null,
	maxLength = 100,
	isDate = false
) => {
	const input = document.createElement("input");
	input.name = name;

	if (isDate) {
		// 날짜는 숫자만 받아야함
		input.type = "number";

		// e 는 숫자이기 때문에 타입을 숫자로 설정해도 e 넣을 수 있음
		// +, -도 넣을 수 있기 때문에 막아줘야 함
		// 타입이 넘버일때 property maxLength 작동 안됨
		// max length가 되었을때 delete, arrow left & right 등은 허용
		input.addEventListener("keydown", (event) => {
			const currValue = event.target.value;
			const invalidKeys = ["e", "E", "+", "-"];
			const allowedKeys = [
				"Backspace",
				"Delete",
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown",
			];
			if (
				invalidKeys.includes(event.key) ||
				(currValue.length >= maxLength && !allowedKeys.includes(event.code))
			) {
				event.preventDefault();
			}
		});
	} else {
		input.className = name;
	}
	input.placeholder = placeholder;

	// 저장된 정보가 있다면 하면 값 지정해줌
	if (isSaved) {
		input.value = value;
	}

	// 프로젝트 링크는 사용자마다 선택으로 남겨둠
	if (name === "proj-link") {
		input.type = "url";
		input.required = false;

		// 나머지 인풋들은 필수
	} else {
		// 굳이 name을 확인하는 이유는 이렇게 안하면 proj-link에도 required가 됨
		if (name !== "skills") {
			input.required = true;
		}
	}
	return input;
};

// 날짜 부분 인풋만들어주는 함수
function createDateInput(section, startDate = null, endDate = null) {
	const dateInput = document.createElement("div");
	dateInput.className = "date";

	// 날짜 "."로 나눌 수 있게 . 만들어주는 함수
	const createDivider = () => {
		const span = document.createElement("span");
		span.innerText = ".";
		return span;
	};

	let startYear, startMonth, endYear, endMonth;
	const maxLenYr = 4,
		maxLenMonth = 2;

	// 저장된 정보가 없다면 인풋함수 만들기
	if (!startDate) {
		startYear = createInput("startYear", "YYYY", false, false, maxLenYr, true);
		startMonth = createInput(
			"startMonth",
			"MM",
			false,
			false,
			maxLenMonth,
			true
		);
		endYear = createInput("endYear", "YYYY", false, false, maxLenYr, true);
		endMonth = createInput("endMonth", "MM", false, false, maxLenMonth, true);

		// 저장된 정보가 있다면 값도 함께 보내주기
	} else {
		const [startY, startM] = startDate.split(".");
		startYear = createInput("startYear", "YYYY", true, startY, maxLenYr, true);
		startMonth = createInput(
			"startMonth",
			"MM",
			true,
			startM,
			maxLenMonth,
			true
		);
		if (endDate) {
			const [endY, endM] = endDate.split(".");
			endYear = createInput("endYear", "YYYY", true, endY, maxLenYr, true);
			endMonth = createInput("endMonth", "YYYY", true, endM, maxLenMonth, true);
		}
	}

	const divider1 = createDivider();
	const divider2 = createDivider();

	const dash = document.createElement("span");
	dash.innerText = "~";

	// 학력이랑 프로젝트는 시작년월이랑 끝년월 인풋 받기
	if (section === "education" || section === "project") {
		dateInput.append(
			startYear,
			divider1,
			startMonth,
			dash,
			endYear,
			divider2,
			endMonth
		);
		// 나머지 섹션 (수상, 자격증)은 년월만 인풋 받기
	} else {
		dateInput.append(startYear, divider1, startMonth);
	}

	return dateInput;
}

// 사용자가 프로젝트 섹션에 스킬 추가 할때 칩 만들어서 업데이트 해주는 함수
const createSkills = (chipset) => {
	const skills = createInput("skills", "스킬 태그를 추가해주세요");

	// 스킬 인풋에 테크 스택 입력하고 엔터 누르면 칩 생성
	skills.addEventListener("keypress", async function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			const skill = document.createElement("md-input-chip");
			skill.className = "skill";
			skill.label = event.target.value;

			chipset.appendChild(skill);
			// callChip();
			event.target.value = "";
		}
	});

	return skills;
};

// 백엔드로 보낼 날짜 포멧해주는 함수
function getFormattedDate(section, dateInputs) {
	const { startYear, startMonth, endYear, endMonth } = dateInputs;

	const start = `${startYear.value}.${startMonth.value}`;

	if (section === "award" || section === "certificate") {
		return start;
	}
	const end = `${endYear.value}.${endMonth.value}`;
	return `${start} - ${end}`;
}

// 학력, 상, 자격증, 플젝
// 각 섹션의 인풋 폼 만들어 주는 함수
const createSectionForm = (section, data = null) => {
	const sectionContainer = document.createElement("div");
	sectionContainer.className = `portfolio-section ${section}`;

	const sectionInput = document.createElement("form");
	sectionInput.className = `item ${section}`;

	const inputInfo = document.createElement("div");
	inputInfo.className = "input-info";
	sectionInput.appendChild(inputInfo);

	let date;
	if (!data) {
		date = createDateInput(section);

		// 받아와야 하는 정보가 있다면 섹션별로 날짜 부분 따로 만들어주는 함수
	} else {
		if (section === "education" || section === "project") {
			date = createDateInput(section, data.periodStart, data.periodEnd);
		} else if (section === "award") {
			date = createDateInput(section, data.awardDate);
		} else {
			date = createDateInput(section, data.licenseDate);
		}
		sectionInput.setAttribute("formId", data._id);
	}

	// 수정, 삭제, 확인 버튼도 불러와야 하는 데이터가 있으면 수정만 가능하게 설정
	// 불러와야 하는 데이터가 없으면 post할 수 있게 해줌
	const btnContainer = !data
		? createBtns(sectionInput, section)
		: createBtns(sectionInput, section, true);
	sectionInput.appendChild(btnContainer);

	// 학력은 학교명, 전공 및 학위, 날짜 인풋 받음
	// 불러와야 하는 데이타가 있으면 값 전달
	if (section === "education") {
		let schoolName = !data
			? createInput("school-name", "학교명")
			: createInput("school-name", "학교명", true, data.school);
		const major = !data
			? createInput("major", "전공 및 학위 (ex. 경영학과 학사)")
			: createInput(
					"major",
					"전공 및 학위 (ex. 경영학과 학사)",
					true,
					data.major
			  );
		inputInfo.appendChild(schoolName);
		inputInfo.appendChild(major);
		inputInfo.appendChild(date);
		if (data) toggleInputs(inputInfo, true);

		// 프로젝트는 프로젝트명, 링크 (선택), 날짜, 프로젝트 개요 타이틀 (ex. OOO를 하는 서비스입니다),
		// 프로젝트 상세 설명, 스킬태그 값 받음
		// 불러와야 하는 데이타가 있으면 값 전달
	} else if (section === "project") {
		const projName = !data
			? createInput("proj-name", "프로젝트명")
			: createInput("proj-name", "프로젝트명", true, data.contentTitle);

		const link = !data
			? createInput("proj-link", "https://example.com (선택)")
			: createInput("proj-link", "https://example.com (선택)", true, data.link);

		const contentTitle = document.createElement("input");
		contentTitle.placeholder = "프로젝트를 간략하게 요약해주세요";
		contentTitle.name = "name";
		if (data) {
			contentTitle.value = data.name;
		}

		const details = document.createElement("textarea");
		details.placeholder = "프로젝트 상세설명";
		if (data) {
			const textVal = data.contentDetail.join("\n");
			details.textContent = textVal;
		}

		// 사용자가 쓰는 만큼 textarea가 늘어나거나 줄어들게 하는 함수
		details.addEventListener("input", function () {
			details.style.height = "auto";
			details.style.height = `${details.scrollHeight}px`;
		});

		// 스킬 부분에 사용자가 스킬 입력하면 칩 만들어줌
		// ex. react.js 치고 엔터 -> 칩 생성
		const chipset = document.createElement("md-chip-set");
		chipset.className = "chipset";
		const skills = createSkills(chipset);

		// 스킬 부분 데이타가 있으면 불러와주는 함수
		if (data && data.techStack.length !== 0) {
			data.techStack.forEach((s) => {
				const skill = document.createElement("md-input-chip");
				skill.className = "skill";
				skill.label = s;
				chipset.appendChild(skill);
				// callChip();
			});
		}

		inputInfo.appendChild(projName);
		inputInfo.appendChild(link);
		inputInfo.appendChild(date);
		inputInfo.appendChild(contentTitle);
		inputInfo.appendChild(details);
		inputInfo.appendChild(skills);
		inputInfo.appendChild(chipset);
		if (data) toggleInputs(inputInfo, true);

		// 수상이력, 자격증 섹션은 받아야 할 정보가 유사함
		// 날짜, 수상명, 발급 기관만 받으면 됨
		// 불러와야 할 정보가 있으면 정보 불러오기
	} else {
		inputInfo.appendChild(date);

		const details = document.createElement("div");
		details.className = `details ${section}`;

		const placeholder = section === "award" ? "수상명" : "자격명";
		const name = !data
			? createInput("name", placeholder)
			: createInput("name", placeholder, true, data.name);
		details.appendChild(name);

		const institution = !data
			? createInput("institution-name", "발급 기관")
			: createInput("institution-name", "발급 기관", true, data.agency);
		details.appendChild(institution);

		inputInfo.appendChild(details);
		if (data) toggleInputs(inputInfo, true);
	}

	sectionContainer.appendChild(sectionInput);

	sectionInput.addEventListener("submit", (event) =>
		handleSubmit(event, sectionInput, btnContainer, section)
	);
	return sectionContainer;
};

// 사용자가 입력 정보를 저장할때 필수 항목 체크하고 정보 백엔드로 보내는 함수
async function handleSubmit(event, form, buttons, section) {
	event.preventDefault();
	const params = new URLSearchParams(window.location.search);
	const userId = params.get("userId");

	// 사용자가 폼에 필요한 정보를 다 입력했는지 확인
	// 만약 필수 정보를 작성하지 않았다면 submit 안되게 막음
	if (!form.checkValidity()) {
		alert("모든 필수 입력 필드를 작성해주세요.");
		return;
	}

	// 필요한 정보를 다 입력했으면 submit 버튼을 눌렀을때
	// 확인 버튼을 숨기고 편집 버튼 보여주기
	const [submitBtn, editBtn] = buttons.children;
	editBtn.classList.toggle("hide");
	submitBtn.classList.toggle("hide");
	toggleInputs(form, true);

	// 저장 하려고 하는 해당 폼의 인풋 정보 불러오기
	// 백엔드로 보낼 수 있게 날짜 포멧 가공
	const sectionInput = event.target;
	const dateInputs = {
		startYear: sectionInput.querySelector('input[name="startYear"]'),
		startMonth: sectionInput.querySelector('input[name="startMonth"]'),
		endYear: sectionInput.querySelector('input[name="endYear"]'),
		endMonth: sectionInput.querySelector('input[name="endMonth"]'),
	};
	const formattedDate = getFormattedDate(section, dateInputs);

	let data = null;
	console.log("section:", section);

	// 섹션 별로 보내야 하는 데이터 가공
	if (section === "education") {
		const schoolName = sectionInput.querySelector(
			'input[name="school-name"]'
		).value;
		const major = sectionInput.querySelector('input[name="major"]').value;

		data = {
			school: schoolName,
			major,
			periodStart: formattedDate.split(" - ")[0],
			periodEnd: formattedDate.split(" - ")[1],
		};
		console.log("학력 데이터:", data);
	} else if (section === "certificate") {
		const name = sectionInput.querySelector('input[name="name"]').value;
		const agency = sectionInput.querySelector(
			'input[name="institution-name"]'
		).value;
		data = {
			name,
			agency,
			licenseDate: formattedDate,
		};
		console.log("자격증 데이터:", data);
	} else if (section === "award") {
		const name = sectionInput.querySelector('input[name="name"]').value;
		const agency = sectionInput.querySelector(
			'input[name="institution-name"]'
		).value;
		data = {
			name,
			agency,
			awardDate: formattedDate,
		};
		console.log("수상 데이터:", data);

		// 프로젝트 섹션
	} else {
		const contentTitle = sectionInput.querySelector(
			'input[name="proj-name"]'
		).value;
		const link =
			sectionInput.querySelector('input[name="proj-link"]').value || "";
		const name = sectionInput.querySelector('input[name="name"]').value;
		const contentDetail = sectionInput.querySelector("textarea").value;
		const chipset = sectionInput.querySelector(".chipset");
		const skills = Array.from(chipset.children);
		const techStack = skills.map(function (element) {
			return element.label;
		});

		data = {
			contentDetail,
			contentTitle,
			link,
			name,
			periodStart: formattedDate.split(" - ")[0],
			periodEnd: formattedDate.split(" - ")[1],
			techStack,
		};
		console.log("프로젝트 데이터:", data);
	}

	// 처음 섭밋하는 거면 post로 보내줌
	if (submitBtn.getAttribute("update") == "false") {
		formAPI
			.createNewForm(userId, section, data)
			.then((res) => {
				return formAPI.getFormInfo(userId, section);
			})
			.then((newForm) => {
				// attribute로 폼 아이디 바로 업데이트 해주기
				// 나중에 삭제하거나 편집할때 폼 식별 가능하게 해주는 함수
				const idx = newForm.length - 1;
				console.log("newFormId:", newForm[idx]._id);
				sectionInput.setAttribute("formId", newForm[idx]._id);
			})
			.catch((err) => {
				console.log("err:", err);
			});
		// 포스트 끝나면 이후에는 편집(patch)만 가능
		submitBtn.setAttribute("update", true);

		// 정보 업데이트 하기
	} else {
		// 들고 온 정보에서 폼 아이디 받아서 patch로 보내줌
		let formId = form.getAttribute("formid");
		formAPI.updateForm(section, formId, data).catch((err) => {
			console.log("err:", err);
		});
	}
}

// 엘리먼트 기다려주는 함수
const waitForElement = (selector) => {
	return new Promise((resolve) => {
		const element = document.querySelector(selector);
		if (element) {
			resolve(element);
		} else {
			const observer = new MutationObserver((mutations) => {
				const element = document.querySelector(selector);
				if (element) {
					resolve(element);
					observer.disconnect();
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });
		}
	});
};

// 박스랑 제목, 추가 버튼 그려주는 함수
const createSection = (sectionData) => {
	const section = document.createElement("div");
	section.className = "section";
	section.classList.add(sectionData.className);

	const header = document.createElement("div");
	header.className = "title-bar";

	const title = document.createElement("h3");
	title.innerText = sectionData.title;
	header.appendChild(title);

	const addNewItemBtn = document.createElement("button");
	addNewItemBtn.innerText = "+ 추가";
	addNewItemBtn.addEventListener("click", async () => {
		const newForm = createSectionForm(sectionData.className);
		section.insertBefore(newForm, section.children[1]);
	});
	header.appendChild(addNewItemBtn);
	section.appendChild(header);

	return section;
};

// 각 섹션 업데이트 해주는 함수
const updatePortfolioSections = () => {
	const portfolio = document.querySelector(".resume-content");

	portfolioSection.forEach((section) => {
		const newSection = createSection(section);
		portfolio.appendChild(newSection);
	});
};

//프로필 자기소개 부분 인풋
// 사용자가 입력할때마다 얼마만큼 남았는지 보여주는 함수
// 영어, 한국어, 글자마다 부피가 달라서 여러번 테스트 해보다가 일단 100으로 설정함
let textarea = document.querySelector(".my-card-content textarea");
textarea.addEventListener("input", function () {
	const wordLimit = document.querySelector(".word-limit");
	const currLength = textarea.value.length;
	wordLimit.innerText = `${currLength}/100`;
});

// 스킬 부분 칩 스타일 설정해주는 함수
// shadowroot이 있어서 그 아래 숨겨져 있는 element들 받아와서 바꿔줘야 하는데
// 자꾸 에러가 떠서 일단 안씀
async function callChip() {
	const chip = await waitForElement(".chipset");
	const currIdx = chip.children.length - 1;
	const shadowRoot =
		chip.children[currIdx].shadowRoot.querySelector(".container");
	shadowRoot.removeChild(shadowRoot.querySelector(".outline"));

	const button = chip.children[currIdx].shadowRoot
		.querySelector(".container")
		.querySelectorAll("button");

	const label = button[0].querySelector(".label");
	label.style.color = "#4C4C4C";
	label.style.fontFamily = "jalnan";
	label.style.fontSize = "1.2vw";

	button.forEach((btn, i) => {
		const touch = btn.querySelector(".touch");
		touch.remove();

		if (btn.className.includes("trailing")) {
			const closeBtn = btn.querySelector(".trailing.icon");
			closeBtn.style.height = "1vw";
			closeBtn.style.width = "1vw";
		}
	});
}

// 저음 화면이 로딩할때 저장 된 정보가 있으면 get으로 각 섹션별로 정보 불러오는 함수
async function loadEachSecInfo(section) {
	const params = new URLSearchParams(window.location.search);
	const userId = params.get("userId");

	const sectionContainer = document.querySelector(`.section.${section}`);
	const getSectionInfo = await formAPI.getFormInfo(userId, section);
	console.log(section, getSectionInfo);
	try {
		// 저장된 정보가 있으면 정보 불러와서 화면에 그려줌
		if (getSectionInfo && getSectionInfo.length > 0) {
			getSectionInfo.reverse();
			getSectionInfo.forEach((educationData) => {
				const newEdu = createSectionForm(section, educationData);
				sectionContainer.appendChild(newEdu);
			});

			// 저장된 정보가 없으면 인풋 폼 생성
		} else {
			const sectionForm = createSectionForm(section);
			sectionContainer.appendChild(sectionForm);
		}
	} catch (err) {
		console.log(`${section} 가져오는데 오류`, err);
	}
}

async function loadSections() {
	portfolioSection.forEach(
		async (section) => await loadEachSecInfo(section.className)
	);
}

// 프로필 텍스트 업데이트 해주는 함수
function updateProfileTxt() {
	const params = new URLSearchParams(window.location.search);
	const userId = params.get("userId");
	const profileContainer = document.querySelector(".my-card-content");
	const textBox = profileContainer.querySelector("#profile-text");

	profileContainer.addEventListener("submit", (event) => {
		event.preventDefault();
		const textContent = textBox.value;

		try {
			const update = formAPI.updateProfile(userId, textContent);
		} catch (err) {
			console.log("err", err);
		}
	});
}

// 유저 정보 불러와서 프로필 카드에 보여주는 함수
async function getUserInfo() {
	const params = new URLSearchParams(window.location.search);
	const userId = params.get("userId");

	const BASE_URL = "http://localhost:3000";
	const baseInstance = axios.create({
		baseURL: BASE_URL, // 기본 URL 설정
	});
	const response = await baseInstance.get(`/api/${userId}`);

	// 유저 상세 정보 가져오기
	const { user, education, award, certificate, project } = response.data;
	console.log(user[0]);
	const { email, introduce, name } = user[0];

	const thisPersonsName = document.querySelector(".card-name");
	thisPersonsName.innerText = name;

	const thisPersonEmail = document.querySelector(".card-email");
	thisPersonEmail.innerText = email;

	const thisPersonIntroduction = document.querySelector("#profile-text");
	thisPersonIntroduction.value = introduce;
}

updatePortfolioSections();
loadSections();
updateProfileTxt();
getUserInfo();
