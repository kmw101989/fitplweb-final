/* FitPl dataLayer patch – 20251031_0204
 * 목적: 최소 이벤트(user_type_set, page_view, product_click, add_to_cart 등) 자동 푸시
 * 사용: <script src="/path/fitpl_datalayer_patch_20251031_0204.js"></script> 로 로드
 */

(function(){ 
  const qs = new URLSearchParams(location.search);
  const isAd = qs.get('utm_source') === 'instagram';
  window.dataLayer = window.dataLayer || [];
  const USER_TYPE = isAd ? 'Ad_User' : 'Peer_User';

  // 1) user_type_set
  window.dataLayer.push({ event:'user_type_set', user_type: USER_TYPE });

  // 2) page_view helper
  window.fitplPushPageView = function(page_type){
    window.dataLayer.push({ event:'page_view', page_type, user_type: USER_TYPE });
  };

  // 3) recommendation_view helper
  window.fitplPushRecommendationView = function(ctx){
    window.dataLayer.push(Object.assign({
      event:'recommendation_view',
      user_type: USER_TYPE
    }, ctx || {}));
  };

  // 4) delegated product_click + add_to_cart
  document.addEventListener('click', function(e){
    const addBtn = e.target.closest('.add-to-cart-btn');
    if(addBtn){
      const card = addBtn.closest('.product-card');
      const pid = card && card.dataset.productId;
      window.dataLayer.push({
        event:'add_to_cart',
        product_id: pid || null,
        quantity: 1,
        user_type: USER_TYPE
      });
      return;
    }
    const card = e.target.closest('.product-card');
    if(card){
      window.dataLayer.push({
        event:'product_click',
        product_id: card.dataset.productId || null,
        category: card.dataset.category || null,
        rank: Number(card.dataset.rank || 0),
        list_position: Number(card.dataset.listPosition || 0),
        user_type: USER_TYPE
      });
    }
  });

  // 5) filters (helpers)
  window.fitplLocationSelect = function(country, region){
    window.dataLayer.push({ event:'location_select', country, region, user_type: USER_TYPE });
  };
  window.fitplFilter = function(type, value){
    const map = { climate:'climate_filter', activity:'activity_filter', photo:'photo_filter' };
    const ev = map[type] || 'filter_select';
    const payload = { event: ev, user_type: USER_TYPE };
    if(type==='climate') payload.climate_tag = value;
    if(type==='activity') payload.activity_tag = value;
    if(type==='photo') payload.photo_tag = value;
    window.dataLayer.push(payload);
  };

  // 6) cart view helper
  window.fitplCartView = function(count){
    window.dataLayer.push({ event:'cart_view', cart_count: Number(count||0), user_type: USER_TYPE });
  };

  // 7) error & exit helpers
  window.addEventListener('error', function(ev){
    window.dataLayer.push({
      event:'load_fail',
      component: (ev && ev.filename) || 'resource',
      error_code: (ev && ev.message) || '',
      user_type: USER_TYPE
    });
  });
  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState === 'hidden'){
      window.dataLayer.push({
        event:'page_exit',
        page_type: (window.__fitpl_page_type||''),
        duration_ms: Date.now() - (window.__fitpl_page_ts||Date.now()),
        user_type: USER_TYPE 
      });
    }
  });
  // track start time for duration
  window.__fitpl_page_ts = Date.now();
})();
