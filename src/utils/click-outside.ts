import type { Directive } from 'vue'

export const clickOutside: Directive = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event: Event) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Type declaration for the clickOutsideEvent property
declare module 'vue' {
  interface HTMLElement {
    clickOutsideEvent?: (event: Event) => void
  }
}
