import { toPng } from 'html-to-image'

export const handleExport = () => {
  const container = document.querySelector(
    '.react-flow__viewport'
  ) as HTMLElement
  if (container) {
    toPng(container, {
      pixelRatio: 6,
    })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'graph.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.error('Export failed:', err)
      })
  }
}
