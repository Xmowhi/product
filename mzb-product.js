window.toEng=function(s){return s?s.replace(/[\u06f0-\u06f9]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[^0-9.]/g,""):"0"};
function showCustomToast(message,type='info'){document.querySelectorAll('.custom-toast').forEach(t=>t.remove());const toast=document.createElement('div');toast.className=`custom-toast ${type}`;toast.innerText=message;document.body.appendChild(toast);setTimeout(()=>{toast.classList.add('show')},100);setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),500)},4000)}
function updateStockDisplay(){const inventoryEl=document.getElementById('inventory-data');const stockDisplayEl=document.getElementById('stock-display');if(inventoryEl&&stockDisplayEl){const stockValue=window.toEng(inventoryEl.innerText).trim();if(stockValue&&!isNaN(stockValue)&&parseInt(stockValue)>0){stockDisplayEl.innerHTML=`✓ ${parseInt(stockValue).toLocaleString('fa-IR')} عدد در انبار`}else{stockDisplayEl.innerHTML='✓ موجود'}}}
window.product_plus=function(e,el){e.preventDefault();e.stopPropagation();const input=el.closest('.mz-qty-box').querySelector('input[name="product_number"]');const currentValue=parseInt(input.value||0);const inventoryEl=document.getElementById('inventory-data');let maxStock=999;if(inventoryEl){const stockValue=window.toEng(inventoryEl.innerText.trim());if(stockValue&&!isNaN(stockValue)){maxStock=parseInt(stockValue)}else{maxStock=0}}if(currentValue<maxStock){input.value=currentValue+1}else{showCustomToast(`حداکثر موجودی این محصول ${maxStock.toLocaleString('fa-IR')} عدد است.`,'error')}};
window.product_minus=function(e,el){e.preventDefault();e.stopPropagation();const input=el.closest('.mz-qty-box').querySelector('input[name="product_number"]');const currentValue=parseInt(input.value||0);if(currentValue>1){input.value=currentValue-1}};
window.closeCartModal=function(){document.getElementById('mz-cart-modal').style.display='none';document.body.classList.remove('mz-modal-open')};
window.scrollToComments=function(){const section=document.getElementById('comments-section');const form=document.getElementById('comment-form-target');if(section){section.open=true;setTimeout(()=>{form.scrollIntoView({behavior:'smooth',block:'center'})},100)}};
window.shareProduct=async function(){const title=document.querySelector('h1.mz-title')?.innerText||document.title;const url=window.location.href;if(navigator.share){try{await navigator.share({title:title,text:`این محصول رو ببین: ${title}`,url:url})}catch(err){}}else{try{await navigator.clipboard.writeText(url);showCustomToast('لینک محصول کپی شد!')}catch(err){showCustomToast('خطا در کپی کردن لینک.','error')}}};

// سیستم زوم پیشرفته
var zImg=document.getElementById('z-img'),zS=1,zX=0,zY=0,iDist=0,iScale=1,sX=0,sY=0,lx=0,ly=0,lSc=0;
function upT(){if(zImg) zImg.style.transform='translate('+zX+'px,'+zY+'px) scale('+zS+')'}
window.openZoom=function(s){lSc=window.scrollY;document.body.classList.add('mz-zoom-open');const v=document.getElementById('mz-zoom-view');zImg.src=s;if(window.productImages&&window.productImages.length){window.currentZoomIndex=window.productImages.indexOf(s);if(window.currentZoomIndex===-1)window.currentZoomIndex=0}v.style.display='flex';setTimeout(()=>v.classList.add('active'),10);document.body.classList.add('mz-modal-open');zS=1;zX=0;zY=0;upT()};
window.closeZoom=function(){document.body.classList.remove('mz-zoom-open');const v=document.getElementById('mz-zoom-view');v.classList.remove('active');setTimeout(()=>{v.style.display='none';document.body.classList.remove('mz-modal-open');window.scrollTo(0,lSc)},300)};
window.changeZoom=function(dir){if(!window.productImages||window.productImages.length===0)return;window.currentZoomIndex+=dir;if(window.currentZoomIndex>=window.productImages.length)window.currentZoomIndex=0;if(window.currentZoomIndex<0)window.currentZoomIndex=window.productImages.length-1;zImg.src=window.productImages[window.currentZoomIndex];if(window.mzSwiper)window.mzSwiper.slideToLoop(window.currentZoomIndex);zS=1;zX=0;zY=0;upT()};
if(zImg){
    zImg.addEventListener('touchstart',function(e){if(e.touches.length===2){e.preventDefault();iDist=Math.hypot(e.touches[0].pageX-e.touches[1].pageX,e.touches[0].pageY-e.touches[1].pageY);iScale=zS}else if(e.touches.length===1){sX=e.touches[0].pageX;sY=e.touches[0].pageY;lx=zX;ly=zY}},{passive:false});
    zImg.addEventListener('touchmove',function(e){e.preventDefault();if(e.touches.length===2){var dist=Math.hypot(e.touches[0].pageX-e.touches[1].pageX,e.touches[0].pageY-e.touches[1].pageY);zS=Math.max(1,Math.min(5,iScale*(dist/iDist)));upT()}else if(e.touches.length===1&&zS>1){zX=lx+(e.touches[0].pageX-sX);zY=ly+(e.touches[0].pageY-sY);upT()}},{passive:false});
    var lt=0; zImg.addEventListener('touchend',function(e){var ct=new Date().getTime();var tl=ct-lt;if(tl<300&&tl>0){e.preventDefault();if(zS===1){zS=2.5}else{zS=1;zX=0;zY=0}upT()}lt=ct;if(zS<1.1){zS=1;zX=0;zY=0;upT()}if(e.changedTouches.length===1&&zS===1){var dx=e.changedTouches[0].pageX-sX;if(Math.abs(dx)>60){changeZoom(dx>0?1:-1)}}});
}

