"use client"

import { useEffect, useState } from "react"

export default function FooterYear() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  if (!year) {
    return <span>...</span> // Placeholder while loading year on client
  }

  return <span>{year}</span>
}
