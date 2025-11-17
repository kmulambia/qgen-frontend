import {
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  DocumentIcon,
  ArchiveBoxIcon,
  CodeBracketIcon,
} from '@heroicons/vue/24/outline'
import type { Component } from 'vue'

export function useFileIcon() {
  const getFileIcon = (contentType: string): Component => {
    if (!contentType) return DocumentIcon

    const type = contentType.toLowerCase()

    // Images
    if (type.startsWith('image/')) {
      return PhotoIcon
    }

    // Videos
    if (type.startsWith('video/')) {
      return VideoCameraIcon
    }

    // Audio
    if (type.startsWith('audio/')) {
      return MusicalNoteIcon
    }

    // Text/Documents
    if (
      type.includes('text/') ||
      type.includes('document') ||
      type.includes('word') ||
      type.includes('pdf')
    ) {
      return DocumentTextIcon
    }

    // Archives/Compressed
    if (
      type.includes('zip') ||
      type.includes('rar') ||
      type.includes('tar') ||
      type.includes('gz') ||
      type.includes('7z')
    ) {
      return ArchiveBoxIcon
    }

    // Code files
    if (
      type.includes('javascript') ||
      type.includes('json') ||
      type.includes('xml') ||
      type.includes('html') ||
      type.includes('css')
    ) {
      return CodeBracketIcon
    }

    // Default
    return DocumentIcon
  }

  return {
    getFileIcon,
  }
}
