<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const { Layout } = DefaultTheme
const { theme, site } = useData()
const route = useRoute()

// 面包屑
const gradeLabelMap = {
  'xiaoban': '小班', 'zhongban': '中班', 'daban': '大班',
  'grade1': '一年级', 'grade2': '二年级', 'grade3': '三年级',
  'grade4': '四年级', 'grade5': '五年级', 'grade6': '六年级',
  'grade7': '初一', 'grade8': '初二', 'grade9': '初三',
  'grade10': '高一', 'grade11': '高二', 'grade12': '高三'
}

function getItemLabel(pathPrefix, filePath) {
  const sidebar = theme.value?.sidebar || {}
  const items = sidebar[pathPrefix] || []
  for (const item of items) {
    if (item.link === filePath || item.link === filePath + '/') {
      return item.text
    }
  }
  return filePath.split('/').pop() || filePath
}

const breadcrumbs = computed(() => {
  const path = decodeURI(route.path)
  if (!path || path === '/' || path === '/index.html') {
    return null
  }
  const clean = path.replace(/^\//, '').replace(/\.html$/, '')
  const parts = clean.split('/').filter(Boolean)
  if (parts.length === 0) return null
  const gradeKey = parts[1] || ''
  const gradeLabel = gradeLabelMap[gradeKey] || gradeKey
  if (parts.length <= 2) {
    return { first: gradeLabel, second: '总览' }
  }
  const pathPrefix = `/${parts[0]}/${parts[1]}/`
  const fullPath = `/${clean}`
  const itemLabel = getItemLabel(pathPrefix, fullPath)
  return { first: gradeLabel, second: itemLabel }
})
</script>

<template>
  <Layout>
    <template #layout-top>
      <div class="breadcrumb-fixed">
        <template v-if="breadcrumbs">{{ breadcrumbs.first }} &gt; {{ breadcrumbs.second }}</template>
        <template v-else>{{ site.title }}</template>
      </div>
    </template>
  </Layout>
</template>

<style>
.breadcrumb-fixed {
  position: fixed !important;
  top: var(--vp-nav-height) !important;
  left: var(--vp-sidebar-width) !important;
  right: 0 !important;
  z-index: 9 !important;
  height: 36px !important;
  line-height: 36px !important;
  padding: 0 24px !important;
  background: var(--vp-c-bg-soft) !important;
  border-bottom: 1px solid var(--vp-c-divider) !important;
  font-size: 13px !important;
  color: var(--vp-c-text-1) !important;
  display: flex !important;
  align-items: center !important;
}
</style>