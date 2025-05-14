const swiper = new Swiper('.hero-swiper', {
  loop: true,
  autoplay: {
    delay: 3000, 
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: false
});