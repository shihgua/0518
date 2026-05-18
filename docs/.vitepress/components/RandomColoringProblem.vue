<script setup>
import { computed, ref } from 'vue'

/**
 * 隨機圖著色問題元件
 *
 * 功能：
 * 1. 使用者可決定節點數量
 * 2. 使用者可決定邊數量
 * 3. 使用者可決定可用顏色數量
 * 4. 每次重新生成都會產生不同圖形
 * 5. 點選顏色後，再點節點即可上色
 * 6. 自動檢查相鄰節點是否同色
 */

// SVG 畫布大小
const width = 560
const height = 380

// 使用者可調整的參數
const nodeCount = ref(6)
const edgeCount = ref(7)
const colorCount = ref(3)

// 目前選到的顏色
const selectedColor = ref(0)

// 節點資料
const nodes = ref([])

// 邊資料
const edges = ref([])

// 顏色清單：可自行改成你喜歡的色碼
const colorPalette = [
  '#ef4444', // 紅
  '#3b82f6', // 藍
  '#22c55e', // 綠
  '#f59e0b', // 黃
  '#a855f7', // 紫
  '#ec4899', // 粉
  '#14b8a6', // 青
  '#64748b'  // 灰
]

// 實際可用顏色
const availableColors = computed(() => {
  return colorPalette.slice(0, colorCount.value)
})

// 最大可能邊數：n 個節點最多 n(n-1)/2 條邊
const maxPossibleEdges = computed(() => {
  return (nodeCount.value * (nodeCount.value - 1)) / 2
})

// 修正使用者輸入，避免邊數超過最大可能
function normalizeSettings() {
  if (nodeCount.value < 2) nodeCount.value = 2
  if (nodeCount.value > 16) nodeCount.value = 16

  if (colorCount.value < 2) colorCount.value = 2
  if (colorCount.value > colorPalette.length) {
    colorCount.value = colorPalette.length
  }

  if (edgeCount.value < 0) edgeCount.value = 0
  if (edgeCount.value > maxPossibleEdges.value) {
    edgeCount.value = maxPossibleEdges.value
  }
}

// 產生隨機整數
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 打亂陣列
function shuffle(array) {
  const copied = [...array]

  for (let i = copied.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[copied[i], copied[j]] = [copied[j], copied[i]]
  }

  return copied
}

// 產生節點位置
function generateNodes() {
  const result = []
  const centerX = width / 2
  const centerY = height / 2
  const radiusX = width * 0.36
  const radiusY = height * 0.34

  for (let i = 0; i < nodeCount.value; i++) {
    /**
     * 先用圓形排列，再加上一點隨機位移。
     * 這樣圖形不會太亂，但每次看起來仍然不同。
     */
    const angle = (Math.PI * 2 * i) / nodeCount.value
    const jitterX = randomInt(-35, 35)
    const jitterY = randomInt(-30, 30)

    result.push({
      id: i,
      label: String.fromCharCode(65 + i), // A, B, C...
      x: centerX + Math.cos(angle) * radiusX + jitterX,
      y: centerY + Math.sin(angle) * radiusY + jitterY,
      colorIndex: null
    })
  }

  return result
}

// 產生隨機邊
function generateEdges() {
  const possibleEdges = []

  // 列出所有不重複的邊，例如 0-1、0-2、1-2
  for (let i = 0; i < nodeCount.value; i++) {
    for (let j = i + 1; j < nodeCount.value; j++) {
      possibleEdges.push({
        from: i,
        to: j
      })
    }
  }

  // 打亂後取前 edgeCount 條
  return shuffle(possibleEdges).slice(0, edgeCount.value)
}

// 重新生成圖形
function generateGraph() {
  normalizeSettings()

  nodes.value = generateNodes()
  edges.value = generateEdges()
  selectedColor.value = 0
}

// 清除目前著色，但保留同一張圖
function clearColors() {
  nodes.value.forEach((node) => {
    node.colorIndex = null
  })
}

// 替節點上色
function paintNode(node) {
  node.colorIndex = selectedColor.value
}

// 取得節點顏色
function getNodeFill(node) {
  if (node.colorIndex === null) return 'var(--vp-c-bg)'
  return availableColors.value[node.colorIndex]
}

// 取得指定 id 的節點
function getNodeById(id) {
  return nodes.value.find((node) => node.id === id)
}

// 判斷某條邊是否衝突
function isEdgeConflict(edge) {
  const fromNode = getNodeById(edge.from)
  const toNode = getNodeById(edge.to)

  if (!fromNode || !toNode) return false
  if (fromNode.colorIndex === null || toNode.colorIndex === null) return false

  return fromNode.colorIndex === toNode.colorIndex
}

// 所有衝突邊
const conflictEdges = computed(() => {
  return edges.value.filter((edge) => isEdgeConflict(edge))
})

// 是否有衝突
const hasConflict = computed(() => {
  return conflictEdges.value.length > 0
})

