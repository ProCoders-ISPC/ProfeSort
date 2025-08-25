const swiper = new Swiper('.hero-swiper', {
  loop: true,
  autoplay: {
    delay: 5000, 
    disableOnInteraction: true,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: false
});