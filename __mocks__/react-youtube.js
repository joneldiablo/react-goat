const React = require('react');
module.exports = ({children}) => React.createElement('iframe', {src: 'https://youtube.com'}, children);
module.exports.default = module.exports;
