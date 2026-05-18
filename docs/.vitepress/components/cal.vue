<script setup>
import { ref, computed } from 'vue'

/**
 * 互動練習：標準小算盤組件
 * * 功能：
 * 1. 支援加、減、乘、除基本運算與百分比（%）
 * 2. 支援正負號切換（+/-）
 * 3. 具備連續輸入、連續運算邏輯
 * 4. 支援鍵盤或滑鼠點擊輸入
 * 5. 畫面字體根據長度自動縮小（防止爆框）
 */

// 算盤內部狀態
const display = ref('0')         // 目前顯示的數字
const previousValue = ref(null)  // 上一個暫存的數字
const operator = ref(null)       // 目前的運算符號
const isWaitingForInput = ref(false) // 是否在等待下一個數字輸入

// 計算目前顯示字串的長度，動態調整字體大小
const displayFontSize = computed(() => {
  const len = display.value.length
  if (len > 12) return '1.5rem'
  if (len > 8) return '2rem'
  return '2.5rem'
})

// 輸入數字
function appendNumber(number) {
  if (display.value === '0' || isWaitingForInput.value) {
    display.value = String(number)
    isWaitingForInput.value = false
  } else {
    // 限制最大輸入長度
    if (display.value.length < 15) {
      display.value += String(number)
    }
  }
}

// 輸入小數點
function appendDot() {
  if (isWaitingForInput.value) {
    display.value = '0.'
    isWaitingForInput.value = false
    return
  }
  if (!display.value.includes('.')) {
    display.value += '.'
  }
}

// 清除全部 (AC)
function clearAll() {
  display.value = '0'
  previousValue.value = null
  operator.value = null
  isWaitingForInput.value = false
}

// 切換正負號 (+/-)
function toggleSign() {
  if (display.value === '0') return
  if (display.value.startsWith('-')) {
    display.value = display.value.slice(1)
  } else {
    display.value = '-' + display.value
  }
}

// 百分比運算 (%)
function percentage() {
  const current = parseFloat(display.value)
  if (isNaN(current)) return
  display.value = String(current / 100)
}

// 選擇運算符號 (+, -, *, /)
function handleOperator(nextOperator) {
  const inputValue = parseFloat(display.value)

  if (operator.value && isWaitingForInput.value) {
    operator.value = nextOperator
    return
  }

  if (previousValue.value === null) {
    previousValue.value = inputValue
  } else if (operator.value) {
    const result = calculate(previousValue.value, inputValue, operator.value)
    display.value = String(result)
    previousValue.value = result
  }

  isWaitingForInput.value = true
  operator.value = nextOperator
}

// 執行核心計算
function calculate(first, second, op) {
  switch (op) {
    case '+': return first + second
    case '-': return first - second
    case '*': return first * second
    case '/': return second === 0 ? 'Error' : first / second
    default: return second
  }
}

// 按下等於 (=)
function performCalculation() {
  if (!operator.value) return

  const inputValue = parseFloat(display.value)
  const result = calculate(previousValue.value, inputValue, operator.value)
  
  display.value = String(result)
  previousValue.value = null
  operator.value = null
  isWaitingForInput.value = true // 計算完後，若直接按數字會覆蓋舊結果
}
</script>

<template>
  <div class="calculator-panel">
    <div class="header">
      <h3>互動練習：簡易小算盤</h3>
      <p>支援基本加減乘除、正負號切換與連續計算。</p>
    </div>

    <div class="calculator">
      <div class="display-screen">
        <span class="operator-indicator" v-if="operator">{{ operator }}</span>
        <div class="display-text" :style="{ fontSize: displayFontSize }">
          {{ display }}
        </div>
      </div>

      <div class="keypad">
        <button class="btn fn-btn" @click="clearAll">AC</button>
        <button class="btn fn-btn" @click="toggleSign">+/-</button>
        <button class="btn fn-btn" @click="percentage">%</button>
        <button class="btn op-btn" :class="{ active: operator === '/' && isWaitingForInput }" @click="handleOperator('/')">÷</button>

        <button class="btn num-btn" @click="appendNumber(7)">7</button>
        <button class="btn num-btn" @click="appendNumber(8)">8</button>
        <button class="btn num-btn" @click="appendNumber(9)">9</button>
        <button class="btn op-btn" :class="{ active: operator === '*' && isWaitingForInput }" @click="handleOperator('*')">×</button>

        <button class="btn num-btn" @click="appendNumber(4)">4</button>
        <button class="btn num-btn" @click="appendNumber(5)">5</button>
        <button class="btn num-btn" @click="appendNumber(6)">6</button>
        <button class="btn op-btn" :class="{ active: operator === '-' && isWaitingForInput }" @click="handleOperator('-')">-</button>

        <button class="btn num-btn" @click="appendNumber(1)">1</button>
        <button class="btn num-btn" @click="appendNumber(2)">2</button>
        <button class="btn num-btn" @click="appendNumber(3)">3</button>
        <button class="btn op-btn" :class="{ active: operator === '+' && isWaitingForInput }" @click="handleOperator('+')">+</button>

        <button class="btn num-btn zero-btn" @click="appendNumber(0)">0</button>
        <button class="btn num-btn" @click="appendDot">.</button>
        <button class="btn op-btn equal-btn" @click="performCalculation">=</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 外部控制面板容器 */
.calculator-panel {
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
  font-size: 14px;
}

/* 算盤主體外殼（仿 iOS 經典風格） */
.calculator {
  width: 100%;
  max-width: 320px;
  margin: 20px auto;
  background: #1c1c1e;
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

/* 顯示螢幕 */
.display-screen {
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 12px 8px 12px;
  position: relative;
}

.display-text {
  color: #ffffff;
  font-weight: 300;
  line-height: 1;
  word-wrap: break-word;
  word-break: break-all;
  transition: font-size 0.1s ease;
}

.operator-indicator {
  position: absolute;
  top: 8px;
  left: 12px;
  color: #ff9f0a;
  font-size: 16px;
  font-weight: bold;
}

/* 按鍵格網線佈局 */
.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 12px;
}

/* 基本按鍵樣式 */
.btn {
  border: none;
  border-radius: 999px;
  height: 60px;
  font-size: 22px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: filter 0.1s ease, background-color 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:active {
  filter: brightness(1.3);
}

/* 數字鍵樣式 */
.num-btn {
  background-color: #3a3a3c;
  color: #ffffff;
}

/* 功能鍵樣式（AC, +/-, %） */
.fn-btn {
  background-color: #a5a5a5;
  color: #000000;
  font-size: 18px;
}

/* 運算子鍵樣式（+, -, *, /, =） */
.op-btn {
  background-color: #ff9f0a;
  color: #ffffff;
  font-size: 26px;
}

/* 當前選中的運算子高亮反白 */
.op-btn.active {
  background-color: #ffffff;
  color: #ff9f0a;
}

/* 數字 0 跨兩欄 */
.zero-btn {
  grid-column: span 2;
  justify-content: flex-start;
  padding-left: 24px;
}
</style>