'use client'

import React, { useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import LanguageChart from './LanguageChart'
import IntroSlide from './ImageSlides/IntroSlide'
import IntroSlide2 from './ImageSlides/IntroSlide2'
import ClassroomSlide from './ClassroomSlide'
import TreeMapChart from './TreeMapChart'
import DuolingoUser from './DuolingoUser'
import ELLMapsSlide from "./ELLMapsSlide";
import GlobeSlide from "./GlobeSlide";
import EnglishInternetDecline from "./EnglishInternetDecline";
import GoogleTrendsComparison from './GoogleTrendsComparision';
import RocketSlide from './ImageSlides/RocketSlide';
import Rise from './ImageSlides/Rise';
import Future from './ImageSlides/Future';
import Tech from './ImageSlides/Tech';
import Motivation from './ImageSlides/Motivation';
import Meme from './ImageSlides/Meme';
import MotivationSlide from './MotivationSlide';
import GraphAge from './GraphAge';
import GraphTop10 from './GraphTop10';

const slides = [
  { id: 0, content: 'Intro' },
  { id: 1, content: 'Intro 2' },
  { id: 2, content: 'Classroom Learning' },
  { id: 3, content: 'Languages on the Web' },
  { id: 4, content: 'ELLMapsSlide'},
  { id: 5, content: 'Rocket Slide'},
  { id: 6, content: 'Rise'},
  { id: 7, content: 'EnglishWebDecline'},
  { id: 8, content: 'Google Trend Compare'},
  { id: 9, content: 'Language Chart' },
  { id: 10, content: 'Duolingo' },
  { id: 11, content: 'GraphAge' },
  { id: 12, content: 'Meme'},
  { id: 13, content: 'MultilingualismSlide'},
  { id: 14, content: 'MotivationSlide'},
  { id: 15, content: 'Motivation'},
  { id: 16, content: 'Tech'},
  { id: 17, content: 'Future'},
  { id: 18, content: 'GraphTop10'},
]

const gradients = [
  'bg-gradient-to-br from-red-500 to-orange-400',
  'bg-gradient-to-br from-orange-400 to-yellow-300',
  'bg-gradient-to-br from-yellow-300 to-green-400',
  'bg-gradient-to-br from-green-400 to-teal-400',
  'bg-gradient-to-br from-teal-400 to-blue-500',
  'bg-gradient-to-br from-blue-500 to-indigo-500',
  'bg-gradient-to-br from-indigo-500 to-purple-500',
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-pink-500 to-red-500',
  'bg-gradient-to-br from-red-500 to-orange-400',
  'bg-gradient-to-br from-orange-400 to-yellow-300',
  'bg-gradient-to-br from-yellow-300 to-green-400',
  'bg-gradient-to-br from-green-400 to-teal-400',
  'bg-gradient-to-br from-teal-400 to-blue-500',
  'bg-gradient-to-br from-blue-500 to-indigo-500',
  'bg-gradient-to-br from-indigo-500 to-purple-500',
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-pink-500 to-red-500',
  'bg-gradient-to-br from-red-500 to-orange-400',
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
          className={`h-screen flex items-center justify-center snap-start ${index !== 0 ? gradients[index] : ''} text-white`}
        >
          {index === 0 ? (
            <IntroSlide />
          ) : index === 1 ? (
            <IntroSlide2/>
          ) : index === 2 ? (
            <ClassroomSlide />
          ) : index === 3 ? (
            <div className="w-full h-full flex items-center justify-center">
              <TreeMapChart />
            </div>
          ) : index === 4 ? (
            <div className="w-full h-full flex items-center justify-center">
              <ELLMapsSlide />
            </div>
          ) : index === 5 ? (
            <div className="w-full h-full flex items-center justify-center">
              <RocketSlide />
            </div>
          ) : index === 6 ? (
            <div className="w-full h-full flex items-center justify-center">
              <Rise />
            </div>
          ) : index === 7 ? (
            <div className="w-full h-full flex items-center justify-center">
              <EnglishInternetDecline />
            </div>
          ) : index === 8 ? (
            <div className="w-full h-full flex items-center justify-center">
              <GoogleTrendsComparison />
            </div>
           ) : index === 9 ? (
            <div className="w-full h-full flex items-center justify-center">
              <LanguageChart />
            </div>
          ) : index === 10 ? (
            <div className="w-full h-full flex items-center justify-center">
              <DuolingoUser />
            </div>  
          ) : index === 11 ? (
            <div className="w-full h-full flex items-center justify-center">
              <GraphAge />
            </div>
          ) : index === 12 ? (
            <div className="w-full h-full flex items-center justify-center">
              <Meme />
            </div>
          ) : index === 13 ? (
            <div className="w-full h-full flex items-center justify-center">
              <GlobeSlide />
            </div>
          ) : index === 14 ? (
            <div className="w-full h-full flex items-center justify-center">
              <GraphTop10 />
            </div>
          ) : index === 15 ? (
            <div className="w-full h-full flex items-center justify-center">
              <MotivationSlide />
            </div>
          ) : index === 16 ? (
            <div className="w-full h-full flex items-center justify-center">
              <Motivation />
            </div>
          ) : index === 17 ? (
            <div className="w-full h-full flex items-center justify-center">
              <Tech />
            </div>
          ) : index === 18 ? (
            <div className="w-full h-full flex items-center justify-center">
              <Future />
            </div>
          ) : (
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

