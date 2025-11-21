/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-error - html2pdf.js types may not be available
import html2pdf from 'html2pdf.js'
import type { IQuotation } from '@/interfaces'

/**
 * Convert oklch colors to RGB by cloning element and applying computed styles
 * This is needed because html2canvas doesn't support oklch() color function
 */
function convertOklchToRgb(originalElement: HTMLElement): HTMLElement {
  // Clone the element and all its children
  const clone = originalElement.cloneNode(true) as HTMLElement

  // Create arrays to store corresponding original and cloned nodes
  const originalNodes: Element[] = []
  const clonedNodes: Element[] = []

  // Collect all elements from both original and clone
  function collectElements(original: Element, cloned: Element) {
    originalNodes.push(original)
    clonedNodes.push(cloned)

    const originalChildren = Array.from(original.children)
    const clonedChildren = Array.from(cloned.children)

    for (let i = 0; i < Math.min(originalChildren.length, clonedChildren.length); i++) {
      collectElements(originalChildren[i], clonedChildren[i])
    }
  }

  collectElements(originalElement, clone)

  // Apply computed styles from original to clone - copy ALL relevant properties as inline styles
  // This ensures html2canvas uses inline styles (RGB) instead of parsing CSS files (oklch)
  const allCSSProperties = [
    // Color properties
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'textDecorationColor',
    // Background and border
    'background',
    'backgroundImage',
    'backgroundPosition',
    'backgroundRepeat',
    'backgroundSize',
    'border',
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft',
    'borderWidth',
    'borderStyle',
    'borderRadius',
    // Typography
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'lineHeight',
    'textAlign',
    'textDecoration',
    'textTransform',
    'letterSpacing',
    // Layout
    'display',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'margin',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'boxSizing',
    'overflow',
    'overflowX',
    'overflowY',
    // Flexbox/Grid
    'flexDirection',
    'flexWrap',
    'justifyContent',
    'alignItems',
    'alignContent',
    'gap',
    // Other
    'opacity',
    'visibility',
    'zIndex',
    'boxShadow',
    'textShadow',
  ]

  for (let i = 0; i < originalNodes.length; i++) {
    const originalEl = originalNodes[i]
    const clonedEl = clonedNodes[i]

    const computedStyle = window.getComputedStyle(originalEl)
    const clonedStyle = (clonedEl as HTMLElement).style

    // Copy all relevant CSS properties as inline styles
    // This converts computed RGB values (from oklch) to inline styles
    allCSSProperties.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop)
      if (value && value.trim() !== '' && !value.includes('oklch')) {
        // Convert camelCase to kebab-case for CSS property names
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
        clonedStyle.setProperty(cssProp, value, 'important')
      }
    })

    // Also copy any custom CSS variables that might be used
    // Get all CSS custom properties
    const cssText = computedStyle.cssText
    if (cssText) {
      // Extract CSS variables (--*) and copy their computed values
      const cssVarMatches = cssText.match(/--[^:;]+/g)
      if (cssVarMatches) {
        cssVarMatches.forEach((varName) => {
          const computedValue = computedStyle.getPropertyValue(varName.trim())
          if (computedValue && !computedValue.includes('oklch')) {
            clonedStyle.setProperty(varName.trim(), computedValue, 'important')
          }
        })
      }
    }
  }

  return clone
}

/**
 * Generate PDF document from HTML element using html2pdf.js
 * @param element - HTML element or selector string to convert to PDF
 * @param quotation - Quotation data for filename generation
 */
