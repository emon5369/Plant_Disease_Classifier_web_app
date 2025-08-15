import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [data, setData] = useState("")
  const url = import.meta.env.VITE_API_URL

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  const handleSubmit = async () => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Prediction result:', data);
      setData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (data) {
      console.log("Received data:", data)
    }
  }, [data])

  return (
    <>
      <h1 className='text-3xl md:text-5xl font-bold text-green-700 mb-3 text-center px-2'>Plant Disease Classifier</h1>
      <div className='relative flex flex-col items-center justify-center h-[35rem] md:h-96 border-2 rounded-3xl border-gray-700 bg-[url("/src/assets/bg.jpg")] bg-cover bg-center mx-2 md:mx-auto max-w-full md:max-w-3xl'>
        <div className='absolute inset-0 bg-black opacity-40 rounded-3xl'></div>
        <div className='relative z-10 w-full px-4 md:px-8'>
          <p className='p-2 text-gray-400 text-center text-base'>Upload an image of a plant leaf to classify its disease.</p>
          <div className='flex flex-col md:flex-row items-center justify-center gap-2'>
            <input
              type="file"
              accept="image/*"
              className='w-full md:w-auto border border-gray-300 rounded-md p-2 font-semibold bg-gray-900 text-white hover:bg-gray-800 transition duration-200 file:text-sm file:text-gray-300 file:p-1 file:border-r-2'
              onChange={handleFileChange}
            />
            <button className='w-full md:w-auto bg-blue-500 rounded-md p-2 mt-2 md:mt-0 text-white font-semibold hover:bg-blue-600 transition duration-200' onClick={handleSubmit}>
              Classify
            </button>
          </div>
          {preview && (
            <div className='flex flex-col items-center mt-4'>
              <span className='text-gray-200 mb-2'>Preview:</span>
              <img src={preview} alt='Preview' className='max-w-s max-h-32 rounded-lg shadow-lg border border-gray-400' />
            </div>
          )}
          <p className='m-2 text-center drop-shadow-lg bg-black/20 text-lg font-semibold md:text-xl'>
            {image ? <span className='text-green-600 '>Image uploaded successfully!</span> : <span className='text-red-600'>No image uploaded yet.</span>}
          </p>
          <div className='border-t border-gray-300 pt-3 flex flex-col md:flex-row gap-2'>
            <p className='border-2 p-2 m-2 rounded-2xl flex-1 text-center bg-black/30'>
              <u>Class:</u>
              <i className='font-semibold pl-1'>
                {data ? data.disease_name : "None"}
              </i>
            </p>
            <p className='border-2 p-2 m-2 rounded-2xl flex-1 text-center bg-black/30'>
              <u>Confidence:</u>
              <i className='font-semibold pl-1'>
                {data ? data.confidence : "0.00 %"}
              </i>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App