// توابع jQuery و OnReady
jQuery(document).ready(function($){
    updateStockDisplay();
    $('#mz-share-btn').on('click',shareProduct);
    const btt=document.getElementById('mz-btt');
    window.addEventListener('scroll',()=>{if(btt) btt.style.display=window.scrollY>300?'flex':'none'});
    
    // سبد خرید
    $(document).on('click','#mz_add_btn',function(e){
        e.preventDefault();
        const btn=$(this);
        if(btn.hasClass('disabled')||btn.is(':disabled'))return false;
        const btnOriginalText=btn.text();
        const container=$('#add-to-cart-form');
        let missing=false;
        $('.mz-var-select').each(function(){if(!$(this).val()||$(this).val()==='0')missing=true});
        if(missing){const element=$('.mz-var-group').first()[0];if(element){const offset=element.getBoundingClientRect().top+window.scrollY-120;window.scrollTo({top:offset,behavior:'smooth'})}showCustomToast('لطفاً ویژگی‌های محصول را انتخاب کنید.','error');return}
        
        // استخراج اطلاعات برای GTAG
        const d_id = container.attr('data-action') ? container.attr('data-action').split('/').pop() : '0';
        const d_title = $('h1.mz-title').text().trim();
        const d_price = parseInt(window.toEng($('.mz-p-now').text() || "0")) * 10;
        
        const data=container.find(':input').serialize();
        const dynamicUrl=container.attr('data-action');
        $.ajax({
            url:dynamicUrl,type:'POST',data:data,
            beforeSend:function(){$('#mz_add_btn').prop('disabled',true).html('<div class="btn-spinner"></div>')},
            success:function(response){
                if(typeof gtag === 'function'){gtag('event','add_to_cart',{currency:'IRR',value:d_price,items:[{item_id:d_id,item_name:d_title,price:d_price,quantity:$('input[name="product_number"]').val()}]});}
                $('#mz_add_btn').prop('disabled',false).text(btnOriginalText);
                $('#mz-cart-modal').css('display','flex');
                $('body').addClass('mz-modal-open');
                $('#mz-success-content').html(`<div class="mz-success-msg"><span class="mz-success-icon">✔</span><span class="mz-success-title">به سبد خرید اضافه شد</span><span class="mz-success-text"> می‌توانید سفارش خود را نهایی کنید یا به خرید ادامه دهید.</span><div class="mz-btn-row"><a href="/cart" class="mz-btn-action mz-btn-pay">مشاهده سبد و تسویه</a><button onclick="closeCartModal()" class="mz-btn-action mz-btn-cont">ادامه خرید</button></div></div>`);
                if(typeof update_mini_cart==='function')update_mini_cart()
            },
            error:function(xhr){$('#mz_add_btn').prop('disabled',false).text(btnOriginalText);showCustomToast('خطا در سرور','error')}
        })
    });
    
    // فرم اطلاع رسانی
    $(document).on('click','#mz_notify_btn',function(e){if($(this).hasClass('mz-notified'))return;$('#mz-notify-form-container').slideToggle()});
    $(document).on('click','#mz_notify_submit',function(e){
        e.preventDefault();
        const btn=$(this), input=$('#mz_notify_input'), contact=input.val().trim(), productTitle=$('h1.mz-title').text().trim();
        const scriptURL='https://script.google.com/macros/s/AKfycbzlQXU_36HFtXHES7VKHcxYU4DLqREQXjZkszAdto-FnkCg7Caoo-RqjsNRFxCBK2kK/exec';
        if(!/^09\d{9}$/.test(contact)){showCustomToast('لطفا شماره موبایل معتبر وارد کنید (مثلا 09123456789)','error');return}
        if(!productTitle){showCustomToast('خطا: عنوان محصول یافت نشد.','error');return}
        const originalBtnText=btn.html();
        btn.prop('disabled',true).html('<div class="btn-spinner"></div>');
        fetch(scriptURL,{method:'POST',mode:'no-cors',cache:'no-cache',headers:{'Content-Type':'application/json'},body:JSON.stringify({productTitle:productTitle,contact:contact})}).then(()=>{showCustomToast('درخواست شما ثبت شد! به محض موجودی اطلاع می‌دهیم.','info');$('#mz-notify-form-container').slideUp();$('#mz_notify_btn').text('درخواست ثبت شد ✔').addClass('mz-notified').prop('disabled',true)}).catch(error=>{showCustomToast('خطا در ارسال. لطفا دوباره تلاش کنید.','error');btn.prop('disabled',false).html(originalBtnText)})
    });
    
    // راه اندازی Swiper
    if(typeof Swiper!=='undefined'){
        const th=new Swiper('.swiper-thumbs',{spaceBetween:8,slidesPerView:4,freeMode:true,observer:true,observeParents:true,on:{click:function(s,e){if(document.body.classList.contains('mz-modal-open')){const clickedIndex=s.clickedIndex;if(clickedIndex!==undefined&&window.productImages[clickedIndex]){document.getElementById('z-img').src=window.productImages[clickedIndex];window.currentZoomIndex=clickedIndex}}}}});
        window.mzSwiper=new Swiper('.swiper-main',{loop:true,navigation:{nextEl:'.mz-next',prevEl:'.mz-prev'},thumbs:{swiper:th},zoom:{maxRatio:3},observer:true,observeParents:true})
    }
    
    // بخش نظرات
    var cForm=$("#comment-form-target");
    cForm.find('input[type="text"]').length>0&&cForm.replaceWith('<div style="padding:15px;background:#f0f0f0;border:1px solid var(--g-border);border-radius:12px;margin-top:20px;text-align:center;font-size:13px;color:var(--g-text);">🔒 برای ثبت نظر، لطفاً <a href="/login" style="color:var(--g-blue);font-weight:bold;">وارد حساب کاربری</a> خود شوید.</div>');
    
    // اصلاح فیلد ایمیل
    setTimeout(function(){var emailInput=$('input[name="email"], input[type="email"]');if(emailInput.length){emailInput.removeAttr('required');var currentPh=emailInput.attr('placeholder')||'ایمیل';if(currentPh.indexOf('اختیاری')===-1){emailInput.attr('placeholder',currentPh+'(اختیاری)')}}},1000);
});

