<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { computed, onMounted } from 'vue'

const { Layout } = DefaultTheme
const { theme, site } = useData()
const route = useRoute()

// 面包屑
const navLabelMap = {
  'module1': '模块1'
}

function getItemLabel(section, filePath) {
  const sidebar = theme.value?.sidebar || {}
  const items = sidebar[`/${section}/`] || []
  for (const group of items) {
    for (const item of group.items || []) {
      if (item.link === `/${section}/${filePath}` || item.link === `/${section}/`) {
        return item.text
      }
    }
  }
  return filePath
}

const breadcrumbs = computed(() => {
  const path = route.path
  console.log('[Breadcrumb] route.path:', path)
  if (!path || path === '/' || path === '/index.html') {
    console.log('[Breadcrumb] skip: home page')
    return null
  }
  const clean = path.replace(/^\//, '').replace(/\.html$/, '')
  const parts = clean.split('/').filter(Boolean)
  console.log('[Breadcrumb] parts:', parts)
  if (parts.length === 0) return null
  const section = parts[0]
  const file = parts.slice(1).join('/') || 'index'
  const sectionLabel = navLabelMap[section] || section
  const itemLabel = file === 'index' ? '总览' : getItemLabel(section, file)
  console.log('[Breadcrumb] result:', { sectionLabel, itemLabel, sectionLink: `/${section}/` })
  return { sectionLabel, itemLabel, sectionLink: `/${section}/` }
})

onMounted(() => {
  console.log('[MyLayout] mounted, route:', route.path)
  console.log('[MyLayout] theme.sidebar keys:', Object.keys(theme.value?.sidebar || {}))
})
</script>

<template>
  <Layout>
    <!-- 左侧导航顶部：Logo + 系统名称 -->
    <template #sidebar-nav-before>
      <div class="sidebar-logo">
        <span class="sidebar-logo-icon">☕</span>
        <span class="sidebar-logo-text">{{ site.title }}</span>
      </div>
    </template>

    <!-- 地址栏：layout-top + position:fixed -->
    <template #layout-top>
      <div class="breadcrumb-fixed">
        <template v-if="breadcrumbs">{{ breadcrumbs.sectionLabel }} &gt; {{ breadcrumbs.itemLabel }}</template>
        <template v-else>route: {{ route.path }}</template>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.sidebar-logo {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.sidebar-logo-icon {
  font-size: 20px;
  margin-right: 8px;
  flex-shrink: 0;
}
.sidebar-logo-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<!-- 非 scoped：强制定位 -->
<style>
.breadcrumb-fixed {
  position: fixed !important;
  top: var(--vp-nav-height) !important;
  left: var(--vp-sidebar-width) !important;
  right: 0 !important;
  z-index: 9999 !important;
  height: 36px !important;
  line-height: 36px !important;
  padding: 0 24px !important;
  background: #fff !important;
  border-bottom: 1px solid var(--vp-c-divider) !important;
  font-size: 13px !important;
  color: #333 !important;
  display: flex !important;
  align-items: center !important;
}
</style>