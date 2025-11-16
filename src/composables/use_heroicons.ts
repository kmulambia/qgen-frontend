import * as HeroiconsOutline from '@heroicons/vue/24/outline'
import * as HeroiconsSolid from '@heroicons/vue/24/solid'

/**
 * Composable for dynamically loading Heroicons by string name
 *
 * @example
 * ```vue
 * <template>
 *   <component :is="getHeroIcon('ChartPieIcon')" class="h-5 w-5" />
 *   <component :is="getHeroIcon('UserIcon', 'solid')" class="h-6 w-6" />
 * </template>
 *
 * <script setup>
 * import { use_heroicons } from '@/composables/use_heroicons'
 * const { getHeroIcon } = use_heroicons()
 * </script>
 * ```
 */
export const useHeroicons = () => {
  /**
   * Get a Heroicon component by name
   * @param iconName - The name of the icon (e.g., 'ChartPieIcon', 'UserIcon')
   * @param type - Icon type: 'outline' (default) or 'solid'
   * @returns The icon component or QuestionMarkCircleIcon as fallback
   */
  const get_hero_icon = (icon_name: string, type: 'outline' | 'solid' = 'outline') => {
    const icon_set = type === 'solid' ? HeroiconsSolid : HeroiconsOutline
    const icon = icon_set[icon_name as keyof typeof icon_set]

    // Return the icon if found, otherwise return fallback
    return icon || HeroiconsOutline.QuestionMarkCircleIcon
  }

  /**
   * Check if an icon exists in the Heroicons library
   * @param icon_name - The name of the icon to check
   * @param type - Icon type: 'outline' (default) or 'solid'
   * @returns Boolean indicating if the icon exists
   */
  const has_hero_icon = (icon_name: string, type: 'outline' | 'solid' = 'outline'): boolean => {
    const icon_set = type === 'solid' ? HeroiconsSolid : HeroiconsOutline
    return icon_name in icon_set
  }

  /**
   * Get all available icon names for a specific type
   * @param type - Icon type: 'outline' (default) or 'solid'
   * @returns Array of available icon names
   */
  const get_available_icons = (type: 'outline' | 'solid' = 'outline'): string[] => {
    const icon_set = type === 'solid' ? HeroiconsSolid : HeroiconsOutline
    return Object.keys(icon_set)
  }

  return {
    get_hero_icon,
    has_hero_icon,
    get_available_icons
  }
}

export default useHeroicons
