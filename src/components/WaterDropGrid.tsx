import Spline from '@splinetool/react-spline'
import anime from 'animejs'
import { useEffect } from 'react'

const WaterDropGrid = () => {
  return (
    <div className='relative grid h-full place-content-center bg-black px-8'>
        <DotGrid />
        <div className='w-40 h-16 bg-black absolute bottom-0 right-0 z-20' />
        <div className='absolute self-center h-full w-full z-10'>
            <Spline scene="https://prod.spline.design/LAHlqMs26UNKhB7g/scene.splinecode" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
const GRID_WIDTH = 35
const GRID_HEIGHT = 30

const DotGrid = () => {
    const handleDotClick = (e: any) => {
        anime({
            targets: '.dot-point',
            scale: [
                { value: 1.35, easing: 'easeOutSine', duration: 250 },
                { value: 1, easing: 'easeInOutQuad', duration: 500 }
            ],
            translateY: [
                { value: -15, easing: 'easeOutSine', duration: 250 },
                { value: 0, easing: 'easeInOutQuad', duration: 500 }
            ],
            opacity: [
                { value: 1, easing: 'easeOutSine', duration: 250 },
                { value: 0.5, easing: 'easeInOutQuad', duration: 500 } 
            ],
            delay: anime.stagger(100, { grid: [GRID_WIDTH, GRID_HEIGHT], from: e.target.getAttribute('date-index') })
        })
    }
    const dots = []
    let index = 0

    for(let x = 0; x < GRID_WIDTH; x++) {
        for(let y = 0; y < GRID_HEIGHT; y++) {
            dots.push(
                <div   
                    onClick={handleDotClick}
                    className='group cursor-crosshair rounded-full p-2 transition-colors hover:bg-pink-600'
                    date-index={index} 
                    key={`${x}-${y}`}
                >
                    <div 
                        className='dot-point w-2 h-2 rounded-full bg-gradient-to-b from-pink-700 to-slate-400 opacity-50 group-hover:from-indigo-600 group-hover:to-white'
                        date-index={index}
                    />
                </div>
            )
            index++;
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * (GRID_WIDTH * GRID_HEIGHT))
            const syntheticEvent = {
                target: {
                    getAttribute: () => randomIndex
                }
            }
            handleDotClick(syntheticEvent)
        }, 5000)
        return () => clearInterval(intervalId)
    }, [])
    
    return (
        <div
            style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)` }}
            className='grid w-fit'
        > 
            {dots}
        </div>
    )
}


export default WaterDropGrid
