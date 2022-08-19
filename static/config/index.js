/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {};

 
  //  http://localhost:8088  

  // https://53r23232p6.goho.co


  // http://localhost:8080/renren-fast


  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://53599s50a3.zicp.vip:31762';

  
  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://localhost:8080/renren-fast';

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
