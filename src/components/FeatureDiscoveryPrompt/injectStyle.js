const injectStyle = (style) => {
    const styleElement = document.createElement('style')
    let styleSheet = null

    document.head.appendChild(styleElement)

    styleSheet = styleElement.sheet

    styleSheet.insertRule(style, styleSheet.cssRules.length)
}

export default injectStyle