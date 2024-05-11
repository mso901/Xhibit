import { deleteForm } from "./apiService.js";
// 수정 버튼 누를때만 수정이 가능하게 만들도록 제어하는 함수
export function toggleInputs(form, disable) {
	const inputs = form.querySelectorAll("input");
	inputs.forEach((input) => (input.disabled = disable));
	const textareas = form.querySelectorAll("textarea");
	textareas.forEach((input) => (input.disabled = disable));
}

// 버튼들 만들어 주는 함수
export function createBtns(givenForm, section, edit = false) {
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
		const modal = new bootstrap.Modal(document.getElementById("deleteForm"));
		modal.show();

		// 사용자가 확인하면 해당 폼 삭제
		const confirmButton = modal._element.querySelector(".btn-primary");
		confirmButton.addEventListener(
			"click",
			() => {
				const form = deleteBtn.closest(".portfolio-section");
				const formId = givenForm.getAttribute("formid");
				form.remove();
				deleteForm(section, formId)
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
}

// 인풋 타입 만들어주는 함수
export function createInput(
	name,
	placeholder,
	isSaved = false,
	value = null,
	maxLength = 100,
	isDate = false
) {
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
}

// 날짜 부분 인풋만들어주는 함수
export function createDateInput(section, startDate = null, endDate = null) {
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
export function createSkills(chipset) {
	const skills = createInput("skills", "스킬 태그를 추가하고 엔터를 쳐주세요");

	// 스킬 인풋에 테크 스택 입력하고 엔터 누르면 칩 생성
	skills.addEventListener("keypress", async function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			const skill = document.createElement("md-input-chip");
			skill.className = "skill";
			skill.label = event.target.value;

			chipset.appendChild(skill);
			event.target.value = "";
		}
	});

	return skills;
}

// 엘리먼트 기다려주는 함수
export function waitForElement(selector) {
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
}

// 스킬 부분 칩 스타일 설정해주는 함수
// shadowroot이 있어서 그 아래 숨겨져 있는 element들 받아와서 바꿔줘야 하는데
// 자꾸 에러가 떠서 일단 안씀
export async function callChip() {
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

	button.forEach((btn) => {
		const touch = btn.querySelector(".touch");
		touch.remove();

		if (btn.className.includes("trailing")) {
			const closeBtn = btn.querySelector(".trailing.icon");
			closeBtn.style.height = "1vw";
			closeBtn.style.width = "1vw";
		}
	});
}

// 보안성 높이기위한 패스워드 체크
export function isStrongPassword(str) {
	return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
		str
	);
}

// 패스워드 재확인
export function passwordsMatch(password1, password2) {
	return password1 === password2;
}