// توابع هنگام لود کامل (شامل تولید اسکیما، Gtag و URL)
window.addEventListener('load',function(){
    // متا تگ تصویر OG
    const firstImg = document.querySelector('.mz-slide-img')?.src;
    if(firstImg){
        let t = firstImg.replace("http:","https:");
        let m = document.querySelector('meta[property="og:image"]');
        if(!m){m = document.createElement("meta"); m.setAttribute("property","og:image"); document.head.appendChild(m);} m.setAttribute("content",t);
        let n = document.querySelector('meta[name="twitter:image"]');
        if(!n){n = document.createElement("meta"); n.setAttribute("name","twitter:image"); document.head.appendChild(n);} n.setAttribute("content",t);
    }

    const ldr=document.querySelector('.mz-gal-ldr');if(ldr){ldr.style.opacity='0';setTimeout(()=>ldr.remove(),300)}
    
    const d_id = document.getElementById('add-to-cart-form')?.getAttribute('data-action')?.split('/').pop() || '0';
    const d_title = document.querySelector('h1.mz-title')?.innerText || document.title;
    const d_price = parseInt(window.toEng(document.querySelector('.mz-p-now')?.innerText || "0")) * 10;
    if(typeof gtag === 'function'){gtag('event','view_item',{currency:'IRR',value:d_price,items:[{item_id:d_id,item_name:d_title,price:d_price}]});}
    
    window.productImages=[];
    document.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .mz-slide-img').forEach(function(img){window.productImages.push(img.src)});
    window.currentZoomIndex=0;
    
    // تولید اسکیما
    function generateSlug(text){if(!text)return"";return text.toLowerCase().replace(/[\s\u00A0\u200C\_.+\/]+/g,"-").replace(/[^a-z0-9\-\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]+/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"")}
    const pEl=document.querySelector('.mz-p-now');
    if(pEl){
        const titleRaw=d_title;
        let fuD="";const fullDescHeader=document.querySelector(".mz-accordion-container h3");if(fullDescHeader&&fullDescHeader.nextElementSibling){fuD=fullDescHeader.nextElementSibling.textContent.trim()}
        const img=firstImg;
        const isAvailable=document.querySelector('.mz-tag-ok')!==null;
        const pageTitleSlug=generateSlug(titleRaw);
        const currentUrl=window.location.origin+window.location.pathname+'-'+pageTitleSlug;
        let graphData={"@context":"https://schema.org","@graph":[{"@type":"Product","name":titleRaw,"description":fuD,"image":img,"url":currentUrl,"sku":d_id,"mpn":d_id,"brand":{"@type":"Brand","name":"MozheBazar"},"offers":{"@type":"AggregateOffer","priceCurrency":"IRR","lowPrice":d_price,"highPrice":d_price,"offerCount":"1","availability":isAvailable?"https://schema.org/InStock":"https://schema.org/OutOfStock","url":currentUrl,"priceValidUntil":new Date(new Date().getFullYear(),11,31).toISOString().split('T')[0],"valueAddedTaxIncluded":false,"seller":{"@type":"Organization","name":"مژه بازار","url":"https://mozhebazar.com/"},"hasMerchantReturnPolicy":{"@type":"MerchantReturnPolicy","returnFees":"https://schema.org/FreeReturn","merchantReturnLink":currentUrl,"description":"مرجوعی بی قید و شرط و بدون کمیسیون"},"shippingDetails":{"@type":"OfferShippingDetails","shippingLabel":"ارسال با پست، تیپاکس، چاپار","shippingDestination":{"@type":"DefinedRegion","addressCountry":"IR"}}}},{"@type":"LocalBusiness","name":"مژه بازار","url":"https://mozhebazar.com","image":img,"telephone":"09393695678","email":"info@mozhebazar.com","priceRange":"$$","vatID":"411111111111","address":{"@type":"PostalAddress","streetAddress":"بازار تهران","addressLocality":"تهران","addressRegion":"تهران","postalCode":"1457915947","addressCountry":"IR"},"openingHoursSpecification":{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"00:00","closes":"23:59"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"فروشگاه","item":window.location.origin},{"@type":"ListItem","position":2,"name":titleRaw,"item":currentUrl}]}]};
        
        const rateResult=document.querySelector('.mz-rate-result');
        if(rateResult){const rateText=window.toEng(rateResult.textContent);const matches=rateText.match(/(\d+(\.\d+)?)/g);if(matches&&matches.length>=2){let totalScore=parseFloat(matches[0]);let count=parseInt(matches[1]);if(count>0){let avg=totalScore/count;graphData["@graph"][0].aggregateRating={"@type":"AggregateRating","ratingValue":avg.toFixed(1),"reviewCount":count}}}}
        const comments=document.querySelectorAll('.mz-comment-item');if(comments.length>0){graphData["@graph"][0].review=[];comments.forEach(c=>{const author=c.querySelector('.mz-c-author')?.textContent.trim()||"کاربر";const body=c.querySelector('.mz-c-body')?.textContent.trim();if(body){graphData["@graph"][0].review.push({"@type":"Review","author":{"@type":"Person","name":author},"reviewBody":body})}})}
        const related=document.querySelectorAll('.mz-rel-card');if(related.length>0){graphData["@graph"][0].isRelatedTo=[];related.forEach(rel=>{const rName=rel.querySelector('.mz-rel-name')?.textContent.trim();const rImg=rel.querySelector('.mz-rel-img')?.src;const rPrice=parseInt(window.toEng(rel.querySelector('.rel-p-v')?.innerText||"0"))*10;const rSlug=generateSlug(rName);const rUrl=rel.getAttribute("href")+"-"+rSlug;graphData["@graph"][0].isRelatedTo.push({"@type":"Product","name":rName,"image":rImg,"url":rUrl,"offers":{"@type":"Offer","priceCurrency":"IRR","price":rPrice}});});};
        
        const s=document.createElement('script');s.type='application/ld+json';s.text=JSON.stringify(graphData);document.head.appendChild(s);
    }
    
    // ویدیو اسکیما
    document.querySelectorAll(".auto-video-schema").forEach(e=>{const t=e.dataset.videoSrc;if(!t)return;const a=document.querySelector("h1")?.textContent.trim()||document.title,o=document.querySelector('meta[name="description"]')?.content||"",n=document.querySelector(".mz-slide-img")?.src||"https://mozhebazar.com/shop/pic/product/mozhebazar/207_4.png",i={name:a,description:o,thumbnailUrl:n,uploadDate:(new Date).toISOString(),contentUrl:t,publisher:{"@type":"Organization",name:"MozheBazar",logo:{"@type":"ImageObject",url:"https://mozhebazar.com/shop/pic/product/mozhebazar/207_4.png"}}};e.innerHTML=`<div style="max-width:800px;margin:auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);"><video controls playsinline preload="metadata" poster="${n}" data-lazy-src="${t}" style="width:100%;display:block;background-color:#000;"></video></div>`;const c=e.querySelector("video");if(c){const s=new IntersectionObserver((e,t)=>{e.forEach(e=>{if(e.isIntersecting){const a=e.target,o=document.createElement("source");o.src=a.dataset.lazySrc,o.type="video/mp4",a.appendChild(o),a.load(),t.unobserve(a)}})},{rootMargin:"200px"});s.observe(c)}const d={"@context":"https://schema.org","@type":"VideoObject",...i},l=document.createElement("script");l.type="application/ld+json",l.text=JSON.stringify(d),document.head.appendChild(l)});

    // آپدیت لینک کنونیکال
    if(window.location.pathname.startsWith("/product/")){const urlParts=window.location.pathname.split("/");const productId=urlParts[2]?urlParts[2].split("-")[0]:null;if(productId&&!isNaN(productId)){let rawTitle="";const metaTitle=document.querySelector('meta[name="title"]');const h1=document.querySelector("h1");if(metaTitle&&metaTitle.content&&!metaTitle.content.includes("[")){rawTitle=metaTitle.content.trim()}else if(h1){rawTitle=h1.textContent.trim()}else{rawTitle=document.title.split("+")[0].trim()}if(rawTitle){const cleanSlug=rawTitle.toLowerCase().replace(/[\s\u00A0\u200C\_.+\/]+/g,"-").replace(/[^a-z0-9\-\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]+/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"");const newPart=`${productId}-${cleanSlug}`;const currentPathDecoded=decodeURIComponent(window.location.pathname);if(!currentPathDecoded.includes(cleanSlug)){const newUrl=`/product/${newPart}`;history.replaceState(null,rawTitle,newUrl);const canonicalLink=document.getElementById("canonical-link");if(canonicalLink){canonicalLink.href=window.location.origin+newUrl}}}}}
    
    // اصلاح لینک محصولات مرتبط
    document.querySelectorAll("a.related-product-link").forEach(e=>{const t=function(){const t=e.querySelector(".mz-rel-name"),n=t?t.textContent.trim():e.dataset.title;if(n){const t=n.toLowerCase().replace(/[\s\u00A0\u200C\_.+\/]+/g,"-").replace(/[^a-z0-9\-\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]+/g,"").replace(/-+/g,"-").replace(/^-|-$/g,""),o=e.getAttribute("href");o&&!o.includes(t)&&(e.href=`${o}-${t}`)}};e.addEventListener("mousedown",t),e.addEventListener("touchstart",t)});

    // اصلاح اسکیما FAQ
    try{var q=document.querySelectorAll('[itemtype*="schema.org/Question"]');for(var r=0;r<q.length;r++){var t=q[r];if(!t.querySelector('[itemprop="name"]')){var o=t.querySelector("summary");if(o){var m=o.innerHTML;o.innerHTML='<strong itemprop="name">'+m+"</strong>"}}}}catch(e){}
});

document.addEventListener("click",function(e){var t=e.target.closest("a");if(t&&t.href.indexOf("/login")>-1){localStorage.setItem("rb_back_url",window.location.href)}});