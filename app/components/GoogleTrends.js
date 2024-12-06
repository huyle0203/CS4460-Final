'use client'

import React, { useEffect, useRef, useState } from 'react'

const GoogleTrends = () => {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loaderScript = document.createElement('script')
    loaderScript.src = 'https://ssl.gstatic.com/trends_nrtr/3898_RC01/embed_loader.js'
    loaderScript.async = true

    const renderTrends = () => {
      if (window.trends) {
        try {
          window.trends.embed.renderExploreWidget(
            "TIMESERIES", 
            {
              comparisonItem: [
                { keyword: "learning english", geo: "US", time: "2019-03-01 2024-12-05" },
                { keyword: "learning spanish", geo: "US", time: "2019-03-01 2024-12-05" },
                { keyword: "learning french", geo: "US", time: "2019-03-01 2024-12-05" },
                { keyword: "learning japanese", geo: "US", time: "2019-03-01 2024-12-05" },
                { keyword: "learning language", geo: "US", time: "2019-03-01 2024-12-05" }
              ],
              category: 0,
              property: ""
            },
            {
              exploreQuery: "date=2019-03-01%202024-12-05&geo=US&q=learning%20english,learning%20spanish,learning%20french,learning%20japanese,learning%20language&hl=en-US",
              guestPath: "https://trends.google.com:443/trends/embed/"
            },
            containerRef.current
          )
          setIsLoaded(true)
        } catch (err) {
          console.error("Error rendering Google Trends:", err)
          setError("Failed to load Google Trends widget")
        }
      }
    }

    loaderScript.onload = renderTrends
    loaderScript.onerror = () => {
      console.error("Failed to load Google Trends script")
      setError("Failed to load Google Trends widget")
    }

    document.head.appendChild(loaderScript)

    return () => {
      if (document.head.contains(loaderScript)) {
        document.head.removeChild(loaderScript)
      }
      const iframe = containerRef.current?.querySelector('iframe')
      if (iframe) {
        iframe.remove()
      }
    }
  }, [])

  if (error) {
    return <div className="w-full h-full flex items-center justify-center bg-white rounded-lg p-4 text-red-500">{error}</div>
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-white rounded-lg p-4">
      {!isLoaded && <div className="w-full h-full flex items-center justify-center">Loading Google Trends...</div>}
    </div>
  )
}

export default GoogleTrends

