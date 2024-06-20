
import { TCaption } from '../types/types'

export default function ComponentList({captions}: {captions: TCaption[]}) {
  return (
    <>
      {captions.map((caption, index) => (
          <div key={index} className="p-2 border-b">
            {caption.start.toFixed(2)}s - {caption.end.toFixed(2)}s : {caption.text}
          </div>
        ))}
    </>
  )
}
