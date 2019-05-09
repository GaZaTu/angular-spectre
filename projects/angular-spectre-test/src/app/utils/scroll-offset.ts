export function scrollOffset(): [number, number] {
  const fragmentIndex = location.hash.lastIndexOf('#')
  const fragment = location.hash.slice(fragmentIndex + 1)

  if (fragmentIndex !== -1) {
    const targetElement = document.getElementById(fragment)

    if (targetElement && window.innerWidth > 960 && (targetElement.classList.contains('s-title') || targetElement.classList.contains('s-subtitle'))) {
      return [0, 0]
    } else {
      return [0, 36 + 32]
    }
  } else {
    return [0, 0]
  }
}
