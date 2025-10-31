document.addEventListener("DOMContentLoaded", function () {
  // FitPL entry popup (full behavior same as fitpl-website)
  const entryPopup = document.getElementById("entryPopup");
  const entryPopupClose = document.getElementById("entryPopupClose");
  const appContainer = document.querySelector(".payment-container");
  const countryList = document.getElementById("countryList");
  const prefCategoryList = document.getElementById("prefCategoryList");
  const activityList = document.getElementById("activityList");
  const cityList = document.getElementById("cityList");
  const entryForm = document.getElementById("entryForm");
  const countryError = document.getElementById("countryError");
  const prefCatError = document.getElementById("prefCatError");
  const activityError = document.getElementById("activityError");
  const chipsCountry = document.getElementById("countryChips");
  const chipsCity = document.getElementById("cityChips");
  const chipsPref = document.getElementById("prefCatChips");
  const chipsActivity = document.getElementById("activityChips");

  function showEntryPopup() {
    if (!entryPopup) return;
    entryPopup.classList.add("show");
    document.body.style.overflow = "hidden";
    if (appContainer) {
      appContainer.classList.add("non-interactive");
      appContainer.setAttribute("aria-hidden", "true");
      try { appContainer.setAttribute("inert", ""); } catch (_) {}
    }
  }

  function hideEntryPopup() {
    if (!entryPopup) return;
    entryPopup.classList.remove("show");
    document.body.style.overflow = "auto";
    if (appContainer) {
      appContainer.classList.remove("non-interactive");
      appContainer.removeAttribute("aria-hidden");
      appContainer.removeAttribute("inert");
    }
  }

  if (entryPopupClose) entryPopupClose.addEventListener("click", hideEntryPopup);
  if (entryPopup) {
    entryPopup.addEventListener("click", (e) => { if (e.target === entryPopup) hideEntryPopup(); });
  }

  // show popup only when '여행예정지역' 버튼 클릭
  const regionBtn = document.querySelector('.region-btn[aria-label="여행예정지역"]');
  if (regionBtn) {
    regionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showEntryPopup();
    });
  }

  // Focus trap
  document.addEventListener("keydown", (e) => {
    if (!entryPopup || !entryPopup.classList.contains("show")) return;
    if (e.key !== "Tab") return;
    const focusables = entryPopup.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Toggle header
  const toggleButtons = document.querySelectorAll(".entry-popup .toggle-btn");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const field = btn.closest(".form-field");
      if (!field) return;
      const isCollapsed = field.classList.toggle("collapsed");
      btn.setAttribute("aria-expanded", String(!isCollapsed));
    });
  });

  function collapseField(field) {
    if (!field) return;
    field.classList.add('collapsed');
    const btn = field.querySelector('.toggle-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  // Chips helper
  function renderChips(container, values, onRemove) {
    if (!container) return;
    container.innerHTML = "";
    values.forEach((val) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      const text = document.createElement('span');
      text.textContent = val;
      chip.appendChild(text);
      if (onRemove) {
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', `${val} 제거`);
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => onRemove(val));
        chip.appendChild(closeBtn);
      }
      container.appendChild(chip);
    });
  }

  // Country
  if (countryList) {
    countryList.addEventListener("change", () => {
      if (countryError) countryError.textContent = "";
      const selected = document.querySelector('input[name="country"]:checked');
      renderChips(chipsCountry, selected ? [selected.value] : [], (value) => {
        const input = countryList.querySelector(`input[value="${value}"]`);
        if (input) input.checked = false;
        renderChips(chipsCountry, [], null);
      });
      collapseField(countryList.closest('.form-field'));
    });
  }

  // City
  if (cityList) {
    cityList.addEventListener("change", () => {
      const selected = document.querySelector('input[name="city"]:checked');
      renderChips(chipsCity, selected ? [selected.value] : [], (value) => {
        const input = cityList.querySelector(`input[value="${value}"]`);
        if (input) input.checked = false;
        renderChips(chipsCity, [], null);
      });
      collapseField(cityList.closest('.form-field'));
    });
  }

  // Pref categories
  if (prefCategoryList) {
    prefCategoryList.addEventListener("change", () => {
      if (prefCatError) prefCatError.textContent = "";
      const checked = prefCategoryList.querySelectorAll('input[name="prefCat"]:checked');
      renderChips(chipsPref, Array.from(checked).map((c) => c.value), (value) => {
        const input = prefCategoryList.querySelector(`input[value="${value}"]`);
        if (input) input.checked = false;
        const rest = prefCategoryList.querySelectorAll('input[name="prefCat"]:checked');
        renderChips(chipsPref, Array.from(rest).map((c) => c.value), null);
      });
      collapseField(prefCategoryList.closest('.form-field'));
    });
  }

  // Activities with max 3
  if (activityList) {
    activityList.addEventListener("change", (e) => {
      const checkboxes = activityList.querySelectorAll('input[name="activity"]');
      const checked = Array.from(checkboxes).filter((c) => c.checked);
      if (checked.length > 3) {
        const target = e.target; if (target && target.checked) target.checked = false;
        if (activityError) activityError.textContent = "최대 3개까지 선택 가능합니다.";
      } else {
        if (activityError) activityError.textContent = "";
        renderChips(chipsActivity, checked.map((c) => c.value), (value) => {
          const input = activityList.querySelector(`input[value=\"${value}\"]`);
          if (input) input.checked = false;
          const rest = activityList.querySelectorAll('input[name="activity"]:checked');
          renderChips(chipsActivity, Array.from(rest).map((c) => c.value), null);
        });
        if (checked.length === 3) {
          collapseField(activityList.closest('.form-field'));
        }
      }
    });
  }

  // Submit -> basic validation + close
  if (entryForm) {
    entryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedCountry = document.querySelector('input[name="country"]:checked');
      if (!selectedCountry) {
        if (countryError) countryError.textContent = "여행지역을 1개 선택해 주세요."; return;
      }
      const selectedPrefCats = document.querySelectorAll('input[name="prefCat"]:checked');
      if (!selectedPrefCats.length) {
        if (prefCatError) prefCatError.textContent = "선호 활동 대분류를 최소 1개 선택해 주세요."; return;
      }
      hideEntryPopup();
    });
  }
  // 결제 수단 선택 기능
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const paymentTypeBtns = document.querySelectorAll(".payment-type-btn");

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "other") {
        document.querySelector(".other-payment-details").style.display =
          "block";
      } else {
        document.querySelector(".other-payment-details").style.display = "none";
      }
    });
  });

  // 결제 타입 버튼 클릭 기능
  paymentTypeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      paymentTypeBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // 라디오 버튼 선택 기능
  const benefitRadios = document.querySelectorAll('input[name="benefit"]');
  benefitRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const radioText = this.parentElement.querySelector(".radio-text");
      if (this.checked) {
        radioText.style.color = "#000000";
      } else {
        radioText.style.color = "#cccccc";
      }
    });
  });

  // 쿠폰 선택 기능
  const couponInput = document.querySelector(".coupon-input");
  const couponCloseBtn = document.querySelector(
    ".cart-coupon-section .close-btn"
  );

  if (couponCloseBtn) {
    couponCloseBtn.addEventListener("click", function () {
      couponInput.value = "";
    });
  }

  // 적립금 입력 기능
  const pointsInput = document.querySelector(".points-input");

  if (pointsInput) {
    pointsInput.addEventListener("input", function () {
      const value = this.value.replace(/[^0-9]/g, "");
      if (value) {
        const formattedValue = parseInt(value).toLocaleString();
        this.value = formattedValue;
      }
    });
  }

  // 즉시할인 체크박스 기능
  const hyundaiCheckbox = document.querySelector("#hyundai-card");

  if (hyundaiCheckbox) {
    hyundaiCheckbox.addEventListener("change", function () {
      const discountAmount = document.querySelector(".discount-amount");
      if (this.checked) {
        discountAmount.textContent = "-30,000원";
        discountAmount.style.color = "#245eff";
      } else {
        discountAmount.textContent = "-30,000원";
        discountAmount.style.color = "#000000";
      }
    });
  }

  // 할인 받기 버튼 기능
  const applyDiscountBtn = document.querySelector(".apply-btn");

  if (applyDiscountBtn) {
    applyDiscountBtn.addEventListener("click", function () {
      const discountItem = document.querySelector(
        ".hyundai-discount .discount-item .discount-amount"
      );
      if (discountItem.textContent === "-1,470원") {
        discountItem.textContent = "적용됨";
        discountItem.style.color = "#245eff";
        this.textContent = "취소";
        this.style.backgroundColor = "#f5f5f5";
        this.style.color = "#666666";
      } else {
        discountItem.textContent = "-1,470원";
        discountItem.style.color = "#245eff";
        this.textContent = "할인 받기";
        this.style.backgroundColor = "#ffffff";
        this.style.color = "#000000";
      }
    });
  }

  // 카드 정보 입력 기능
  const cardInputs = document.querySelectorAll(".card-input");
  const cardCloseBtns = document.querySelectorAll(
    ".card-input-group .close-btn"
  );

  cardCloseBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      cardInputs[index].value = "";
    });
  });

  // 결제하기 버튼 기능
  const paymentBtn = document.querySelector(".payment-btn");

  if (paymentBtn) {
    paymentBtn.addEventListener("click", function () {
      const selectedPayment = document.querySelector(
        'input[name="payment"]:checked'
      );
      const totalAmount = "29,400원";

      if (selectedPayment) {
        alert(
          `선택된 결제 수단: ${selectedPayment.value}\n결제 금액: ${totalAmount}\n결제를 진행하시겠습니까?`
        );
      } else {
        alert("결제 수단을 선택해주세요.");
      }
    });
  }

  // 계속 쇼핑하기 버튼 기능
  const continueShoppingBtn = document.querySelector(".continue-shopping-btn");

  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", function () {
      // Detailpage로 이동
      window.location.href = "../Detailpage/index.html";
    });
  }

  // 쿠폰 사용 버튼 기능 (토글 기능)
  const couponBtn = document.querySelector(".coupon-btn");

  if (couponBtn) {
    couponBtn.addEventListener("click", function () {
      const originalPriceElement = document.querySelector(".original-price");
      const salePriceElement = document.querySelector(".sale-price");
      const totalPriceElement = document.querySelector(".total-price");

      if (originalPriceElement) {
        // 쿠폰이 이미 적용된 상태인지 확인
        const isApplied = this.textContent === "쿠폰 적용됨";

        if (isApplied) {
          // 쿠폰 적용 해제 - 원래 상태로 복원
          // original-price는 그대로 유지 (색상 변경 없음)

          // 버튼 텍스트 변경
          this.textContent = "FitPl 런칭 기념 20% 쿠폰 적용";
          this.style.backgroundColor = "";
          this.style.color = "";

          // sale-price를 원래 상태로 복원
          if (salePriceElement) {
            salePriceElement.textContent = "29,400원";
            salePriceElement.style.color = "";
          }

          // total-price도 원래 상태로 복원
          if (totalPriceElement) {
            totalPriceElement.textContent = "29,400원";
            totalPriceElement.style.color = "";
          }

          console.log("FitPl 런칭 기념 20% 쿠폰이 해제되었습니다.");
        } else {
          // 쿠폰 적용
          const currentPriceText = originalPriceElement.textContent;
          const currentPrice = parseInt(
            currentPriceText.replace(/[^0-9]/g, "")
          );

          // 20% 할인된 가격 계산
          const discountedPrice = Math.round(currentPrice * 0.8);
          const formattedDiscountedPrice = discountedPrice.toLocaleString();

          // original-price는 그대로 두고 색상도 변경하지 않음

          // 버튼 텍스트 변경
          this.textContent = "쿠폰 적용됨";
          this.style.backgroundColor = "#245eff";
          this.style.color = "#ffffff";

          // sale-price에 할인된 가격 표시 (취소선 없음)
          if (salePriceElement) {
            salePriceElement.textContent = `${formattedDiscountedPrice}원`;
            salePriceElement.style.color = "#245eff";
          }

          // total-price에도 할인된 가격 표시
          if (totalPriceElement) {
            totalPriceElement.textContent = `${formattedDiscountedPrice}원`;
            totalPriceElement.style.color = "#245eff";
          }

          console.log(
            `FitPl 런칭 기념 20% 쿠폰이 적용되었습니다. 할인된 가격: ${formattedDiscountedPrice}원`
          );
        }
      }
    });
  }

  // 배송지 변경 버튼
  const changeAddressBtn = document.querySelector(".change-address-btn");

  if (changeAddressBtn) {
    changeAddressBtn.addEventListener("click", function () {
      alert("배송지 변경 페이지로 이동합니다.");
    });
  }

  // 내 계좌 등록하기 버튼
  const registerBtn = document.querySelector(".register-btn");

  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      alert("무신사머니 계좌 등록 페이지로 이동합니다.");
    });
  }

  // 자세히 버튼들
  const detailBtns = document.querySelectorAll(".detail-btn");

  detailBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      alert("자세한 내용을 확인합니다.");
    });
  });

  // 더보기 버튼
  const moreBtn = document.querySelector(".more-btn");

  if (moreBtn) {
    moreBtn.addEventListener("click", function () {
      alert("더 많은 결제 혜택을 확인합니다.");
    });
  }

  // 정보 버튼들
  const infoBtns = document.querySelectorAll(".info-btn");

  infoBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      alert("상세 정보를 확인합니다.");
    });
  });

  // 네비게이션 링크들
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // FITPL 링크인 경우 fitpl-website로 이동
      if (this.textContent.trim() === "FITPL") {
        window.location.href = "../fitpl-website/index.html";
      } else {
        alert(`${this.textContent} 페이지로 이동합니다.`);
      }
    });
  });

  // 상단 메뉴 버튼들
  const topMenuBtns = document.querySelectorAll(
    ".search-btn, .like-link, .my-link, .cart-link, .store-link"
  );

  topMenuBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const text = this.querySelector("span").textContent;
      alert(`${text} 페이지로 이동합니다.`);
    });
  });

  // 로그인 버튼
  const loginBtn = document.querySelector(".login-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      alert("로그인 페이지로 이동합니다.");
    });
  }

  // SNAP 링크
  const snapLink = document.querySelector(".snap-link");

  if (snapLink) {
    snapLink.addEventListener("click", function (e) {
      e.preventDefault();
      alert("SNAP 페이지로 이동합니다.");
    });
  }

  // 카테고리 메뉴 버튼
  const categoryMenuBtn = document.querySelector(".category-menu-btn");

  if (categoryMenuBtn) {
    categoryMenuBtn.addEventListener("click", function () {
      alert("카테고리 메뉴를 엽니다.");
    });
  }

  // FITPL 버튼 (기존 logout-btn)
  const fitplBtn = document.querySelector(".logout-btn");

  if (fitplBtn) {
    fitplBtn.addEventListener("click", function () {
      // fitpl-website로 이동
      window.location.href = "../fitpl-website/index.html";
    });
  }

  // 초기화: 기본 선택된 라디오 버튼 스타일 적용
  const checkedBenefitRadio = document.querySelector(
    'input[name="benefit"]:checked'
  );
  if (checkedBenefitRadio) {
    const radioText =
      checkedBenefitRadio.parentElement.querySelector(".radio-text");
    radioText.style.color = "#000000";
  }

  // 초기화: 기본 선택된 결제 수단
  const checkedPaymentRadio = document.querySelector(
    'input[name="payment"]:checked'
  );
  if (checkedPaymentRadio && checkedPaymentRadio.value === "other") {
    document.querySelector(".other-payment-details").style.display = "block";
  }

  console.log("결제 페이지 JavaScript 로드 완료");
});
