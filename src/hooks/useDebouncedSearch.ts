import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'lodash/debounce'

/**
 * Keeps a local input value in sync with a URL-backed search string.
 * The input updates instantly; the URL write is debounced to avoid noisy
 * history entries on every keystroke.
 */
export const useDebouncedSearch = (urlValue: string, setUrlValue: (v: string) => void) => {
  const [inputValue, setInputValue] = useState(urlValue)

  // Sync when the URL value changes externally (e.g. "Reset filters")
  useEffect(() => {
    setInputValue(urlValue)
  }, [urlValue])

  const debounced = useRef(debounce(setUrlValue, 300)).current
  useEffect(() => () => debounced.cancel(), [debounced])

  const onChange = useCallback((value: string) => {
    setInputValue(value)
    debounced(value)
  }, [debounced])

  return { inputValue, onChange }
}
