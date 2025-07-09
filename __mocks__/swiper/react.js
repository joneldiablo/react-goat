const React = require('react');
module.exports = {
  Swiper: ({children}) => React.createElement('div', {}, children),
  SwiperSlide: ({children}) => React.createElement('div', {className:'swiper-slide'}, children)
};
