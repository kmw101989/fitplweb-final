const PDP_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=750&fit=crop&crop=center";

const CATEGORY_LABELS = {
  top: "상의",
  outer: "아우터",
  pants: "팬츠",
  bottom: "하의",
  dress: "드레스",
  skirt: "스커트",
  shoes: "신발",
  bag: "가방",
  accessory: "액세서리",
  hat: "모자",
  socks: "양말",
  inner: "이너웨어",
};

const GENDER_LABELS = {
  male: "남성",
  men: "남성",
  m: "남성",
  female: "여성",
  women: "여성",
  w: "여성",
  unisex: "공용",
  all: "공용",
  kids: "키즈",
};

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("product_id") ||
    params.get("productId") ||
    params.get("id") ||
    ""
  ).trim();
}

function getProductSourceFromURL() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("source") || "";
  return value.trim();
}

function getRegionIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const region = params.get("region_id");
  if (!region) return "";
  const num = Number(region);
  return Number.isFinite(num) ? String(num) : "";
}

function getUserIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("user_id");
  if (!value) return "";
  const num = Number(value);
  return Number.isFinite(num) ? String(num) : "";
}

function mapCategoryLabel(value) {
  if (!value) return "카테고리";
  const key = String(value).toLowerCase();
  return CATEGORY_LABELS[key] || value;
}

function mapGenderLabel(value) {
  if (!value) return "성별 정보 없음";
  const key = String(value).toLowerCase();
  return GENDER_LABELS[key] || value;
}

function formatCurrency(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("ko-KR");
}

function formatCount(value, unit = "") {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return "정보 없음";
  if (num >= 100000) {
    const formatted = (num / 10000).toFixed(num >= 1000000 ? 1 : 0);
    return `${formatted.replace(/\.0$/, "")}만${unit}`;
  }
  return `${num.toLocaleString("ko-KR")}${unit}`;
}

function createRelatedCardElement(product) {
  const link = document.createElement("a");
  const productId = product?.product_id || product?.id || "";
  link.className = "related-card";
  if (productId) {
    const params = new URLSearchParams();
    params.set("product_id", productId);
    if (product?.__source) params.set("source", product.__source);
    if (product?.region_id) params.set("region_id", product.region_id);
    link.href = `../Detail/navigation.html?${params.toString()}`;
  } else {
    link.href = "../Detail/navigation.html";
  }

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "related-image";
  const img = document.createElement("img");
  const imageUrl = product?.img_url || product?.image_url || PDP_FALLBACK_IMAGE;
  img.src = imageUrl;
  img.alt = product?.product_name || product?.brand || "추천 상품";
  imageWrapper.appendChild(img);

  const info = document.createElement("div");
  info.className = "related-info";

  const brandEl = document.createElement("div");
  brandEl.className = "related-brand";
  brandEl.textContent = product?.brand || "브랜드";

  const nameEl = document.createElement("div");
  nameEl.className = "related-name";
  nameEl.textContent = product?.product_name || product?.name || "상품";

  const priceRow = document.createElement("div");
  priceRow.className = "related-price";

  const priceValue = Number(
    product?.price ?? product?.sale_price ?? product?.lowest_price ?? 0
  );
  const originalPriceValue = Number(product?.original_price ?? 0);
  let discountRate = Number(product?.discount_rate ?? product?.discount ?? 0);

  if (!discountRate && originalPriceValue > priceValue && priceValue > 0) {
    discountRate = Math.round((1 - priceValue / originalPriceValue) * 100);
  }

  if (discountRate > 0) {
    const discountEl = document.createElement("span");
    discountEl.className = "discount";
    discountEl.textContent = `${discountRate}%`;
    priceRow.appendChild(discountEl);
  }

  const priceEl = document.createElement("span");
  priceEl.className = "price";
  priceEl.textContent = `${formatCurrency(priceValue)}원`;
  priceRow.appendChild(priceEl);

  if (originalPriceValue > priceValue && originalPriceValue > 0) {
    const originalEl = document.createElement("span");
    originalEl.className = "original-price";
    originalEl.textContent = `${formatCurrency(originalPriceValue)}원`;
    priceRow.appendChild(originalEl);
  }

  info.appendChild(brandEl);
  info.appendChild(nameEl);
  info.appendChild(priceRow);

  link.appendChild(imageWrapper);
  link.appendChild(info);

  return link;
}

