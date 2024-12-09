import React from 'react'

const Rise = () => {
  return (
    <div className="relative w-full h-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/rise.png')" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-60 p-8 max-w-2xl text-center">
          <p className="text-white text-4xl">
          The rise of digital platforms has transformed how we learn languages today. Let&apos;s explore the trends driving this shift.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Rise

