<template>
  <div class="box" ref="boxRef">
    <div :style="containerStyle">
      <VueDraggable ref="draggableRef" :modelValue="renderList" tag="div" :style="wrapperStyle">
        <div v-for="item in renderList" :key="item.id" class="item">{{ item.id }}</div>
      </VueDraggable>
    </div>
  </div>
  <h1>Reproduction Steps</h1>
  <ol>
    <li>滚动到底</li>
    <li>将40行拖动到第一行, 松手</li>
    <li>此时列表看起来顺序是没变的 [因为list是单向]</li>
    <li>向下滚动一下, 再滚回来</li>
    <li>会发现"40"行出现在第一行</li>
  </ol>
  <h3 style="color: orange">问题是: list是单向的, 为什么会出现"40"这一行</h3>
  <h4>
    感觉是sortablejs的问题, 拖动速度快了, 还容易报个error, TypeError: Cannot read properties of null
    (reading 'Sortable1717571859468')
  </h4>
  <h5>Ps: 我知道这个demo的代码里, 拖动后顺序的事还没弄完, 实际项目里, 我已经处理了</h5>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useScroll, useElementSize } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'
import { useVirtualList } from './useVirtualList'

const list = ref(new Array(40).fill(0).map((_, i) => ({ id: i + 1 })))

const boxRef = ref()
const draggableRef = ref()

const { y: scrollTop } = useScroll(boxRef)
const { height: containerHeight } = useElementSize(boxRef)
const renderList = ref([]) // 需要渲染的list

// 获取需要virtual list的相关数据
const { wrapperStyle, containerStyle, getRenderItems, bufferCount, bufferStartIndex } =
  useVirtualList({ scrollTop, totalCount: ref(list.value.length), containerHeight })

// 获取新的渲染列表
watch(
  [bufferStartIndex, bufferCount],
  () => {
    renderList.value = getRenderItems(list.value)
  },
  { immediate: true }
)
</script>

<style scoped>
.box {
  width: 500px;
  height: 300px;
  overflow: auto;
  border: 1px solid #ccc;
}
.item {
  width: 100%;
  border: 1px solid #ccc;
  height: 36px;
}
</style>