export async function generateQuotationPDF(
  element: HTMLElement | string,
  quotation: IQuotation
): Promise<void> {
  let htmlElement: HTMLElement | null = null
  let originalDisplay = ''
  let originalVisibility = ''
  let wasHidden = false
  let tempContainer: HTMLDivElement | null = null

  try {
    // Get the HTML element
    if (typeof element === 'string') {
      // If it's a selector string, get the element
      htmlElement = document.querySelector(element)
      if (!htmlElement) {
        // Try getElementById if selector doesn't work
        htmlElement = document.getElementById(element.replace('#', ''))
      }
    } else {
      htmlElement = element
    }

    if (!htmlElement) {
      throw new Error('HTML element not found. Please provide a valid element or selector.')
    }

    // Ensure element is visible (temporarily if hidden)
    originalDisplay = htmlElement.style.display
    originalVisibility = htmlElement.style.visibility
    wasHidden = originalDisplay === 'none' || originalVisibility === 'hidden'

    if (wasHidden) {
      htmlElement.style.display = 'block'
      htmlElement.style.visibility = 'visible'
    }

    // Convert oklch colors to RGB by cloning and applying computed styles
    const clonedElement = convertOklchToRgb(htmlElement)

    // Ensure cloned element is visible and positioned correctly for PDF generation
    clonedElement.style.display = 'block'
    clonedElement.style.visibility = 'visible'
    clonedElement.style.position = 'static'
    clonedElement.style.width = htmlElement.offsetWidth + 'px'

    // Temporarily attach cloned element to DOM (off-screen) so html2canvas can process it
    tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = htmlElement.offsetWidth + 'px'
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)

    // Inject a style tag that converts CSS variables to RGB to prevent html2canvas from parsing oklch
    const styleTag = document.createElement('style')
    styleTag.id = 'pdf-oklch-override'
    styleTag.textContent = `
      * {
        --color-primary-50: rgb(251, 245, 255) !important;
        --color-primary-100: rgb(243, 232, 255) !important;
        --color-primary-200: rgb(233, 213, 255) !important;
        --color-primary-300: rgb(216, 180, 254) !important;
        --color-primary-400: rgb(192, 132, 252) !important;
        --color-primary-500: rgb(168, 85, 247) !important;
        --color-primary-600: rgb(147, 51, 234) !important;
        --color-primary-700: rgb(126, 34, 206) !important;
        --color-primary-800: rgb(107, 33, 168) !important;
        --color-primary-900: rgb(88, 28, 135) !important;
        --color-primary-950: rgb(59, 7, 100) !important;
        --color-primary: var(--color-primary-600) !important;
      }
    `
    document.head.appendChild(styleTag)

    // Wait a bit for styles to settle
    await new Promise(resolve => setTimeout(resolve, 50))

    // Generate filename
    const filename = `Quotation_${quotation.quotation_number || quotation.id || 'unknown'}_${new Date().toISOString().split('T')[0]}.pdf`

    // Configure html2pdf options
    const options = {
      margin: [0.5, 0.5, 0.5, 0.5], // [top, right, bottom, left] in inches
      filename: filename,
      image: {
        type: 'jpeg',
        quality: 0.98,
      },
      html2canvas: {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images from different origins
        logging: false, // Disable console logging
        letterRendering: true, // Better text rendering
        onclone: (clonedDoc: Document) => {
          // Remove ALL stylesheets since we've already copied all styles as inline styles (RGB)
          // This prevents html2canvas from parsing oklch colors from CSS files
          const styleSheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style:not(#pdf-oklch-override)')
          styleSheets.forEach((sheet) => {
            try {
              sheet.remove()
            } catch {
              // Ignore removal errors
            }
          })

          // Also ensure any remaining style tags don't have oklch
          const remainingStyles = clonedDoc.querySelectorAll('style')
          remainingStyles.forEach((style) => {
            if (style.textContent && style.textContent.includes('oklch')) {
              style.remove()
            }
          })
        },
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
      },
    }

    // Generate and download PDF using the cloned element
    await html2pdf()
      .set(options as any)
      .from(clonedElement)
      .save()

  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF document')
  } finally {
    // Restore original display/visibility if it was hidden
    if (htmlElement && wasHidden) {
      htmlElement.style.display = originalDisplay
      htmlElement.style.visibility = originalVisibility
    }

    // Clean up cloned element and temp container
    if (tempContainer && tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer)
    }

    // Remove the injected style tag
    const injectedStyle = document.getElementById('pdf-oklch-override')
    if (injectedStyle && injectedStyle.parentNode) {
      injectedStyle.parentNode.removeChild(injectedStyle)
    }
  }
}
