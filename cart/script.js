const CART_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=750&fit=crop&crop=center";
const DB_ENDPOINT = "/.netlify/functions/db";

const CART_DEMO_PRODUCTS = {
  "4315498": {
    product: {
      product_id: "4315498",
      brand: "rrr",
      main_category: "outerwear",
      sub_category: "cardigan",
      product_name: "에브리데이 라운드 니트 가디건 [블랙]",
      product_name_local: "에브리데이 라운드 니트 가디건 [블랙]",
      description: "Please refer to the detailed page",
      summary: "Please refer to the detailed page",
      composition: "50% rayon, 22% nylon, 28% PBT",
      price: 20000,
      original_price: 45000,
      discount_rate: 56,
      style_code: "L24FWCD01301",
      product_url: "https://www.musinsa.com/products/4315498",
      rating: 4.8,
      review_count: 423,
      reward_points: 3000,
      season: "2024 FW",
      tags: "#에브리데이스타일",
      img_url:
        "https://image.msscdn.net/thumbnails/images/goods_img/20240809/4315498/4315498_17399364629633_500.jpg",
      visibility: "public",
      coupon_rate: 0.2,
      monthly_views: 35000,
    },
    images: [
      "https://image.msscdn.net/thumbnails/images/goods_img/20240809/4315498/4315498_17399364629633_500.jpg",
    ],
  },
};

function formatCurrency(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("ko-KR");
}

function sanitizeNumber(text) {
  if (typeof text !== "string") return 0;
  const digits = text.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}

function getDemoProduct(productId) {
  const demo = CART_DEMO_PRODUCTS[productId];
  if (!demo) return null;
  return {
    ok: true,
    product: { ...demo.product },
    images: Array.isArray(demo.images) ? [...demo.images] : [],
    related: [],
    source: demo.product.__source || "demo",
  };
}

function getStoredCartItem() {
  try {
    const raw = localStorage.getItem("fitpl_cart_item");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("[Cart] stored cart item parse failed:", error);
    return null;
  }
}

function storeCartItem(payload) {
  try {
    localStorage.setItem("fitpl_cart_item", JSON.stringify(payload));
  } catch (error) {
    console.warn("[Cart] store cart item failed:", error);
  }
}

function getUserFromStorage() {
  try {
    const stored = localStorage.getItem("fitpl_user");
    if (!stored) return null;
    
    const userData = JSON.parse(stored);
    
    // 만료 시간 체크
    if (userData.expires_at) {
      const expiresAt = new Date(userData.expires_at);
      const now = new Date();
      
      if (now > expiresAt) {
        // 만료되었으면 삭제하고 null 반환
        console.log("[Cart] 로컬 스토리지 데이터가 만료되었습니다. 삭제합니다.");
        localStorage.removeItem("fitpl_user");
        return null;
      }
    }
    
    return userData;
  } catch (error) {
    console.warn("[Cart] user storage parse failed:", error);
    localStorage.removeItem("fitpl_user"); // 오류 시 삭제
    return null;
  }
}