// 是否所有節點都有上色
const allColored = computed(() => {
  return nodes.value.length > 0 && nodes.value.every((node) => node.colorIndex !== null)
})

// 是否成功完成
const isSolved = computed(() => {
  return allColored.value && !hasConflict.value
})

// 目前圖形資訊
const graphInfo = computed(() => {
  return `目前圖形：${nodeCount.value} 個節點、${edges.value.length} 條邊、${colorCount.value} 種顏色`
})

// 初始化
generateGraph()
</script>

<template>
  <div class="coloring-panel">
    <div class="header">
      <div>
        <h3>互動練習：隨機圖著色問題</h3>
        <p>
          選擇顏色後點擊節點上色。規則是：
          <strong>相鄰節點不能使用相同顏色</strong>。
        </p>
      </div>
    </div>

    <div class="controls">
      <label>
        節點數量
        <input
          v-model.number="nodeCount"
          type="number"
          min="2"
          max="16"
        />
      </label>

      <label>
        邊數量
        <input
          v-model.number="edgeCount"
          type="number"
          min="0"
          :max="maxPossibleEdges"
        />
      </label>

      <label>
        顏色數量
        <input
          v-model.number="colorCount"
          type="number"
          min="2"
          :max="colorPalette.length"
        />
      </label>

      <button @click="generateGraph">
        重新生成圖形
      </button>

      <button @click="clearColors">
        清除著色
      </button>
    </div>

    <p class="hint">
      {{ graphInfo }}
      <br />
      最多可設定 {{ maxPossibleEdges }} 條邊。
    </p>

    <div class="color-picker">
      <span>選擇顏色：</span>

      <button
        v-for="(color, index) in availableColors"
        :key="color"
        class="color-button"
        :class="{ active: selectedColor === index }"
        :style="{ backgroundColor: color }"
        @click="selectedColor = index"
        :aria-label="`選擇顏色 ${index + 1}`"
      />
    </div>

    <div class="graph-area">
      <svg
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        aria-label="隨機圖著色問題"
      >
        <!-- 邊 -->
        <line
          v-for="edge in edges"
          :key="`${edge.from}-${edge.to}`"
          :x1="getNodeById(edge.from)?.x"
          :y1="getNodeById(edge.from)?.y"
          :x2="getNodeById(edge.to)?.x"
          :y2="getNodeById(edge.to)?.y"
          :class="{ conflict: isEdgeConflict(edge) }"
        />

        <!-- 節點 -->
        <g
          v-for="node in nodes"
          :key="node.id"
          class="node"
          @click="paintNode(node)"
        >
          <circle
            :cx="node.x"
            :cy="node.y"
            r="24"
            :fill="getNodeFill(node)"
          />

          <text
            :x="node.x"
            :y="node.y + 6"
            text-anchor="middle"
          >
            {{ node.label }}
          </text>
        </g>
      </svg>
    </div>

    <div class="status">
      <p v-if="hasConflict" class="bad">
        有衝突：目前有 {{ conflictEdges.length }} 條邊的兩端節點顏色相同。
      </p>

      <p v-else-if="isSolved" class="good">
        完成！這是一個合法著色。
      </p>

      <p v-else-if="allColored" class="good">
        所有節點都已上色，且沒有衝突。
      </p>

      <p v-else>
        尚未完成：請繼續替所有節點上色。
      </p>
    </div>
  </div>
</template>

<style scoped>
.coloring-panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 20px;
  margin: 28px 0;
  background: var(--vp-c-bg-soft);
}

.header h3 {
  margin-top: 0;
  margin-bottom: 8px;
}

.header p {
  margin-top: 0;
  color: var(--vp-c-text-2);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
  margin-top: 16px;
}

.controls label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.controls input {
  width: 96px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 6px 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.controls button {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 7px 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.controls button:hover {
  border-color: var(--vp-c-brand-1);
}

.hint {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 18px 0;
}

.color-button {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 3px solid transparent;
  cursor: pointer;
}

.color-button.active {
  border-color: var(--vp-c-text-1);
  outline: 2px solid var(--vp-c-brand-1);
}

.graph-area {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

svg {
  display: block;
  min-width: 560px;
}

line {
  stroke: var(--vp-c-text-2);
  stroke-width: 3;
}

line.conflict {
  stroke: #ef4444;
  stroke-width: 5;
}

.node {
  cursor: pointer;
}

.node circle {
  stroke: var(--vp-c-text-1);
  stroke-width: 3;
  transition: 0.15s ease;
}

.node:hover circle {
  stroke: var(--vp-c-brand-1);
  stroke-width: 5;
}

.node text {
  fill: var(--vp-c-text-1);
  font-weight: 700;
  pointer-events: none;
  user-select: none;
}

.status {
  margin-top: 14px;
}

.good {
  color: #16a34a;
  font-weight: 700;
}

.bad {
  color: #dc2626;
  font-weight: 700;
}
</style>