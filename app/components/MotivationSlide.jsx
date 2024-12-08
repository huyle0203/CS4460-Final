import React from 'react'
import Image from 'next/image'

const MotivationSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto p-8">
      <div className="relative w-full max-w-3xl aspect-video">
        <Image
          src="/motivation.png"
          alt="Motivational Factors to Learn a Foreign Language Survey"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="bg-black bg-opacity-60 p-6 rounded-lg max-w-2xl">
        <p className="text-white text-xl text-center">
          The motivations for learning languages have shifted dramatically, reflecting cultural curiosity and professional aspirations.
        </p>
        <p className="text-white text-sm mt-4 text-center italic">
          Figure 7: Motivational Factors to Learn a Foreign Language Survey (Multi-Bar Chart)
        </p>
      </div>
    </div>
  )
}

export default MotivationSlide

