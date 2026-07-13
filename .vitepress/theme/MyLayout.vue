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

function getLabels(pathPrefix, filePath) {
  const sidebar = theme.value?.sidebar || {}
  const items = sidebar[pathPrefix] || []
  for (const group of items) {
    // 检查分组本身是否匹配（如学科总览页）
    if (group.link === filePath || group.link === filePath + '/') {
      return { page: group.text }
    }
    // 检查子项是否匹配
    if (group.items) {
      for (const child of group.items) {
        if (child.link === filePath || child.link === filePath + '/') {
          return { subject: group.text, page: child.text }
        }
      }
    }
  }
  return { page: filePath.split('/').pop() || filePath }
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
  const labels = getLabels(pathPrefix, fullPath)
  if (labels.subject) {
    return { first: gradeLabel, second: labels.subject, third: labels.page }
  }
  return { first: gradeLabel, second: labels.page }
})
</script>

<template>
  <Layout>
    <template #layout-top>
      <div class="breadcrumb-fixed">
        <template v-if="breadcrumbs">
          {{ breadcrumbs.first }} &gt;
          <template v-if="breadcrumbs.third">{{ breadcrumbs.second }} &gt; {{ breadcrumbs.third }}</template>
          <template v-else>{{ breadcrumbs.second }}</template>
        </template>
        <template v-else></template>
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
  background-color: var(--vp-c-bg) !important;
  font-size: 13px !important;
  color: var(--vp-c-text-2) !important;
  display: flex !important;
  align-items: center !important;
}

html.dark .breadcrumb-fixed {
  background-color: var(--vp-c-bg) !important;
  color: var(--vp-c-text-2) !important;
}
</style>