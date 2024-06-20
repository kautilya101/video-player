import { useEffect, useRef, useState } from 'react'
import { TCaption } from './types/types';
import ComponentList from './components/componentList';


const App = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [captions, setCaptions] = useState<TCaption[]>([]);
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [displayedCaption, setDisplayedCaption] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    console.log(new Date())
    if (video) {
      const updateCaption = () => {
        const currentTime = video.currentTime;
        const activeCaption = captions.find(
          caption => currentTime >= caption.start && currentTime <= caption.end
        );
        setDisplayedCaption(activeCaption ? activeCaption.text : '');
      };

      video.addEventListener('timeupdate', updateCaption);
      return () => video.removeEventListener('timeupdate', updateCaption);
    }
  }, [captions]);


  const addCaption = () => {
    const start = parseFloat(startTime);
    const end = parseFloat(endTime);

    if(!videoUrl){
      setError('No video url provided')
      return;
    }
    
    if (isNaN(start) || isNaN(end) || start >= end) {
      setError('Please enter valid start and end times.');
      return;
    }

    const newCaption: TCaption = {
      start,
      end,
      text: currentCaption,
    };
    setCaptions(prevCaptions => [...prevCaptions, newCaption]);
    setCurrentCaption('');
    setStartTime('');
    setEndTime('');
    setError('');
  };

  return (
    <div className="container mx-auto p-4">
      {error && <p className='text-center text-red-500'>{error}</p>}
      <div className="flex gap-2 items-center justify-normal my-4">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
          className="border p-2 w-full"
        />
      </div>
      {videoUrl && (
        <div className="relative">
          <video 
            ref={videoRef}
            src={videoUrl} 
            controls 
            className="w-full"
          />
          <div className="absolute bottom-8 left-0 right-0 text-center bg-black bg-opacity-50 text-white p-2">
            {displayedCaption}
          </div>
        </div>
      )}
      <div className="mt-4">
        <input
          type="text"
          value={currentCaption}
          onChange={(e) => setCurrentCaption(e.target.value)}
          placeholder="Enter caption"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="number"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="Start time (in seconds)"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="number"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="End time (in seconds)"
          className="border p-2 mb-2 w-full"
        />
        <button onClick={addCaption} className="bg-blue-500 text-white p-2 w-full">
          Add Caption
        </button>
      </div>
      <div className="mt-4">
        <h3>Captions:</h3>
        <ComponentList captions={captions}/>
      </div>
    </div>
  );
};

export default App;
