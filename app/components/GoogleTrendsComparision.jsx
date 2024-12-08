import React from 'react'
import Image from 'next/image'

const GoogleTrendsComparison = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-white text-center">
        "Interest in language learning has spiked, particularly during the pandemic, as reflected in search trends."
      </h2>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full aspect-video">
            <Image
              src="/googleTrends1.png"
              alt="Google Search Trends from March 1, 2019, to Now"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="text-white text-sm mt-4 text-center italic">
            Figure 10: Google Search Trends from March 1, 2019, to Now
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full aspect-video">
            <Image
              src="/googleTrends2.png"
              alt="Search Volumes for Language Learning"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="text-white text-sm mt-4 text-center italic">
            Figure 5: Search Volumes for Language Learning
          </p>
        </div>
      </div>
    </div>
  )
}

export default GoogleTrendsComparison

