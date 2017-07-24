
$(function() {
  // 初始化
  pageModule.initData();
  pageModule.checkLogin();
  pageModule.setWidth();
  pageModule.setHeader();
  pageModule.setSidebar();
  pageModule.setBreadcrumb();
});

$(window).resize(function() {
  pageModule.setWidth();
});

$(window).scroll(function() {
  pageModule.setScrollToTop();
});

/**
 * init page when page load
 */
var pageModule = (function(mod) {

  mod.initData = function() {

  };

  mod.checkLogin = function() {
    if (!window.sessionStorage.user) {
      window.location.href = 'index.html';
    }
  };

  mod.setHeader = function() {
    $('#logoutBtn').on('click', pageModule.logout);
  };

  mod.logout = function() {
    window.sessionStorage.clear();
    window.location.href = 'index.html';
  };

  mod.setWidth = function() {
    if ($(window).width() < 768) {
      $('.sidebar').css({ left: -220 });
      $('.all').css({ marginLeft: 0 });
    } else {
      $('.sidebar').css({ left: 0 });
      $('.all').css({ marginLeft: 220 });
    }
  };

  mod.setScrollToTop = function() {
    var top = $(window).scrollTop();
    if(top < 60) {
      $('#goTop').hide();
    } else {
      $('#goTop').show();
    }
  };

  mod.setSidebar = function() {
    $('[data-target="sidebar"]').click(function() {
      var asideleft = $('.sidebar').offset().left;
      if (asideleft == 0) {
        $('.sidebar').animate({ left: -220 });
        $('.all').animate({ marginLeft: 0 });
      } else {
        $('.sidebar').animate({ left: 0 });
        $('.all').animate({ marginLeft: 220 });
      }
    });

    $('.has-sub>a').click(function() {
//    $(this).parent().siblings().find('.sub-menu').slideUp();
      $(this).parent().find('.sub-menu:first').slideToggle();

      var flagEle = $(this).find('i');
      if (flagEle.hasClass('fa-caret-right')) {
        flagEle.removeClass('fa-caret-right');
        flagEle.addClass('fa-caret-down');
      } else {
        flagEle.removeClass('fa-caret-down');
        flagEle.addClass('fa-caret-right');
      }
    });

    $('.sidebar .sub-menu li:not(.has-sub) a[href]').on('click', function() {
      if ($(this).parent().hasClass('active')) return;

      if ($(this).parents('.sub-menu').is(':hidden')) {
//      $(this).parents('.sub-menu').slideDown();
        $(this).parents('.has-sub').find('a:first').trigger('click');
      }

      $('.sidebar li').removeClass('active');
      $(this).parents('.has-sub').addClass('active');
      $(this).parent().addClass('active');

      var breadcrumb = '';
      $(this).parents('.has-sub').each(function(index, element) {
        breadcrumb = '<li>' + $(element).find('a:first span').text().trim() + '</li>' + breadcrumb;
      });
      $('.breadcrumb').html(breadcrumb);

      var page = $(this).attr('href').substr(1);
      mod.loadPage(page, $(this).text().trim());
    });

    var _currenturl = window.location.href.toLowerCase();
    var _isFirstPage = true;
    $('.navbar-nav a[href], .sidebar a[href]').each(function() {
      var href = $(this).attr('href').toLowerCase();
      var isActive = false;
      $('.breadcrumb>li a[href]').each(function(index) {
        if(href == $(this).attr('href').toLowerCase()) {
          isActive = true;
          return false;
        }
      });

      if (_currenturl.indexOf(href) > -1 || isActive) {
        _isFirstPage = false;
        $(this).trigger('click');
      }
    });

    if (_isFirstPage) {
      $('.nav>li:not(.display) .sub-menu li:not(.has-sub):first a:first').trigger('click');
    }

    window.addEventListener('popstate', function(event) {
      var currentHash = location.hash;
      if (currentHash) {
        $('.sidebar .sub-menu li a[href="' + currentHash + '"]').trigger('click');
      }
    });
  };

  mod.setBreadcrumb = function () {
    $('.breadcrumb').on('click', 'li>a', function(){
      var li = $(this).parent();
      var page = li.data('page');
      if (page) {
        var removeable = false;
        $('.breadcrumb li').each(function(index, element) {
          if ($(element).data('page') == page) {
            $(element).addClass('active');
            $(element).html($(element).text());
            removeable = true;
          } else if (removeable) {
            $(element).remove();
          }
        });

        mod.loadPage(page);
      }
    });
  };

  /**
   * 内容页加载
   * @param {String} pageName 页面名称 (不带后缀html,可带目录名如'campus-manage/classroom-manage'，必填)
   * @param {String} title 页面显示标题（用于路径导航，可选）
   * @param {Object} query 参数传递（页面取值使用pageModule.query，可选）
   */
  mod.loadPage = function (pageName, title, query) {
    if (typeof pageDispose === 'function') {
      pageDispose();
      pageDispose = null;
    }

    if (title) {
      var lastLi = $('.breadcrumb').find('li:last');
      lastLi.removeClass('active');
      var pageUrl = lastLi.data('page');
      var pageTitle = lastLi.text();
      if (pageUrl) {
        lastLi.html('<a href="#">' + pageTitle + '</a>');
      }

      $('.breadcrumb').append('<li class="active" data-page="' + pageName + '">' + title + '</li>');
    }

    mod.query = query || {};

    $('.subpage').load('html/' + pageName + '.html' + ' #content', function (responseTxt, statusTxt, xhr) {
      if (statusTxt == 'success') {
        $result = $(responseTxt);
        $result.find('script').appendTo('#content');
      } else if (statusTxt == 'error') {
        console.log('jQuery Load Page Error: ' + xhr.status + ': ' + xhr.statusText);
      }
    });
  };

  return mod;
})(window.pageModule || {});
