import React from 'react'

const ClassroomSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto p-8">
      <div className="relative w-full">
        <img 
          src="/numberofclassroomlearnersbylang.png" 
          alt="Bar chart showing number of classroom learners by language, with English having the highest number" 
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      <div className="bg-black bg-opacity-60 p-6 rounded-lg max-w-2xl">
        <p className="text-white text-xl text-center">
          "In the past, language learning was confined to traditional classrooms. Today, English dominates these settings."
        </p>
        <p className="text-white text-sm mt-4 text-center italic">
          Figure 14: Number of Classroom Learners by Language
        </p>
      </div>
    </div>
  )
}

export default ClassroomSlide

