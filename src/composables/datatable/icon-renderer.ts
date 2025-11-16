import { h, render } from 'vue'

export function useDataTableIconRenderer() {
  const convertIconToHtmlString = (Icon: any) => {
    const vnode = h(Icon, { class: 'h-5 w-5' })
    const container = document.createElement('div')
    render(vnode, container)
    return container.innerHTML
  }

  return {
    convertIconToHtmlString,
  }
}
