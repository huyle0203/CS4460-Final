import React from 'react'

const IntroSlide2 = () => {
  return (
    <div className="relative w-full h-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/worldmapgif.gif')" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-60 p-8 max-w-2xl text-center">
          <p className="text-white text-4xl">
          "But how did we get here? The technological trends of the 21st century have reshaped the art of language learning. To understand this, we must first examine how these trends emerged in the past."
          </p>
        </div>
      </div>
    </div>
  )
}

export default IntroSlide2

