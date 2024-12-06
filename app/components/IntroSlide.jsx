import React from 'react'

const IntroSlide = () => {
  return (
    <div className="relative w-full h-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/covidvid-ezgif.com-optimize.gif')" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-60 p-8 max-w-2xl text-center">
          <p className="text-white text-4xl">
            "Did you know that interest in language learning surged during the pandemic, and it's only growing as people become more globally connected?"
          </p>
        </div>
      </div>
    </div>
  )
}

export default IntroSlide

