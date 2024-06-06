export const domRemoveChild = async () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  document.body.removeChild(div)
}
