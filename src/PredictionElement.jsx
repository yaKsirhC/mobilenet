import React from 'react'

export default function PredictionElement({prediction}) {
    const optMsg = prediction.probability < .75 ? "I am not sure, but I think with" : "I am sure with"
  return (
    <div>
        {optMsg} {(prediction.probability * 100).toFixed(2)}% certainty It is a {prediction.className}
    </div>
  )
}
