
(function ($) {
    "use strict";

    /******************************************
    =========  Magic Cursor ================
    ***************************************** */
    if ($('.magic-cursor').length > 0) {

        const cursor = document.querySelector('.magic-cursor');
        const hoverTargets = document.querySelectorAll('.hover-target');
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Get the viewport width and height
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const cursorWidth = cursor.offsetWidth / 2;
            const cursorHeight = cursor.offsetHeight / 2;

            // Constrain the cursor within the viewport
            if (mouseX < cursorWidth) mouseX = cursorWidth;
            if (mouseX > windowWidth - cursorWidth) mouseX = windowWidth - cursorWidth;
            if (mouseY < cursorHeight) mouseY = cursorHeight;
            if (mouseY > windowHeight - cursorHeight) mouseY = windowHeight - cursorHeight;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1; // Adjust the 0.1 value to control the smoothness
            cursorY += (mouseY - cursorY) * 0.1;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
            });

            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
            });
        });

    }

    // Sticky header
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        const sectionHeader = document.querySelector(".header-section");
        const navbar = document.querySelector(".navbar");
        const currentScrollY = window.scrollY;

        if (sectionHeader && navbar) {
        const sectionHeaderHeight = sectionHeader.getBoundingClientRect().height;
        // console.log("Section Header Height:", sectionHeaderHeight);
        if (currentScrollY < lastScrollY && currentScrollY > sectionHeaderHeight) {
            navbar.classList.add("sticky-navbar");
            document.body.style.paddingTop = navbar.getBoundingClientRect().height + 'px';
        } else {
            navbar.classList.remove("sticky-navbar");
            document.body.style.paddingTop = 0;
        }
        lastScrollY = currentScrollY;
        }
    });

    //===== FIXED HEADER

    /*--------------------------------------------------------
    /  01. Mobile menu Start
    /--------------------------------------------------------*/

    if ($('.mobileMenu').length > 0) {
        function mobileMenu() {
            $('.mobileMenu li').each(function(index, item){
            let selfThis = (this)
            if ($(item).find('ul').length) {
                $(item).addClass('dropdown-arrow');
            }
            $(item).on('click', function(e) {
                e.stopPropagation();
                if ($(this).hasClass('dropdown-arrow')) {
                $('.mobileMenu li').not(this).find('ul').slideUp(300);
                $(this).children('ul').slideToggle(300);
                if(!$(this).hasClass('openUL')) {
                    $(this).siblings().removeClass('openUL');
                    $(this).addClass('openUL');
                }else {
                    $(this).removeClass('openUL');
                }
                // For nested submenus
                $(this).find('ul li').each(function(index, subItem) {
                    $(subItem).off('click').on('click', function(e) {
                    e.stopPropagation();
                    if ($(subItem).hasClass('dropdown-arrow')) {
                        $(subItem).siblings().find('ul').slideUp(300);
                        $(subItem).children('ul').slideToggle(300);
                        if(!$(this).hasClass('openUL')) {
                        $(this).siblings().removeClass('openUL');
                        $(this).addClass('openUL');
                        }else {
                        $(this).removeClass('openUL');
                        }
                    }
                    });
                });
                }
            });
            });
        }
        mobileMenu();
    }

    /////////////////////////////////////////////////////
    // // 2. Register GSAP
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    // /////////////////////////////////////////////////////

    /////////////////////////////////////////////////////
    // 3. Config GSAP
    gsap.config({
        nullTargetWarn: false,
    });
    // /////////////////////////////////////////////////////

    /*================ Tittle Animation  =====================*/
    let splitTitleLines = gsap.utils.toArray(".sec-title-anim");

    splitTitleLines.forEach(splitTextLine => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: 'top 90%',
          end: 'bottom 60%',
          scrub: false,
          markers: false,
          toggleActions: 'play none none none'
        }
      });

      const itemSplitted = new SplitText(splitTextLine, { type: "words, lines" });
      gsap.set(splitTextLine, { perspective: 400 });
      itemSplitted.split({ type: "lines" })
      tl.from(itemSplitted.lines, { duration: 1, delay: 0.3, opacity: 0, rotationX: -80, force3D: true, transformOrigin: "top center -50", stagger: 0.1 });
    });
    /////////////////////////////////////////////////////
    // 27. Text Animation
    let splitTextLines = gsap.utils.toArray(".text-anim");

    splitTextLines.forEach(splitTextLine => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: 'top 95%',
          duration: 2,
          end: 'bottom 60%',
          scrub: false,
          markers: false,
          toggleActions: 'play none none none'
        }
      });

      const itemSplitted = new SplitText(splitTextLine, { type: "lines" });
      gsap.set(splitTextLine, { perspective: 400 });
      itemSplitted.split({ type: "lines" })
      tl.from(itemSplitted.lines, { duration: 1, delay: 0.5, opacity: 0, rotationX: -80, force3D: true, transformOrigin: "top center -50", stagger: 0.1 });
    });
    /////////////////////////////////////////////////////

    /*================ Testimonial-paralax start  =====================*/
    if ($('.testimonial-paralax').length > 0) {

        const testimonialParalax = document.querySelector('.testimonial-paralax');
        const imgs = document.querySelectorAll('.paralax-img');
    
        testimonialParalax.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY, currentTarget } = e;
            const width = currentTarget.offsetWidth;
            const height = currentTarget.offsetHeight;
    
            const moveX = (offsetX / width) - 0.5;
            const moveY = (offsetY / height) - 0.5;
    
            // Background movement in pixels
            const bgMoveX = moveX * 10; //15px horizontal movement
            const bgMoveY = moveY * 10; // 20px vertical movement
    
            imgs.forEach((img, index) => {
                const depth = (index + 1) * 10; // Adjust the depth factor as needed
                const targetX = moveX * depth;
                const targetY = moveY * depth;
    
                gsap.to(img, {
                    x: targetX,
                    y: targetY,
                    duration: 0.8,  // Smooth transition duration
                    ease: 'power2.out'  // Easing function
                });
            });
        });
    
        testimonialParalax.addEventListener('mouseleave', () => {
            // Reset positions of images smoothly using GSAP
            imgs.forEach((img) => {
                gsap.to(img, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            });
        });
    }
    /*================ Testimonial-paralax End  =====================*/

    /*============== Testimonial Slider ==================*/
    if ($('.testimonial-slider').length > 0) {
        var swiper = new Swiper(".testimonial-slider", {
            speed: 1000,
            spaceBetween: 30,
            loop: true,
            pagination: {
            el: '.testimonial-pagination',
            clickable: true
            }
        });
    };
    if ($('.testimonial-slider-2').length > 0) {
        var swiper2 = new Swiper(".testimonial-slider-2", {
            speed: 1000,
            spaceBetween: 60,
            slidesPerView: 2,
            loop: true,
            pagination: {
                el: '.testimonial-pagination-2',
                clickable: true
            },
            breakpoints: {
                
                320: {
                  slidesPerView: 1,
                  spaceBetween: 40,
                },
                992: {
                  slidesPerView: 2,
                  spaceBetween: 60,
                },
              },

        });
    }
    /*================ End =====================*/
 
    // =============  Dynamic Year ========= 
    if ($('.dynamic-year').length > 0) {
        const yearElement = document.querySelector('.dynamic-year');
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = currentYear;
    }
    // Popup-Video
    $('.popup-video').magnificPopup({
        type: 'iframe'
    });

    // odometer CountDown
    if ($('.odometer').length > 0) {
        $('.odometer').appear(function (e) {
            var odo = $(".odometer");
            odo.each(function () {
            var countNumber = $(this).attr("data-count");
            var odometer = new Odometer({
                el: this,
                value: 0,
                format: '',
                duration: 1000,
            });
            odometer.update(countNumber);
            });
        });
    };

    $(document).ready(function() {
        $('select').niceSelect();
    });

    new WOW().init();

   
    // =================  Back-To-Top =============
    if ($('.progressCounter').length > 0){
        $(".progressCounter").progressScroll();
        $(".progressCounter").on("click", function () {
            $("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        });
        $(document).ready(function() {
        var progressElements = $('.progressScroll');
        $(window).scroll(function() {
            // Check if the scroll position is greater than or equal to 50px
            if ($(this).scrollTop() >= 50) {
                // Add class 'progress-scroll-opacity-1' with smooth fadeIn animation
                progressElements.addClass('progress-scroll-opacity-1');
            } else {
                // Remove class 'progress-scroll-opacity-1' with smooth fadeOut animation
                progressElements.removeClass('progress-scroll-opacity-1');
            }
        });
        });
    }
    // =================  Back-To-Top =============

    if ($('.preloader').length > 0) {

        window.onload = function() {
            const preloader = document.querySelector('.preloader');
            preloader.classList.add('hidden');
        };
    }
    
})(jQuery);



// Hover Menu
document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth > 992) {
      document.querySelectorAll('.hover-menu .dropdown').forEach(function (everyitem) {
        everyitem.addEventListener('mouseover', function (e) {
          let el_link = this.querySelector('a[data-bs-toggle]');
          if (el_link !== null) {
            let nextEl = el_link.nextElementSibling;
            el_link.classList.add('show');
            if (nextEl !== null && this.contains(nextEl)) {
              nextEl.classList.add('show');
            }
          }
        }.bind(everyitem));
        everyitem.addEventListener('mouseleave', function (e) {
          let el_link = this.querySelector('a[data-bs-toggle]');
          if (el_link !== null) {
            let nextEl = el_link.nextElementSibling;
            if (nextEl !== null && this.contains(nextEl)) {
              el_link.classList.remove('show');
              nextEl.classList.remove('show');
            }
          }
        }.bind(everyitem));
      });
    }
    // end if innerWidth
});
  