// 이미지 갤러리 기능
document.addEventListener("DOMContentLoaded", function () {
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
    ".search-btn, .like-link, .my-link, .store-link"
  );

  topMenuBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const text = this.querySelector("span").textContent;
      alert(`${text} 페이지로 이동합니다.`);
    });
  });

  // 장바구니 링크 (네비게이션 바)
  const cartLink = document.querySelector(".cart-link");
  if (cartLink) {
    cartLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("네비게이션 장바구니 링크 클릭 - cart 페이지로 이동");
      window.location.href = "../cart/index.html";
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

  const thumbnailsContainer = document.getElementById("product-thumbnails");
  const mainImage = document.querySelector(".main-image");
  const imageCounter = document.querySelector(".image-counter");
  const brandNameEl = document.querySelector(".brand-name");
  const brandBadgeEl = document.querySelector(".brand-badge");
  const brandTagEl = document.querySelector(".brand-tag");
  const productTitleEl = document.querySelector(".product-title");
  const categoryLinkEl = document.querySelector(".category-link");
  const subCategoryLabelEl = document.querySelector(".sub-category span");
  const discountPercentEl = document.querySelector(".discount-percent");
  const ratingSection = document.querySelector(".product-rating");
  const ratingNumberEl = document.querySelector(".rating-number");
  const ratingTextEl = document.querySelector(".rating-text");
  const likeCountEl = document.querySelector(".like-count");
  const couponCheckbox = document.querySelector(".coupon-checkbox");
  const couponTextEl = document.querySelector(".coupon-text");
  const couponAmountEl = document.querySelector(".coupon-amount");
  const salePriceEl = document.querySelector(".sale-price");
  const originalPriceEl = document.querySelector(".original-price");
  const bestPriceEl = document.getElementById("best-price");
  const bestPriceAmountEl = document.getElementById("best-price-amount");
  const rewardHeaderEl = document.querySelector(".reward-header");
  const rewardDetailRow = document.querySelector(".reward-detail");
  const tagsListEl = document.querySelector(".tags-list");
  const productTagsContainer = document.querySelector(".product-tags");
  const productInfoTable = document.querySelector(".product-info-table");
  const relatedSection = document.getElementById("related-products-section");
  const relatedGrid = document.getElementById("related-products-grid");
  const relatedEmpty = document.getElementById("related-products-empty");
  const productDetailContainer = document.querySelector(".product-detail");
  const productSummaryEl = document.getElementById("product-summary");

  let salePriceValue = 0;
  let couponRate = 0.05;
  let couponAmountValue = 0;
  let currentProduct = null;

  function updateInfoRow(field, text) {
    if (!productInfoTable) return;
    const target = productInfoTable.querySelector(
      `.info-value[data-field="${field}"]`
    );
    if (target) {
      target.textContent = text;
    }
  }

  function setMainImage(url, index = 0, total = 0, productName = "") {
    if (mainImage) {
      mainImage.src = url || PDP_FALLBACK_IMAGE;
      mainImage.alt = productName ? `${productName} 이미지` : "상품 이미지";
    }
    if (imageCounter) {
      imageCounter.textContent = total > 1 ? `${index + 1}/${total}` : "";
    }
  }

  function renderThumbnails(imageList = [], productName = "") {
    if (!thumbnailsContainer) return;
    const uniqueUrls = Array.from(
      new Set(imageList.filter((url) => typeof url === "string" && url))
    );

    if (
      currentProduct?.img_url &&
      !uniqueUrls.includes(currentProduct.img_url)
    ) {
      uniqueUrls.unshift(currentProduct.img_url);
    }

    if (uniqueUrls.length <= 1) {
      thumbnailsContainer.innerHTML = "";
      thumbnailsContainer.hidden = true;
      setMainImage(
        uniqueUrls[0] || currentProduct?.img_url || PDP_FALLBACK_IMAGE,
        0,
        uniqueUrls.length,
        productName
      );
      return;
    }

    thumbnailsContainer.hidden = false;
    thumbnailsContainer.innerHTML = "";

    uniqueUrls.forEach((url, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "thumbnail-button";
      if (index === 0) button.classList.add("active");

      const img = document.createElement("img");
      img.src = url;
      img.alt = productName
        ? `${productName} 썸네일 ${index + 1}`
        : `상품 썸네일 ${index + 1}`;
      button.appendChild(img);

      button.addEventListener("click", () => {
        setMainImage(url, index, uniqueUrls.length, productName);
        thumbnailsContainer
          .querySelectorAll(".thumbnail-button")
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });

      thumbnailsContainer.appendChild(button);
    });

    setMainImage(uniqueUrls[0], 0, uniqueUrls.length, productName);
  }

  function renderProductTags(product) {
    if (!tagsListEl) return;
    tagsListEl.innerHTML = "";

    const tags = new Set();
    const mainCategoryLabel = mapCategoryLabel(product?.main_category);
    if (mainCategoryLabel) tags.add(`#${mainCategoryLabel}`);
    if (product?.sub_category) tags.add(`#${product.sub_category}`);
    const genderLabel = mapGenderLabel(product?.gender_en || product?.gender);
    if (genderLabel && genderLabel !== "성별 정보 없음") {
      tags.add(`#${genderLabel}`);
    }
    if (product?.season) tags.add(`#${product.season}`);
    tags.add("#FitPl추천");

    tags.forEach((tag) => {
      const tagItem = document.createElement("div");
      tagItem.className = "tag-item";
      tagItem.textContent = tag;
      tagItem.addEventListener("click", function () {
        console.log("태그 클릭:", tag);
      });
      tagsListEl.appendChild(tagItem);
    });

    if (productTagsContainer) {
      productTagsContainer.hidden = tags.size === 0;
    }
  }

  function renderRelatedProducts(list = []) {
    if (!relatedSection || !relatedGrid) return;
    relatedGrid.innerHTML = "";

    if (!list.length) {
      relatedSection.hidden = true;
      if (relatedEmpty) relatedEmpty.hidden = false;
      return;
    }

    relatedSection.hidden = false;
    if (relatedEmpty) relatedEmpty.hidden = true;

    list.forEach((item) => {
      const card = createRelatedCardElement(item);
      relatedGrid.appendChild(card);
    });
  }

  function showProductError(message) {
    if (productDetailContainer) {
      productDetailContainer.innerHTML = `<div class="product-error">${message}</div>`;
    }
    if (relatedSection) {
      relatedSection.hidden = true;
    }
  }

  function updateBestPrice() {
    if (!bestPriceEl || !couponCheckbox) return;

    if (!couponCheckbox.checked || !salePriceValue) {
      bestPriceEl.style.display = "none";
      if (couponAmountEl) {
        couponAmountEl.textContent = "-";
      }
      return;
    }

    const discountAmount =
      couponAmountValue || Math.round(salePriceValue * couponRate);
    const bestPriceValue = Math.max(0, salePriceValue - discountAmount);

    if (couponAmountEl) {
      couponAmountEl.textContent = `-${formatCurrency(discountAmount)}원`;
    }

    bestPriceAmountEl.textContent = `${formatCurrency(bestPriceValue)}원`;
    bestPriceEl.style.display = "flex";
  }

  async function initProductDetail() {
    const productId = getProductIdFromURL();
    const sourceParam = getProductSourceFromURL();
    const regionParam = getRegionIdFromURL();
    const userParam = getUserIdFromURL();
    if (!productId) {
      showProductError("상품 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set("op", "product_detail");
      params.set("product_id", productId);
      if (sourceParam) params.set("source", sourceParam);
      if (regionParam) params.set("region_id", regionParam);
      if (userParam) params.set("user_id", userParam);

      const requestUrl = `/.netlify/functions/db?${params.toString()}`;

      const response = await fetch(requestUrl);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(
          "[PDP] API 실패:",
          response.status,
          errorText,
          requestUrl
        );
        showProductError("상품 정보를 불러오지 못했습니다.");
        return;
      }

      const data = await response.json();
      const product = data?.product;
      const finalSource =
        product?.__source || data?.source || sourceParam || "";
      currentProduct = product ? { ...product, __source: finalSource } : null;

      if (!product) {
        showProductError("상품 정보를 찾을 수 없습니다.");
        return;
      }

      const imageList = Array.isArray(data?.images)
        ? data.images
            .map((item) => (typeof item === "string" ? item : item?.image_url))
            .filter((url) => typeof url === "string" && url)
        : [];

      populateProductDetail(
        { ...product, __source: finalSource },
        imageList,
        data?.related || []
      );
    } catch (error) {
      console.error("[PDP] detail load error:", error);
      showProductError("상품 정보를 불러오지 못했습니다.");
    }
  }

  function populateProductDetail(product, images, related) {
    const productName = product?.product_name || product?.name || "상품";
    document.title = `${product?.brand || "FITPL"} ${productName} - FITPL`;

    if (brandNameEl) {
      brandNameEl.textContent = product?.brand || "브랜드";
    }
    if (brandTagEl) {
      brandTagEl.textContent = product?.brand ? `(${product.brand})` : "";
      brandTagEl.style.display = product?.brand ? "inline" : "none";
    }
    if (brandBadgeEl) {
      brandBadgeEl.style.display = product?.exclusive ? "inline-flex" : "none";
    }

    if (productTitleEl) {
      productTitleEl.textContent = productName;
    }

    if (categoryLinkEl) {
      categoryLinkEl.textContent = mapCategoryLabel(product?.main_category);
    }
    if (subCategoryLabelEl) {
      subCategoryLabelEl.textContent = product?.sub_category || "";
      subCategoryLabelEl.parentElement.style.display = product?.sub_category
        ? "flex"
        : "none";
    }

    const discountRate = Number(
      product?.discount_rate ?? product?.discount ?? 0
    );
    if (discountPercentEl) {
      if (discountRate > 0) {
        discountPercentEl.textContent = `${Math.round(discountRate)}%`;
        discountPercentEl.style.display = "inline-flex";
      } else {
        discountPercentEl.style.display = "none";
      }
    }

    const priceValue = Number(
      product?.price ?? product?.sale_price ?? product?.lowest_price ?? 0
    );
    salePriceValue = priceValue;

    if (salePriceEl) {
      salePriceEl.textContent = `${formatCurrency(priceValue)}원`;
    }

    let originalPriceValue = Number(product?.original_price ?? 0);
    if (!originalPriceValue && discountRate > 0) {
      originalPriceValue = Math.round(priceValue / (1 - discountRate / 100));
    }

    if (originalPriceEl) {
      if (originalPriceValue > priceValue && originalPriceValue > 0) {
        originalPriceEl.textContent = `${formatCurrency(originalPriceValue)}원`;
        originalPriceEl.style.display = "block";
      } else {
        originalPriceEl.style.display = "none";
      }
    }

    if (product?.coupon_rate !== undefined && product?.coupon_rate !== null) {
      let parsedRate = Number(product.coupon_rate);
      if (Number.isFinite(parsedRate)) {
        if (parsedRate > 1) {
          parsedRate = parsedRate / 100;
        }
        couponRate = Math.max(parsedRate, 0);
      }
    } else {
      couponRate = 0.05;
    }

    if (
      product?.coupon_amount !== undefined &&
      product?.coupon_amount !== null
    ) {
      const parsedAmount = Number(product.coupon_amount);
      if (Number.isFinite(parsedAmount) && parsedAmount > 0) {
        couponAmountValue = parsedAmount;
      }
    }

    if (!couponAmountValue) {
      couponAmountValue = Math.round(Math.max(priceValue * couponRate, 1000));
    }

    if (couponTextEl) {
      const couponName =
        product?.coupon_name || product?.coupon_title || "FitPl 전용 할인";
      couponTextEl.textContent = couponName;
    }

    renderProductTags(product);

    if (productSummaryEl) {
      const summaryText =
        product.description ||
        product.summary ||
        product.short_description ||
        product.long_description ||
        "";

      if (summaryText && summaryText.trim().length > 0) {
        productSummaryEl.textContent = summaryText.trim();
        productSummaryEl.hidden = false;
      } else {
        const fallbackParts = [
          product.composition,
          product.material,
          product.color,
        ]
          .filter((value) => value && String(value).trim().length > 0)
          .map((value) => String(value).trim());

        if (fallbackParts.length) {
          productSummaryEl.textContent = fallbackParts.join(" · ");
          productSummaryEl.hidden = false;
        } else {
          productSummaryEl.hidden = true;
        }
      }
    }

    if (ratingSection) {
      const ratingValue = Number(product?.rating ?? product?.avg_rating ?? 0);
      const reviewCount = Number(
        product?.review_count ?? product?.reviews ?? 0
      );
      if (ratingValue > 0 || reviewCount > 0) {
        if (ratingNumberEl) ratingNumberEl.textContent = ratingValue.toFixed(1);
        if (ratingTextEl)
          ratingTextEl.textContent = `후기 ${formatCount(reviewCount, "개")}`;
        ratingSection.style.display = "flex";
      } else {
        ratingSection.style.display = "none";
      }
    }

    if (likeCountEl) {
      const likeCount = Number(
        product?.favorite_count ?? product?.like_count ?? 0
      );
      likeCountEl.textContent = likeCount ? formatCount(likeCount, "개") : "0";
    }

    const seasonLabel =
      product?.season_year && product?.season
        ? `${product.season_year} ${product.season}`
        : product?.season ||
          product?.season_year ||
          product?.season_code ||
          "시즌 정보 없음";
    const skuValue =
      product?.style_code ||
      product?.product_code ||
      product?.sku ||
      product?.product_no ||
      product?.product_id ||
      "-";
    updateInfoRow("sku", skuValue);
    updateInfoRow(
      "gender",
      mapGenderLabel(product?.gender_en || product?.gender)
    );
    updateInfoRow("season", seasonLabel);
    updateInfoRow(
      "views",
      formatCount(product?.monthly_views ?? product?.views ?? 0, "회")
    );
    updateInfoRow(
      "sales",
      formatCount(
        product?.sales ?? product?.total_sales ?? product?.sales_volume ?? 0,
        "개"
      )
    );

    let rewardAmount = Math.max(500, Math.round(priceValue * 0.02));
    if (product?.reward_points) {
      const parsedReward = Number(product.reward_points);
      if (Number.isFinite(parsedReward) && parsedReward > 0) {
        rewardAmount = parsedReward;
      }
    } else if (product?.reward_amount) {
      const parsedReward = Number(product.reward_amount);
      if (Number.isFinite(parsedReward) && parsedReward > 0) {
        rewardAmount = parsedReward;
      }
    }

    if (rewardHeaderEl) {
      rewardHeaderEl.textContent = `${formatCurrency(rewardAmount)}원 최대적립`;
    }
    if (rewardDetailRow) {
      const detailSpans = rewardDetailRow.querySelectorAll("span");
      if (detailSpans.length >= 2) {
        detailSpans[1].textContent = `${formatCurrency(rewardAmount)}원`;
      }
    }

    renderThumbnails(images, productName);
    renderRelatedProducts(Array.isArray(related) ? related : []);

    updateBestPrice();
  }

  initProductDetail();

  // 썸네일 클릭 이벤트 (동적 생성으로 대체)

  // 줌 버튼 클릭 이벤트
  const zoomButton = document.querySelector(".zoom-button");
  if (zoomButton) {
    zoomButton.addEventListener("click", function () {
      // 실제 구현에서는 모달이나 확대 기능 구현
      alert("이미지 확대 기능이 구현될 예정입니다.");
    });
  }

  // 사이즈 선택 드롭다운
  const sizeDropdown = document.querySelector(".size-dropdown");
  if (sizeDropdown) {
    sizeDropdown.addEventListener("change", function () {
      const selectedSize = this.value;
      if (selectedSize) {
        console.log("선택된 사이즈:", selectedSize);
        // 실제 구현에서는 선택된 사이즈를 상태에 저장
      }
    });
  }

  // 좋아요 버튼
  const likeButton = document.querySelector(".like-button");
  if (likeButton) {
    likeButton.addEventListener("click", function () {
      const heartIcon = this.querySelector("svg path");
      const likeCount = this.querySelector(".like-count");

      if (heartIcon.style.fill === "red") {
        heartIcon.style.fill = "none";
        heartIcon.style.stroke = "currentColor";
        likeCount.textContent = "798";
      } else {
        heartIcon.style.fill = "red";
        heartIcon.style.stroke = "red";
        likeCount.textContent = "799";
      }
    });
  }

  // 장바구니 버튼
  const cartButton = document.querySelector(".cart-button");
  console.log("cart-button 요소 찾기:", cartButton);
  if (cartButton) {
    cartButton.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("장바구니 버튼 클릭 - cart 페이지로 이동");
      window.location.href = "../cart/index.html";
    });
  } else {
    console.log("cart-button 요소를 찾을 수 없습니다!");
  }

  // 네비게이션 장바구니 링크 (새로운 구조)
  const cartNavLinks = document.querySelectorAll(".nav-link");
  console.log("nav-link 요소들:", cartNavLinks.length);
  cartNavLinks.forEach((link, index) => {
    console.log(`nav-link ${index}:`, link.textContent.trim());
    if (link.textContent.includes("장바구니")) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("네비게이션 장바구니 링크 클릭 - cart 페이지로 이동");
        window.location.href = "../cart/index.html";
      });
    }
  });

  // 구매하기 버튼
  const buyButton = document.querySelector(".buy-button");
  if (buyButton) {
    buyButton.addEventListener("click", function () {
      alert("구매 페이지로 이동합니다.");
    });
  }

  // 쿠폰 링크
  const couponLink = document.querySelector(".coupon-link");
  if (couponLink) {
    couponLink.addEventListener("click", function (e) {
      e.preventDefault();
      alert("쿠폰 받기 페이지로 이동합니다.");
    });
  }

  // 최대혜택가 계산 (쿠폰 20% 적용)
  const couponCheckbox = document.querySelector(".coupon-checkbox");
  const bestPriceEl = document.getElementById("best-price");
  const bestPriceAmountEl = document.getElementById("best-price-amount");
  const salePriceEl = document.querySelector(".sale-price");
  const originalPriceEl = document.querySelector(".original-price");

  // 원래 가격 저장 (복원용) - HTML에서 읽어온 원본 가격
  let originalSalePrice = "180,900원"; // HTML의 원본 가격

  function parseCurrency(text) {
    const digits = (text || "").replace(/[^0-9]/g, "");
    return digits ? Number(digits) : 0;
  }

  function formatCurrency(num) {
    return num.toLocaleString("ko-KR");
  }

  function updateBestPrice() {
    if (!salePriceEl || !bestPriceEl || !couponCheckbox) return;

    const originalPrice = parseCurrency(originalSalePrice); // 원본 가격 180,900원

    if (!couponCheckbox.checked) {
      // 쿠폰 체크 해제 시 최대혜택가 숨김
      bestPriceEl.style.display = "none";
      console.log("쿠폰 해제 - 최대혜택가 숨김");
      return;
    }

    // 쿠폰 체크 시 sale-price는 그대로 유지하고 최대혜택가만 표시
    const discounted = Math.round(originalPrice * 0.8); // 180,900 * 0.8 = 144,720

    // 최대혜택가만 업데이트 (sale-price는 변경하지 않음)
    bestPriceAmountEl.textContent = `${formatCurrency(discounted)}원`;
    bestPriceEl.style.display = "flex";

    console.log(
      "쿠폰 적용 - 최대혜택가 표시:",
      `${formatCurrency(discounted)}원`
    );
  }

  if (couponCheckbox) {
    couponCheckbox.addEventListener("change", updateBestPrice);
  }

  // 초기 표시
  updateBestPrice();

  // 메인 탭 네비게이션 (새로 추가)
  const mainTabButtons = document.querySelectorAll(".main-tab-button");
  const infoTabContent = document.querySelector(".lfjQXD");
  const sizeTabContent = document.querySelector(".jdvpEA.size-tab-content");

  mainTabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // 모든 메인 탭에서 active 클래스 제거
      mainTabButtons.forEach((tab) => tab.classList.remove("active"));

      // 클릭된 탭에 active 클래스 추가
      this.classList.add("active");

      // 탭 콘텐츠 표시/숨김 처리
      const tabText = this.querySelector("span").textContent.trim();

      if (tabText === "정보") {
        if (infoTabContent) {
          infoTabContent.style.display = "flex";
          // 정보 탭에서도 사이즈표는 보이도록 유지
          if (sizeTabContent) sizeTabContent.style.display = "flex";
          // 네비게이션바가 보이도록 탭 네비게이션 영역으로 스크롤
          const mainTabNavigation = document.querySelector(
            ".main-tab-navigation"
          );
          if (mainTabNavigation) {
            mainTabNavigation.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            // 탭 네비게이션이 없으면 정보 탭으로 스크롤
            infoTabContent.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      } else if (tabText === "사이즈") {
        console.log("사이즈 탭 클릭됨");
        console.log("sizeTabContent 요소:", sizeTabContent);

        if (sizeTabContent) {
          // 정보 섹션은 유지하고 사이즈표만 보여주기
          if (infoTabContent) infoTabContent.style.display = "flex";
          sizeTabContent.style.display = "flex";

          console.log("사이즈 탭 콘텐츠 표시됨, 스크롤 시작");

          // 약간의 지연 후 스크롤 (DOM 업데이트 후)
          setTimeout(() => {
            sizeTabContent.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            console.log("스크롤 완료");
          }, 100);
        } else {
          console.log("sizeTabContent 요소를 찾을 수 없습니다!");
        }
      }

      console.log("메인 탭 변경:", tabText);
    });
  });

  // 팔로우 버튼
  const followButton = document.querySelector(".follow-button");
  if (followButton) {
    followButton.addEventListener("click", function () {
      const buttonText = this.textContent.trim();
      if (buttonText === "12만") {
        this.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2V14M2 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          13만
        `;
      } else {
        this.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2V14M2 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          12만
        `;
      }
    });
  }

  // 연관 태그 클릭
  const tagItems = document.querySelectorAll(".tag-item");
  tagItems.forEach((tag) => {
    tag.addEventListener("click", function () {
      console.log("태그 클릭:", this.textContent);
      // 실제 구현에서는 해당 태그로 검색 페이지로 이동
    });
  });

  // 결제 혜택 더보기
  const moreBenefits = document.querySelector(".more-benefits");
  if (moreBenefits) {
    moreBenefits.addEventListener("click", function () {
      alert("더 많은 결제 혜택을 확인하세요.");
    });
  }

  // 전체보기 링크
  const viewAll = document.querySelector(".view-all");
  if (viewAll) {
    viewAll.addEventListener("click", function (e) {
      e.preventDefault();
      alert("전체 결제 혜택 페이지로 이동합니다.");
    });
  }
});

// 반응형 네비게이션 (모바일)
function toggleMobileMenu() {
  const navLinks = document.querySelector(".nav-links");
  if (navLinks) {
    navLinks.classList.toggle("mobile-active");
  }
}

// 스크롤 시 네비게이션 고정 효과
window.addEventListener("scroll", function () {
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    if (window.scrollY > 50) {
      topbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
      topbar.style.boxShadow = "none";
    }
  }
});

console.log("Detail 페이지 JavaScript 로드 완료");
