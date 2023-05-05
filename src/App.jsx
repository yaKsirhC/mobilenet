import './App.css'
import * as mobilenet from "@tensorflow-models/mobilenet"
import * as tf from "@tensorflow/tfjs"
import { useEffect, useRef, useState } from 'react'
import PredictionElement from './PredictionElement'
import UnsureProbability from './UnsureProbability'

function App() {
  const [imgURL, setImgURL] = useState("")
  const [predictions, setPredictions] = useState([])
  const [config, setConfig] = useState({
    error: "",
    loading: true
  })

  const imgRef = useRef()
  async function predict() {
    const model = await mobilenet.load();
    const myRequest = new Request(imgRef.current.src);
    const resp = await fetch(myRequest)
    const blob = await resp.blob()
    const objectURL = URL.createObjectURL(blob);
    setImgURL(objectURL)
    setTimeout(async () => {
      const predictions = await model.classify(imgRef.current);
      setPredictions(predictions)
      setConfig({
        error: "",
        loading: false
      })
    }, 1000);
  }
  
  useEffect(()=> {
    setConfig({
      loading:false,
      error:""
    })
  },[])
  
  
  async function handleSubmit(e) {
    e.preventDefault()
    setConfig({
      error: "",
      loading: true
    })
    const formData = new FormData(e.target)
    const opt = formData.get('select')
    if (opt == 'url') {
      const url = formData.get("name")
      if (!url) return setConfig({
        error: "Set URL",
        loading: false
      })
      setImgURL(url)
      await predict()
    } else {
      const file = formData.get('file')
      if (file.size == 0) return setConfig({
        error: "Set File",
        loading: false
      })
      console.log(file)
      const url = window.URL.createObjectURL(file)
      setImgURL(url)
      await predict()
    }
  }
  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <select name="select" id="">
          <option value="url">URL</option>
          <option value="file">Upload</option>
        </select>
        <label htmlFor="name">Enter URL</label>
        <input placeholder='Keep in mind CORS' id='name' name='name' type="text" />
        <input name='file' type="file" />
        <button>Predict</button>
      </form>
      <img ref={imgRef} src={imgURL} alt="" />
      {
        config.loading ? (
          <p>Please stand by...</p>
        ) :
          (
            predictions.map((pred, i) => {
              if (pred.probability >= .51) {
                return <PredictionElement prediction={pred} key={i} />
              }
              if (i == 0) {
                return <UnsureProbability prediction={pred} key={i} />
              }
            })
          )
      }
      {config.error && (
        <p style={{ color: "red" }}>Error: {config.error}, or switch to the other option</p>
      )}
    </>
  )
}

export default App
