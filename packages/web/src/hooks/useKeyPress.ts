import { useEffect, useCallback } from "react"

export function useKeyPress(targetKey: string, onKeyPressed: (e: KeyboardEvent) => void) {
  const downHandler = useCallback(({ key, ...e }: KeyboardEvent) => {
    if (key === targetKey) {
      onKeyPressed({ key, ...e })
    }
  }, [targetKey, onKeyPressed])

  // If released key is our target key then set to false
  const upHandler = useCallback(({ key, ...e }: KeyboardEvent) => {
    if (key === targetKey) {
      onKeyPressed({ key, ...e })
    }
  }, [targetKey, onKeyPressed])

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [downHandler, upHandler])
}