function resolveRecommendationContext(params, storedItem, user) {
  if (user?.user_id) {
    const regionFromUser = Number(user.trip_region_id);
    const parsedUserId = Number(user.user_id);
    return {
      mode: "user",
      userId: Number.isFinite(parsedUserId)
        ? parsedUserId
        : String(user.user_id),
      regionId: Number.isFinite(regionFromUser) ? regionFromUser : null,
    };
  }

  const regionParam = params?.get ? params.get("region_id") : null;
  if (regionParam) {
    const parsed = Number(regionParam);
    return {
      mode: "guest",
      userId: null,
      regionId: Number.isFinite(parsed) ? parsed : null,
    };
  }

  const storedRegion = storedItem?.product?.region_id ?? storedItem?.region_id;
  if (storedRegion !== undefined && storedRegion !== null) {
    const parsed = Number(storedRegion);
    return {
      mode: "guest",
      userId: null,
      regionId: Number.isFinite(parsed) ? parsed : null,
    };
  }

  return {
    mode: "guest",
    userId: null,
    regionId: null,
  };
}

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
  const cartOrderTitle = document.getElementById("cart-order-title");
  const orderItemsContainer = document.querySelector(
    ".order-items-container"
  );
  const emptyMessage = document.getElementById("cart-empty-message");
  const productImageEl = document.getElementById("cart-product-image");
  const productBrandEl = document.getElementById("cart-product-brand");
  const productNameEl = document.getElementById("cart-product-name");
  const productSizeEl = document.getElementById("cart-product-size");
  const productOriginalEl = document.getElementById("cart-product-original");
  const productSaleEl = document.getElementById("cart-product-sale");
  const deliveryTextEl = document.getElementById("cart-delivery-text");
  const couponBtn = document.getElementById("cart-coupon-button");
  const summaryProductEl = document.getElementById("cart-summary-product");
  const summaryDiscountEl = document.getElementById(
    "cart-summary-discount"
  );
  const summaryPercentEl = document.getElementById("cart-summary-percent");
  const summaryTotalEl = document.getElementById("cart-summary-total");
  const benefitDetailEl = document.getElementById("cart-benefit-detail");
  const totalBenefitEl = document.getElementById("cart-total-benefit");
  const orderBenefitEl = document.getElementById("cart-order-benefit");
  const paymentBenefitText = document.getElementById("cart-payment-benefit");
  const paymentButton = document.getElementById("cart-payment-button");
  const recoContainer = document.getElementById("cart-reco-container");
  const recoTitle = document.getElementById("cart-reco-title");

  let recoEmptyEl = null;
  let recommendationContext = null;
  let lastRecommendationKey = null;
  let recommendationRequestId = 0;
  const storedUser = getUserFromStorage();

  // 이메일 입력창 자동 채우기
  const emailInput = document.querySelector(".email-input");
  if (emailInput && storedUser?.email) {
    emailInput.value = storedUser.email;
  }

  const cartState = {
    product: null,
    originalPrice: 0,
    salePrice: 0,
    currentPrice: 0,
    couponRate: 0.2,
    couponApplied: false,
    rewardBase: null,
    reward: 0,
    quantity: 1,
  };

  function prepareRecommendationArea() {
    if (!recoContainer) return;
    recoContainer.innerHTML = "";
    recoEmptyEl = document.createElement("div");
    recoEmptyEl.id = "cart-reco-empty";
    recoEmptyEl.className = "cart-reco-empty";
    recoEmptyEl.textContent = "추천 상품을 불러오는 중입니다.";
    recoContainer.appendChild(recoEmptyEl);
    recoContainer.hidden = true;
  }

  function showRecommendationMessage(message, options = {}) {
    if (!recoContainer) return;
    if (!recoEmptyEl) {
      recoEmptyEl = document.createElement("div");
      recoEmptyEl.id = "cart-reco-empty";
      recoEmptyEl.className = "cart-reco-empty";
      recoContainer.appendChild(recoEmptyEl);
    }
    recoEmptyEl.textContent = message;
    recoEmptyEl.hidden = false;
    recoContainer.hidden = options.hideContainer ?? false;
  }

  function buildDetailUrl(product) {
    const params = new URLSearchParams();
    const productId =
      product?.product_id || product?.id || product?.productId || null;
    if (productId) params.set("product_id", productId);
    const source = product?.source || product?.__source;
    if (source) params.set("source", source);
    const regionId = product?.region_id || product?.regionId;
    if (regionId) params.set("region_id", regionId);
    const query = params.toString();
    return `../Detail/navigation.html${query ? `?${query}` : ""}`;
  }

  function createRecommendationCard(product) {
    const card = document.createElement("div");
    card.className = "cart-reco-card";

    const link = document.createElement("a");
    link.className = "cart-reco-link";
    link.href = buildDetailUrl(product);

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "cart-reco-image";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.src =
      product?.img_url ||
      product?.image_url ||
      product?.thumbnail_url ||
      CART_FALLBACK_IMAGE;
    img.alt = product?.product_name || product?.name || "추천 상품";
    imageWrapper.appendChild(img);

    const brandEl = document.createElement("div");
    brandEl.className = "cart-reco-brand";
    brandEl.textContent = product?.brand || "브랜드";

    const nameEl = document.createElement("div");
    nameEl.className = "cart-reco-name";
    nameEl.textContent =
      product?.product_name || product?.name || "상품명을 불러오는 중입니다.";

    const priceEl = document.createElement("div");
    priceEl.className = "cart-reco-price";

    const originalPrice = Number(
      product?.original_price ?? product?.list_price ?? product?.price ?? 0
    );
    const salePrice = Number(product?.price ?? product?.sale_price ?? 0);
    const discountRate = Number(product?.discount_rate ?? product?.sale_rate ?? 0);

    const saleSpan = document.createElement("span");
    saleSpan.className = "cart-reco-price-sale";
    saleSpan.textContent = `${formatCurrency(
      salePrice > 0 ? salePrice : originalPrice
    )}원`;
    priceEl.appendChild(saleSpan);

    if (originalPrice > salePrice && salePrice > 0) {
      const originSpan = document.createElement("span");
      originSpan.className = "cart-reco-price-original";
      originSpan.textContent = `${formatCurrency(originalPrice)}원`;
      priceEl.appendChild(originSpan);
    }

    const effectiveDiscount =
      discountRate || (originalPrice > salePrice && originalPrice > 0
        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
        : 0);
    if (effectiveDiscount > 0) {
      const percentSpan = document.createElement("span");
      percentSpan.className = "cart-reco-price-percent";
      percentSpan.textContent = `${effectiveDiscount}%`;
      priceEl.appendChild(percentSpan);
    }

    link.appendChild(imageWrapper);
    link.appendChild(brandEl);
    link.appendChild(nameEl);
    link.appendChild(priceEl);
    card.appendChild(link);

    return card;
  }

  function renderRecommendedProducts(items) {
    if (!recoContainer) return;
    recoContainer.innerHTML = "";
    recoEmptyEl = null;

    if (!Array.isArray(items) || items.length === 0) {
      showRecommendationMessage("추천 상품을 준비하고 있어요.");
      return;
    }

    items.slice(0, 4).forEach((item) => {
      const card = createRecommendationCard(item);
      recoContainer.appendChild(card);
    });

    if (recoEmptyEl) {
      recoEmptyEl.hidden = true;
    }
    recoContainer.hidden = false;
  }

  async function fetchRecommendationRows(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.rows)) return data.rows;
    if (Array.isArray(data?.data?.rows)) return data.data.rows;
    return [];
  }

  async function loadRecommendedProducts(context, force = false) {
    if (!recoContainer || !context) return;

    const key = `${context.mode}-${context.userId || ""}-${
      context.regionId || ""
    }`;
    if (!force && key === lastRecommendationKey) {
      return;
    }
    lastRecommendationKey = key;

    if (recoTitle) {
      const isUserContext = context.mode === "user" && !!context.userId;
      recoTitle.textContent = isUserContext
        ? "내 여행 맞춤 추천 상품"
        : "맞춤 추천 상품";
    }

    recommendationRequestId += 1;
    const currentRequest = recommendationRequestId;
    showRecommendationMessage("추천 상품을 불러오는 중입니다.", {
      hideContainer: false,
    });

    const buildUrl = (ctx) => {
      const params = new URLSearchParams();
      if (ctx.mode === "user" && ctx.userId) {
        params.set("op", "user_country_activity_top");
        params.set("user_id", ctx.userId);
        if (ctx.regionId) params.set("region_id", ctx.regionId);
      } else {
        params.set("op", "guest_reco_activity");
        if (ctx.regionId) params.set("region_id", ctx.regionId);
      }
      params.set("limit", "4");
      return `${DB_ENDPOINT}?${params.toString()}`;
    };

    try {
      let items = await fetchRecommendationRows(buildUrl(context));
      if (
        (!items || items.length === 0) &&
        context.mode === "user"
      ) {
        const guestContext = {
          mode: "guest",
          userId: null,
          regionId: context.regionId || null,
        };
        items = await fetchRecommendationRows(buildUrl(guestContext));
      }

      if (currentRequest !== recommendationRequestId) return;

      renderRecommendedProducts(items);
    } catch (error) {
      console.error("[Cart] 추천 상품 로드 실패:", error);
      if (currentRequest !== recommendationRequestId) return;
      showRecommendationMessage("추천 상품을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  }

  function updateRecommendationContextFromProduct(product) {
    if (!product) return false;
    if (!recommendationContext) {
      recommendationContext = {
        mode: storedUser?.user_id ? "user" : "guest",
        userId: storedUser?.user_id ? Number(storedUser.user_id) : null,
        regionId: storedUser?.trip_region_id
          ? Number(storedUser.trip_region_id)
          : null,
      };
    }

    if (recommendationContext.mode === "guest") {
      const regionCandidate = Number(product?.region_id);
      if (
        Number.isFinite(regionCandidate) &&
        recommendationContext.regionId !== regionCandidate
      ) {
        recommendationContext = {
          ...recommendationContext,
          regionId: regionCandidate,
        };
        return true;
      }
    }
    return false;
  }

  function triggerRecommendations(force = false) {
    if (!recommendationContext) return;
    loadRecommendedProducts(recommendationContext, force);
  }

  prepareRecommendationArea();

  function showCartError(message) {
    if (cartOrderTitle) cartOrderTitle.textContent = "주문 상품 0개";
    if (orderItemsContainer) orderItemsContainer.style.display = "none";
    if (emptyMessage) {
      emptyMessage.textContent = message;
      emptyMessage.hidden = false;
    }
    if (summaryProductEl) summaryProductEl.textContent = "0원";
    if (summaryDiscountEl) summaryDiscountEl.textContent = "-0원";
    if (summaryPercentEl) summaryPercentEl.textContent = "0%";
    if (summaryTotalEl) summaryTotalEl.textContent = "0원";
    if (paymentButton) paymentButton.textContent = "0원 결제하기";
  }

  function updateSummary() {
    if (!cartState.product) return;

    const baseOriginal = cartState.originalPrice;
    const baseSale = cartState.salePrice;
    const currentPrice = cartState.couponApplied
      ? cartState.currentPrice
      : cartState.salePrice;

    const productOriginalVisible = baseOriginal > baseSale;

    if (productOriginalEl) {
      if (productOriginalVisible) {
        productOriginalEl.textContent = `${formatCurrency(baseOriginal)}원`;
        productOriginalEl.style.display = "block";
      } else {
        productOriginalEl.style.display = "none";
      }
    }

    if (productSaleEl) {
      productSaleEl.textContent = `${formatCurrency(currentPrice)}원`;
    }

    if (summaryProductEl) {
      summaryProductEl.textContent = `${formatCurrency(baseOriginal)}원`;
    }

    const originalForDiscount = baseOriginal || baseSale;
    const totalDiscount = Math.max(0, originalForDiscount - currentPrice);
    if (summaryDiscountEl) {
      summaryDiscountEl.textContent = `-${formatCurrency(totalDiscount)}원`;
    }

    if (summaryPercentEl) {
      if (originalForDiscount > 0 && totalDiscount > 0) {
        const percent = Math.round((totalDiscount / originalForDiscount) * 100);
        summaryPercentEl.textContent = `${percent}%`;
      } else {
        summaryPercentEl.textContent = "0%";
      }
    }

    if (summaryTotalEl) {
      summaryTotalEl.textContent = `${formatCurrency(currentPrice)}원`;
    }

    const rewardAmount = cartState.rewardBase
      ? cartState.rewardBase
      : Math.max(500, Math.round(currentPrice * 0.05));
    cartState.reward = rewardAmount;

    if (benefitDetailEl) {
      benefitDetailEl.textContent = `최대 ${formatCurrency(rewardAmount)}원`;
    }
    if (totalBenefitEl) {
      totalBenefitEl.textContent = `${formatCurrency(rewardAmount)}원`;
    }
    if (orderBenefitEl) {
      orderBenefitEl.textContent = `${formatCurrency(rewardAmount)}원`;
    }
    if (paymentBenefitText) {
      paymentBenefitText.textContent = `최대 ${formatCurrency(
        rewardAmount
      )}원 적립`;
    }
    if (paymentButton) {
      paymentButton.textContent = `${formatCurrency(currentPrice)}원 결제하기`;
    }
  }

  function renderCartProduct(product, images = []) {
    cartState.product = product;

    const originalPrice = Number(
      product?.original_price ?? product?.list_price ?? product?.price ?? 0
    );
    const salePrice = Number(
      product?.price ?? product?.sale_price ?? product?.lowest_price ?? 0
    );

    cartState.originalPrice = originalPrice > 0 ? originalPrice : salePrice;
    cartState.salePrice = salePrice > 0 ? salePrice : cartState.originalPrice;
    cartState.currentPrice = cartState.salePrice;
    cartState.couponApplied = false;

    if (typeof product?.coupon_rate === "number") {
      const rate = product.coupon_rate;
      cartState.couponRate = rate > 1 ? rate / 100 : rate;
    } else {
      cartState.couponRate = 0.2;
    }

    cartState.rewardBase = Number(product?.reward_points) || null;

    if (cartOrderTitle) cartOrderTitle.textContent = "주문 상품 1개";
    if (orderItemsContainer) orderItemsContainer.style.display = "block";
    if (emptyMessage) emptyMessage.hidden = true;

    const imageUrl =
      images?.[0] || product?.img_url || product?.image_url || CART_FALLBACK_IMAGE;
    if (productImageEl) {
      productImageEl.src = imageUrl;
      productImageEl.alt = `${product?.product_name || product?.brand || "상품"}`;
    }

    if (productBrandEl) {
      productBrandEl.textContent = product?.brand || "브랜드";
    }
    if (productNameEl) {
      productNameEl.textContent =
        product?.product_name || product?.name || "상품명을 불러오는 중입니다.";
    }
    if (productSizeEl) {
      productSizeEl.textContent = "FREE / 1개";
    }

    if (deliveryTextEl) {
      deliveryTextEl.textContent =
        "지금 주문하면 빠르게 배송해 드릴게요.";
    }

    if (couponBtn) {
      couponBtn.textContent = "FitPl 런칭 기념 20% 쿠폰 적용";
      couponBtn.style.backgroundColor = "";
      couponBtn.style.color = "";
    }

    updateSummary();

    const productId =
      product?.product_id || product?.id || product?.productId || "";
    if (productId) {
      storeCartItem({
        product_id: productId,
        product: { ...product },
        images: Array.isArray(images) ? [...images] : [],
        region_id: product?.region_id ?? null,
        source: product?.__source || product?.source || null,
      });
    }

    const contextChanged = updateRecommendationContextFromProduct(product);
    triggerRecommendations(contextChanged);
  }

  async function loadCartProduct(productId, source, regionId, userId) {
    let data = null;
    try {
      const params = new URLSearchParams();
      params.set("op", "product_detail");
      params.set("product_id", productId);
      if (source) params.set("source", source);
      if (regionId) params.set("region_id", regionId);
      if (userId) params.set("user_id", userId);

      const requestUrl = `/.netlify/functions/db?${params.toString()}`;
      console.log("[Cart] API 호출 시작:", requestUrl);
      
      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("[Cart] API 응답 상태:", response.status, response.statusText);

      if (response.ok) {
        try {
          data = await response.json();
          console.log("[Cart] API 응답 데이터:", {
            hasProduct: !!data?.product,
            hasImages: !!data?.images,
            productId: data?.product?.product_id,
          });
        } catch (jsonError) {
          console.error("[Cart] JSON 파싱 실패:", jsonError);
          const text = await response.text();
          console.error("[Cart] 응답 본문:", text.substring(0, 500));
        }
      } else {
        const errorText = await response.text().catch(() => "");
        console.error(
          "[Cart] API 호출 실패:",
          {
            status: response.status,
            statusText: response.statusText,
            error: errorText.substring(0, 200),
            url: requestUrl,
          }
        );
      }
    } catch (error) {
      console.error("[Cart] 제품 정보 로드 실패:", {
        error: error.message,
        stack: error.stack,
        name: error.name,
        productId: productId,
      });
      
      // 네트워크 에러인지 확인
      if (error.message.includes("fetch") || error.name === "TypeError") {
        console.error("[Cart] 네트워크 연결 문제로 보입니다. 서버 연결을 확인해주세요.");
      }
    }

    if (!data || !data.product) {
      console.warn("[Cart] API에서 제품 데이터를 가져오지 못함:", {
        hasData: !!data,
        hasProduct: !!data?.product,
        productId: productId,
      });
      
      const demoData = getDemoProduct(productId);
      if (demoData?.product) {
        console.warn("[Cart] demo data fallback 사용", productId);
        renderCartProduct(demoData.product, demoData.images);
        return;
      }
      showCartError("상품 정보를 불러오지 못했습니다. 서버 연결을 확인해주세요.");
      return;
    }

    const product = data.product;
    const images = Array.isArray(data.images)
      ? data.images
          .map((item) => (typeof item === "string" ? item : item?.image_url))
          .filter((url) => typeof url === "string" && url)
      : [];

    renderCartProduct(product, images);
  }

  function initCartProduct() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product_id");
    const source = params.get("source");
    const storedItem = getStoredCartItem();

    recommendationContext = resolveRecommendationContext(
      params,
      storedItem,
      storedUser
    );
    triggerRecommendations(true);

    const regionId = params.get("region_id") || recommendationContext?.regionId;
    const userId = params.get("user_id") || recommendationContext?.userId;

    if (!productId) {
      if (storedItem?.product) {
        renderCartProduct(storedItem.product, storedItem.images);
      } else {
        showCartError("장바구니에 담긴 상품이 없습니다.");
      }
      return;
    }

    if (storedItem?.product) {
      const storedId =
        storedItem.product.product_id ||
        storedItem.product.id ||
        storedItem.product.productId ||
        storedItem.product_id;
      if (String(storedId) === String(productId)) {
        renderCartProduct(storedItem.product, storedItem.images);
      }
    }

    loadCartProduct(productId, source, regionId, userId);
  }

  initCartProduct();

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

  // Contact Modal
  const contactModal = document.getElementById('contactModal');
  const contactModalClose = document.getElementById('contactModalClose');
  const contactForm = document.getElementById('contactForm');
  const contactEmail = document.getElementById('contactEmail');
  const contactMessage = document.getElementById('contactMessage');
  const contactError = document.getElementById('contactError');
  const contactSubmit = document.getElementById('contactSubmit');

  function showContactModal() {
    if (!contactModal) return;
    contactModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    if (appContainer) {
      appContainer.classList.add('non-interactive');
      appContainer.setAttribute('aria-hidden', 'true');
      try { appContainer.setAttribute('inert', ''); } catch (_) {}
    }
    // 이메일 입력창에 포커스
    if (contactEmail) {
      setTimeout(() => contactEmail.focus(), 100);
    }
  }

  function hideContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    if (appContainer) {
      appContainer.classList.remove('non-interactive');
      appContainer.removeAttribute('aria-hidden');
      appContainer.removeAttribute('inert');
    }
    // 폼 리셋
    if (contactForm) {
      contactForm.reset();
      if (contactError) contactError.textContent = '';
    }
  }

  // contact to us 버튼 클릭 이벤트
  const contactBtn = document.querySelector('.region-btn[aria-label="contact to us"]');
  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showContactModal();
    });
  }

  // 모달 닫기 이벤트
  if (contactModalClose) {
    contactModalClose.addEventListener('click', hideContactModal);
  }
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) hideContactModal();
    });
  }

  // 폼 제출 이벤트
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = contactEmail?.value.trim();
      const message = contactMessage?.value.trim();
      
      // 이메일 검증
      if (!email || !email.includes('@')) {
        if (contactError) {
          contactError.textContent = '올바른 이메일 주소를 입력해주세요.';
        }
        if (contactEmail) contactEmail.focus();
        return;
      }

      // 제출 버튼 비활성화
      if (contactSubmit) {
        contactSubmit.disabled = true;
        const btnText = contactSubmit.querySelector('.btn-text');
        const btnLoading = contactSubmit.querySelector('.btn-loading');
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
      }

      // 에러 메시지 초기화
      if (contactError) contactError.textContent = '';

      // product_id 가져오기 (URL 파라미터 또는 cartState에서)
      const params = new URLSearchParams(window.location.search);
      let productId = params.get('product_id');
      
      // URL에 없으면 cartState에서 가져오기
      if (!productId && typeof cartState !== 'undefined' && cartState.product) {
        productId = cartState.product.product_id || 
                   cartState.product.id || 
                   cartState.product.productId || 
                   null;
      }

      try {
        const requestData = {
          email: email,
          message: message || '',
          product_id: productId || null,
          timestamp: new Date().toISOString(),
        };
        
        console.log('[contact] 전송 데이터:', requestData);
        
        const response = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        console.log('[contact] Response status:', response.status);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (jsonError) {
            const errorText = await response.text();
            errorData = { error: errorText };
          }
          console.error('[contact] Response error:', errorData);
          throw new Error(errorData.error || errorData.details || `HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log('[contact] Response success:', result);

        if (result.ok) {
          // 성공 메시지
          alert('문의가 성공적으로 전송되었습니다. 빠르게 연락드리겠습니다.');
          hideContactModal();
        } else {
          throw new Error(result.error || '전송 실패');
        }
      } catch (error) {
        console.error('[contact] 제출 실패:', error);
        let errorMessage = '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        
        // 네트워크 에러인지 확인
        if (error.message && error.message.includes('fetch')) {
          errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
        }
        
        if (contactError) {
          contactError.textContent = errorMessage;
        }
        
        // 디버깅용: 더 자세한 에러 정보를 콘솔에 출력
        if (error.response) {
          console.error('[contact] Response status:', error.response.status);
          error.response.json().then(data => {
            console.error('[contact] Response data:', data);
          }).catch(() => {
            console.error('[contact] Response text:', error.response.text());
          });
        }
      } finally {
        // 제출 버튼 활성화
        if (contactSubmit) {
          contactSubmit.disabled = false;
          const btnText = contactSubmit.querySelector('.btn-text');
          const btnLoading = contactSubmit.querySelector('.btn-loading');
          if (btnText) btnText.style.display = 'inline';
          if (btnLoading) btnLoading.style.display = 'none';
        }
      }
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

  // 국가-도시 매핑
  const countryToCities = {
    일본: ["도쿄", "오사카"],
    중국: ["상하이", "광저우"],
    대만: ["타이베이", "가오슝"],
    태국: ["방콕", "치앙마이"],
    베트남: ["하노이", "다낭"],
    필리핀: ["마닐라", "세부"],
    홍콩: ["홍콩"],
    마카오: ["마카오"],
    인도네시아: ["자카르타", "발리"],
    미국: ["괌", "하와이"],
    싱가포르: ["싱가포르"],
    호주: ["시드니"],
  };

  // 국가 선택 시 해당 국가의 도시만 표시
  function filterCitiesByCountry(countryName) {
    if (!cityList) return;
    
    const cities = countryToCities[countryName] || [];
    const cityItems = cityList.querySelectorAll("li.option-item");
    
    cityItems.forEach((item) => {
      const input = item.querySelector("input");
      const cityName = input?.value;
      
      if (cityName) {
        if (cities.includes(cityName)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
          // 숨겨진 도시의 선택 해제
          if (input && input.checked) {
            input.checked = false;
            renderChips(chipsCity, [], null);
          }
        }
      }
    });
  }
  
  // 초기 로드 시 모든 도시 숨기기 (국가 선택 전까지)
  function hideAllCities() {
    if (!cityList) return;
    const cityItems = cityList.querySelectorAll("li.option-item");
    cityItems.forEach((item) => {
      item.style.display = "none";
    });
  }
  
  // 초기 로드 시 도시 숨기기
  hideAllCities();

  // Country
  if (countryList) {
    countryList.addEventListener("change", () => {
      if (countryError) countryError.textContent = "";
      const selected = document.querySelector('input[name="country"]:checked');
      
      // 국가 선택 시 도시 필터링
      if (selected) {
        filterCitiesByCountry(selected.value);
        // 도시 필드 열기
        const cityField = cityList?.closest(".form-field");
        if (cityField) {
          cityField.classList.remove("collapsed");
        }
      } else {
        // 국가 선택 해제 시 모든 도시 숨기기
        hideAllCities();
      }
      
      renderChips(chipsCountry, selected ? [selected.value] : [], (value) => {
        const input = countryList.querySelector(`input[value="${value}"]`);
        if (input) input.checked = false;
        renderChips(chipsCountry, [], null);
        // 국가 선택 해제 시 모든 도시 숨기기
        hideAllCities();
      });
      collapseField(countryList.closest('.form-field'));
    });
    
    // 이미 선택된 국가가 있는 경우 (예: 페이지 리로드 후)
    const initialSelected = document.querySelector('input[name="country"]:checked');
    if (initialSelected) {
      filterCitiesByCountry(initialSelected.value);
    }
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
        if (countryError) countryError.textContent = "국가를 1개 선택해 주세요."; return;
      }
      
      // 도시 선택 확인 (필수)
      const selectedCity = document.querySelector('input[name="city"]:checked');
      if (!selectedCity) {
        alert("도시를 선택해 주세요.");
        const cityField = cityList?.closest(".form-field");
        if (cityField) {
          cityField.classList.remove("collapsed");
          cityField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
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
  if (paymentButton) {
    paymentButton.addEventListener("click", function () {
      if (!cartState.product) {
        alert("장바구니에 담긴 상품이 없습니다.");
        return;
      }

      const selectedPayment = document.querySelector(
        'input[name="payment"]:checked'
      );
      const totalAmount = `${formatCurrency(cartState.currentPrice)}원`;

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
      let url = "../Detailpage/index.html";
      // utm_source 파라미터 유지
      if (typeof window.preserveUTMParams === 'function') {
        url = window.preserveUTMParams(url);
      }
      window.location.href = url;
    });
  }

  // 쿠폰 사용 버튼 기능 (토글 기능)
  if (couponBtn) {
    couponBtn.addEventListener("click", function () {
      if (!cartState.product) {
        alert("장바구니에 담긴 상품이 없습니다.");
        return;
      }

      if (cartState.couponApplied) {
        cartState.couponApplied = false;
        cartState.currentPrice = cartState.salePrice;
        this.textContent = "FitPl 런칭 기념 20% 쿠폰 적용";
        this.style.backgroundColor = "";
        this.style.color = "";
      } else {
        cartState.couponApplied = true;
        const discounted = Math.max(
          0,
          Math.round(cartState.salePrice * (1 - cartState.couponRate))
        );
        cartState.currentPrice = discounted;
        this.textContent = "쿠폰 적용됨";
        this.style.backgroundColor = "#245eff";
        this.style.color = "#ffffff";
      }

      updateSummary();
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
        let url = "../fitpl-website/index.html";
        // utm_source 파라미터 유지
        if (typeof window.preserveUTMParams === 'function') {
          url = window.preserveUTMParams(url);
        }
        window.location.href = url;
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
