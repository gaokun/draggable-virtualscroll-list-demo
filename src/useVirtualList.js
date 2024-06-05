import { computed } from 'vue'

export function useVirtualList(config) {
  const { totalCount, scrollTop, containerHeight, sideBufferCount = 5, itemHeight = 36 } = config

  const visibleStartIndex = computed(() => Math.floor(scrollTop.value / itemHeight)) // 可见的起始行
  const visibleCount = computed(() => Math.ceil(containerHeight.value / itemHeight)) // 可见的行数
  const bufferStartIndex = computed(() => Math.max(0, visibleStartIndex.value - sideBufferCount)) // 缓冲的起始行
  const bufferCount = computed(
    () => Math.min(totalCount.value, visibleCount.value + sideBufferCount * 2) // 不能超过tableRecords的长度
  )
  const renderOffset = computed(() => bufferStartIndex.value * itemHeight) // 渲染的偏移量

  const containerStyle = computed(() => ({ height: `${totalCount.value * itemHeight}px` }))
  const wrapperStyle = computed(() => ({ transform: `translateY(${renderOffset.value}px)` }))

  function getRenderItems(records) {
    return records.slice(bufferStartIndex.value, bufferStartIndex.value + bufferCount.value)
  }

  return {
    bufferStartIndex,
    bufferCount,
    renderOffset,
    getRenderItems,
    containerStyle,
    wrapperStyle
  }
}
