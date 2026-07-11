import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'docs',
  title: "文档",
  description: "系统化的 Java 面试备战指南",

  // 自定义样式
  head: [['style', {}, `
    :root {
      --vp-sidebar-width: 220px;
      --vp-layout-max-width: 100%;
    }

    /* 侧边栏导航项 - 增加边距，避免靠边沿 */
    .VPSidebarItem .item {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    .VPSidebarItem .items {
      padding-left: 16px !important;
    }

    /* 分组标题 */
    .VPSidebarItem.level-0 > .item > .text {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    /* 内容区 */
    .VPDoc { padding: 0 !important; margin: 0 !important; }
    .VPDoc .container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
    .VPDoc .content { padding: 24px 48px !important; max-width: 100% !important; }
    .VPDoc .content-container { padding-top: 36px !important; }

    /* 右侧本页导航 — 可拖拽调整宽度 */
    .VPDoc .aside {
      max-width: var(--aside-width, 256px) !important;
    }
    .VPDoc .aside-container {
      width: calc(var(--aside-width, 256px) - 32px) !important;
    }
    .VPDoc .aside-curtain {
      width: calc(var(--aside-width, 256px) - 32px) !important;
    }
    .VPDocOutlineItem .outline-link {
      white-space: normal !important;
      word-break: break-all;
      line-height: 1.5 !important;
      padding: 3px 0 !important;
    }
    .VPDocOutlineItem .outline-marker { margin-top: 4px !important; }

    /* 拖拽手柄 — 对齐 padding-left 的视觉边界 */
    .aside-resize-handle {
      position: absolute;
      left: 32px;
      top: 0;
      bottom: 0;
      width: 10px;
      cursor: col-resize;
      z-index: 9999;
      background: transparent;
      transition: background 0.15s;
    }
    .aside-resize-handle:hover,
    .aside-resize-handle.active {
      background: rgba(100, 108, 255, 0.4);
    }
  `],
  ['script', {}, `
    (function() {
      var overlay = null;
      var scale = 1;
      var minScale = 0.3;
      var maxScale = 5;
      // 拖拽平移
      var panX = 0, panY = 0;
      var isDragging = false;
      var startX = 0, startY = 0;
      var lastPanX = 0, lastPanY = 0;

      function createOverlay() {
        if (overlay) return;
        overlay = document.createElement('div');
        overlay.className = 'img-zoom-overlay';
        overlay.innerHTML = '<div class="img-zoom-wrap"><img /></div>' +
          '<div class="img-zoom-toolbar">' +
            '<button class="img-zoom-btn" title="放大">+</button>' +
            '<button class="img-zoom-btn" title="缩小">-</button>' +
            '<button class="img-zoom-btn" title="1:1">1:1</button>' +
            '<button class="img-zoom-btn" title="适应屏幕">适应</button>' +
            '<button class="img-zoom-btn img-zoom-close-btn" title="关闭">&times;</button>' +
          '</div>';

        overlay.addEventListener('click', function(e) {
          if (e.target === overlay) closeZoom();
        });

        var imgEl = overlay.querySelector('img');

        // 拖拽平移
        imgEl.addEventListener('mousedown', function(e) {
          e.stopPropagation();
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          lastPanX = panX;
          lastPanY = panY;
          imgEl.style.cursor = 'grabbing';
          imgEl.style.transition = 'none';
        });

        document.addEventListener('mousemove', function(e) {
          if (!isDragging || !overlay || overlay.style.display !== 'flex') return;
          panX = lastPanX + (e.clientX - startX);
          panY = lastPanY + (e.clientY - startY);
          applyTransform();
        });

        document.addEventListener('mouseup', function() {
          if (isDragging) {
            isDragging = false;
            var imgEl = overlay && overlay.querySelector('img');
            if (imgEl) {
              imgEl.style.cursor = scale === 1 ? 'zoom-in' : 'grab';
              imgEl.style.transition = 'transform 0.2s ease';
            }
          }
        });

        // 工具栏按钮
        overlay.querySelector('.img-zoom-btn:nth-child(1)').addEventListener('click', function(e) {
          e.stopPropagation(); zoomIn();
        });
        overlay.querySelector('.img-zoom-btn:nth-child(2)').addEventListener('click', function(e) {
          e.stopPropagation(); zoomOut();
        });
        overlay.querySelector('.img-zoom-btn:nth-child(3)').addEventListener('click', function(e) {
          e.stopPropagation(); resetZoom();
        });
        overlay.querySelector('.img-zoom-btn:nth-child(4)').addEventListener('click', function(e) {
          e.stopPropagation(); toggleFit();
        });
        overlay.querySelector('.img-zoom-close-btn').addEventListener('click', function(e) {
          e.stopPropagation(); closeZoom();
        });

        // 滚轮缩放
        overlay.addEventListener('wheel', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var delta = e.deltaY > 0 ? -0.2 : 0.2;
          setScale(scale + delta);
        }, { passive: false });

        document.body.appendChild(overlay);
      }

      function applyTransform() {
        var imgEl = overlay.querySelector('img');
        imgEl.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
      }

      function setScale(s) {
        scale = Math.min(maxScale, Math.max(minScale, s));
        var imgEl = overlay.querySelector('img');
        applyTransform();
        imgEl.style.cursor = scale === 1 ? 'zoom-in' : 'grab';
      }

      function zoomIn() { setScale(scale + 0.5); }
      function zoomOut() { setScale(scale - 0.5); }
      function resetZoom() { panX = 0; panY = 0; setScale(1); }

      function toggleFit() {
        var imgEl = overlay.querySelector('img');
        if (scale === 1 && imgEl.style.objectFit === 'contain') {
          imgEl.style.objectFit = 'none';
          imgEl.style.maxWidth = 'none';
          imgEl.style.maxHeight = 'none';
          setScale(1);
        } else {
          imgEl.style.objectFit = 'contain';
          imgEl.style.maxWidth = '90vw';
          imgEl.style.maxHeight = '85vh';
          panX = 0; panY = 0;
          setScale(1);
        }
      }

      function openZoom(src, alt) {
        createOverlay();
        var imgEl = overlay.querySelector('img');
        imgEl.src = src;
        imgEl.alt = alt || '';
        imgEl.style.objectFit = 'contain';
        imgEl.style.maxWidth = '90vw';
        imgEl.style.maxHeight = '85vh';
        panX = 0; panY = 0;
        setScale(1);
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }

      function closeZoom() {
        if (overlay) {
          overlay.style.display = 'none';
          document.body.style.overflow = '';
        }
      }

      document.addEventListener('click', function(e) {
        var target = e.target.closest('img');
        if (!target || !target.src) return;
        if (target.closest('.img-zoom-overlay')) return;
        openZoom(target.src, target.alt || '');
      });

      document.addEventListener('keydown', function(e) {
        if (!overlay || overlay.style.display !== 'flex') return;
        if (e.key === 'Escape') { closeZoom(); return; }
        if (e.key === '+') { zoomIn(); return; }
        if (e.key === '-') { zoomOut(); return; }
        if (e.key === '0') { resetZoom(); return; }
      });

      // 注入样式
      var style = document.createElement('style');
      style.textContent = [
        '.vp-doc img, main img { cursor: zoom-in; }',
        '.img-zoom-overlay {',
        '  display: none;',
        '  position: fixed; inset: 0;',
        '  z-index: 99999;',
        '  background: rgba(0,0,0,0.85);',
        '  align-items: center; justify-content: center;',
        '  cursor: pointer;',
        '  overflow: hidden;',
        '}',
        '.img-zoom-wrap {',
        '  display: flex; align-items: center; justify-content: center;',
        '}',
        '.img-zoom-wrap img {',
        '  max-width: 90vw; max-height: 85vh;',
        '  object-fit: contain;',
        '  border-radius: 4px;',
        '  box-shadow: 0 8px 32px rgba(0,0,0,0.5);',
        '  transition: transform 0.2s ease;',
        '  transform-origin: center center;',
        '}',
        '.img-zoom-toolbar {',
        '  position: fixed; bottom: 24px; left: 50%;',
        '  transform: translateX(-50%);',
        '  display: flex; gap: 8px;',
        '  background: rgba(0,0,0,0.6);',
        '  padding: 8px 12px; border-radius: 8px;',
        '  z-index: 100000;',
        '}',
        '.img-zoom-btn {',
        '  width: 36px; height: 36px;',
        '  border: none; border-radius: 6px;',
        '  background: rgba(255,255,255,0.15);',
        '  color: #fff; font-size: 16px;',
        '  cursor: pointer;',
        '  display: flex; align-items: center; justify-content: center;',
        '  transition: background 0.15s;',
        '}',
        '.img-zoom-btn:hover { background: rgba(255,255,255,0.3); }',
        '.img-zoom-close-btn { font-size: 20px; }'
      ].join('\\n');
      document.head.appendChild(style);
    })();

    // 右侧本页导航拖拽调整宽度
    (function() {
      var minW = 200, maxW = 500;
      var asideW = parseInt(localStorage.getItem('aside-width') || '256');
      var dragging = false;
      var startX = 0, startW = 0;

      function init() {
        var aside = document.querySelector('.VPDoc .aside');
        if (!aside || aside.querySelector('.aside-resize-handle')) return;
        document.documentElement.style.setProperty('--aside-width', asideW + 'px');

        var handle = document.createElement('div');
        handle.className = 'aside-resize-handle';
        aside.appendChild(handle);
      }

      document.addEventListener('mousedown', function(e) {
        var handle = e.target.closest('.aside-resize-handle');
        if (!handle) return;
        e.preventDefault();
        dragging = true;
        startX = e.clientX;
        var aside = handle.parentElement; // .aside
        startW = aside.offsetWidth;
        handle.classList.add('active');
      });

      window.addEventListener('mousemove', function(e) {
        if (!dragging) return;
        var w = startW + (startX - e.clientX);
        asideW = Math.min(maxW, Math.max(minW, w));
        document.documentElement.style.setProperty('--aside-width', asideW + 'px');
      });

      window.addEventListener('mouseup', function() {
        if (!dragging) return;
        dragging = false;
        var handle = document.querySelector('.aside-resize-handle.active');
        if (handle) handle.classList.remove('active');
        localStorage.setItem('aside-width', asideW);
      });

      var observer = new MutationObserver(function() { init(); });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      init();
    })();

    // 左侧边栏拖拽调整宽度
    (function() {
      var minW = 180, maxW = 400;
      var sidebarW = parseInt(localStorage.getItem('sidebar-width') || '220');
      var dragging = false;
      var startX = 0, startW = 0;

      function init() {
        var sidebar = document.querySelector('.VPSidebar');
        if (!sidebar || sidebar.querySelector('.sidebar-resize-handle')) return;
        document.documentElement.style.setProperty('--vp-sidebar-width', sidebarW + 'px');

        var handle = document.createElement('div');
        handle.className = 'sidebar-resize-handle';
        sidebar.appendChild(handle);
      }

      document.addEventListener('mousedown', function(e) {
        var handle = e.target.closest('.sidebar-resize-handle');
        if (!handle) return;
        e.preventDefault();
        dragging = true;
        startX = e.clientX;
        startW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--vp-sidebar-width').trim());
        handle.classList.add('active');
      });

      window.addEventListener('mousemove', function(e) {
        if (!dragging) return;
        var w = startW + (e.clientX - startX);
        sidebarW = Math.min(maxW, Math.max(minW, w));
        document.documentElement.style.setProperty('--vp-sidebar-width', sidebarW + 'px');
      });

      window.addEventListener('mouseup', function() {
        if (!dragging) return;
        dragging = false;
        var handle = document.querySelector('.sidebar-resize-handle.active');
        if (handle) handle.classList.remove('active');
        localStorage.setItem('sidebar-width', sidebarW);
      });

      var observer = new MutationObserver(function() { init(); });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      init();
    })();
  `],
  ['script', {}, `
    (function() {
      var setTitle = function() {
        var btn = document.querySelector('.VPSwitchAppearance');
        if (!btn) return;
        var isDark = document.documentElement.classList.contains('dark');
        btn.setAttribute('title', isDark ? '切换日间模式' : '切换夜间模式');
      };
      setTitle();
      var observer = new MutationObserver(setTitle);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    })();
  `],
  ['script', {}, `
    (function() {
      var bar = document.createElement('div');
      bar.className = 'status-bar';
      bar.innerHTML = '<span>Hi竹子微信公众号技术支持</span><span>v1.0.0 | 2026</span>';
      document.body.appendChild(bar);
    })();
  `]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '模块1', link: '/module1/', activeMatch: '/module1/' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    sidebar: {
      '/module1/': [
        { text: '总览', link: '/module1/' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' },
        { text: '菜单1', link: '/module1/menu1' },
        { text: '菜单2', link: '/module1/menu2' }
      ]
    },

    outline: {
      level: [2, 3],
      label: '本页导航'
    }
    /*
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
      */
  }
})
