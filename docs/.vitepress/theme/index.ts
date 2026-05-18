import DefaultTheme from 'vitepress/theme'
import RandomColoringProblem from '../components/RandomColoringProblem.vue'

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    // 全域註冊元件
    // 註冊後，每一篇 Markdown 都可以直接使用 <RandomColoringProblem />
    app.component('RandomColoringProblem', RandomColoringProblem)
  }
}