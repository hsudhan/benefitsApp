'use client'

// Generic tile grid with native HTML5 drag-to-reorder. Owns only the display
// order of its items — all rendering is delegated to renderItem, so tile
// components stay pure views. Dropping a tile on the left/right half of
// another tile inserts it before/after that tile.

import { useEffect, useState, type DragEvent, type ReactNode } from 'react'
import styles from './DraggableTileGrid.module.css'

interface DraggableTileGridProps<T extends { id: string }> {
  items: T[]
  className: string
  renderItem: (item: T) => ReactNode
}

export default function DraggableTileGrid<T extends { id: string }>({
  items,
  className,
  renderItem,
}: DraggableTileGridProps<T>) {
  const [order, setOrder] = useState<string[]>(() => items.map((item) => item.id))
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  // Re-sync when the item set changes (e.g. refetch): keep the user's order
  // for tiles that still exist, append new ones at the end.
  useEffect(() => {
    setOrder((prev) => {
      const ids = items.map((item) => item.id)
      const kept = prev.filter((id) => ids.includes(id))
      const added = ids.filter((id) => !kept.includes(id))
      return [...kept, ...added]
    })
  }, [items])

  const byId = new Map(items.map((item) => [item.id, item]))
  const orderedItems = order
    .map((id) => byId.get(id))
    .filter((item): item is T => item !== undefined)

  function moveRelativeTo(sourceId: string, targetId: string, after: boolean) {
    setOrder((prev) => {
      const next = prev.filter((id) => id !== sourceId)
      const targetIndex = next.indexOf(targetId)
      next.splice(after ? targetIndex + 1 : targetIndex, 0, sourceId)
      return next
    })
  }

  function handleDragStart(event: DragEvent<HTMLDivElement>, id: string) {
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'move'
    setDragId(id)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>, id: string) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    if (id !== dragId) setOverId(id)
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>, id: string) {
    // Ignore leaves that merely enter a child of the same cell.
    if (event.currentTarget.contains(event.relatedTarget as Node)) return
    setOverId((current) => (current === id ? null : current))
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetId: string) {
    event.preventDefault()
    const sourceId = event.dataTransfer.getData('text/plain') || dragId
    if (sourceId && sourceId !== targetId) {
      const rect = event.currentTarget.getBoundingClientRect()
      const after = event.clientX > rect.left + rect.width / 2
      moveRelativeTo(sourceId, targetId, after)
    }
    setDragId(null)
    setOverId(null)
  }

  function handleDragEnd() {
    setDragId(null)
    setOverId(null)
  }

  return (
    <div className={className}>
      {orderedItems.map((item) => {
        const cellClassName = [
          styles.cell,
          item.id === dragId ? styles.dragging : '',
          item.id === overId && item.id !== dragId ? styles.dropTarget : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div
            key={item.id}
            className={cellClassName}
            draggable
            onDragStart={(event) => handleDragStart(event, item.id)}
            onDragOver={(event) => handleDragOver(event, item.id)}
            onDragLeave={(event) => handleDragLeave(event, item.id)}
            onDrop={(event) => handleDrop(event, item.id)}
            onDragEnd={handleDragEnd}
          >
            {renderItem(item)}
          </div>
        )
      })}
    </div>
  )
}
