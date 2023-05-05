import React from 'react'

export default function UnsureProbability({prediction}) {
  return (
    <div>
        Snap! I cannot figure what this image is about.<br/> Please don't make fun of me but I think with {(prediction.probability * 100).toFixed(2)}% certainty it is a {prediction.className}
    </div>
  )
}
