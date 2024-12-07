'use client'

import React, { useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import LanguageChart from './LanguageChart'
import IntroSlide from './IntroSlide'
import IntroSlide2 from './IntroSlide2'
import ClassroomSlide from './ClassroomSlide'
import TreeMapChart from './TreeMapChart'
import DuolingoUser from './DuolingoUser'
import ELLMapsSlide from "./ELLMapsSlide";
import GlobeSlide from "./GlobeSlide";
import EnglishInternetDecline from "./EnglishInternetDecline";


const slides = [
  { id: 0, content: 'Intro' },
  { id: 1, content: 'Intro 2' },
  { id: 2, content: 'Language Chart' },
  { id: 3, content: 'Classroom Learning' },
  { id: 4, content: 'Languages on the Web' },
  { id: 5, content: 'Duolingo' },
  { id: 6, content: 'ELLMapsSlide'},
  { id: 7, content: 'MultilingualismSlide'},
  { id: 8, content: 'EnglishWebDecline'}
  

]

const gradients = [
  'bg-gradient-to-br from-pink-500 to-orange-400',
  'bg-gradient-to-br from-green-400 to-blue-500',
  'bg-gradient-to-br from-purple-500 to-indigo-500',
  'bg-gradient-to-br from-yellow-400 to-red-500',
  'bg-gradient-to-br from-teal-400 to-blue-500',
  'bg-gradient-to-br from-green-400 to-blue-500',
  'bg-gradient-to-br from-yellow-400 to-red-500',
  'bg-gradient-to-br from-pink-500 to-orange-400',
]

export default function SnapScroll() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      e.preventDefault()
      const delta = Math.sign(e.deltaY)
      const currentScrollTop = container.scrollTop
      const slideHeight = container.clientHeight
      const targetScrollTop = Math.round((currentScrollTop + delta * slideHeight) / slideHeight) * slideHeight

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      })
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
    >
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`h-screen flex items-center justify-center snap-start ${index !== 0 ? gradients[index % gradients.length] : ''} text-white`}
        >
          {index === 0 ? (
            <IntroSlide />
          ) : index === 1 ? (
            <IntroSlide2/>
          ) : index === 2 ? (
            <div className="w-full h-full flex items-center justify-center">
              <LanguageChart />
            </div>
          ) : index === 3 ? (
            <ClassroomSlide />
          ) : index === 4 ? (
            <div className="w-full h-full flex items-center justify-center">
              <TreeMapChart />
            </div>
          ) 
          
          : index === 5 ? (
            <div className="w-full h-full flex items-center justify-center">
              <DuolingoUser />
            </div>  
          ) : index === 6 ? (
            <div className="w-full h-full flex items-center justify-center">
              <ELLMapsSlide />
            </div>
          ) : index === 7 ? (
            <div className="w-full h-full flex items-center justify-center">
              <GlobeSlide />
            </div>
          ) : index === 8 ? (
            <div className="w-full h-full flex items-center justify-center">
              <EnglishInternetDecline />
            </div>
          )

                  : (
            <h2 className="text-4xl font-bold">{slide.content}</h2>
          )}
        </div>
      ))}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white" />
      </div>
    </div>
  )
}

