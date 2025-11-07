import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const url = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setData(""); // Clear previous results
      setError(""); // Clear errors
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Prediction result:", data);
      setData(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to classify image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      console.log("Received data:", data);
    }
  }, [data]);

  const getSeverityColor = (diseaseName) => {
    if (!diseaseName) return "";
    if (diseaseName.includes("healthy")) return "text-green-400";
    if (diseaseName.includes("Bacterial") || diseaseName.includes("blight"))
      return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center py-2 md:py-4 px-3 md:px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-2 md:mb-4 animate-fade-in">
          <h1 className="text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent mb-1 md:mb-2 drop-shadow-2xl">
            🌿 Plant Disease Classifier
          </h1>
          <p className="text-gray-300 text-sm md:text-lg font-light">
            AI-Powered Plant Health Analysis
          </p>
        </div>

        {/* Main Card */}
        <div className="relative flex flex-col items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-green-500/20">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>

          <div className="relative z-10 w-full p-3 md:p-6 space-y-3 md:space-y-4">
            {/* Instructions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2 md:p-3">
              <p className="text-gray-200 text-center text-xs md:text-base font-medium">
                📸 Upload a clear image of a plant leaf for instant disease
                detection
              </p>
            </div>

            {/* Upload Section */}
            <div className="flex flex-col md:flex-row items-center justify-around gap-2 md:gap-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer group w-full md:w-auto"
              >
                <div className="flex items-center justify-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-white font-bold text-sm">
                    Choose Image
                  </span>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <button
                className={`w-full md:w-auto px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl shadow-lg hover:shadow-blue-500/50 text-white font-bold text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  loading ? "animate-pulse" : ""
                }`}
                onClick={handleSubmit}
                disabled={!image || loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "🔍 Analyze Disease"
                )}
              </button>
            </div>

            {/* Status Message */}
            {image && !loading && !data && (
              <div className="flex items-center justify-center gap-2 p-2 md:p-2.5 rounded-xl bg-green-500/20 border border-green-500/30 animate-fade-in">
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-300 font-semibold text-xs md:text-sm">
                  Image uploaded successfully!
                </span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center gap-2 p-2 md:p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 animate-fade-in">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-300 font-semibold text-xs md:text-sm">
                  {error}
                </span>
              </div>
            )}

            {/* Preview and Results Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Image Preview */}
              {preview ? (
                <div className="flex flex-col items-center justify-center p-2 md:p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl animate-slide-up min-h-[220px] md:min-h-[280px]">
                  <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                    <svg
                      className="w-4 h-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="text-gray-200 font-semibold text-xs md:text-sm">
                      Image Preview
                    </span>
                  </div>
                  <div className="relative group w-full flex items-center justify-center">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-w-[250px] md:max-w-xs max-h-40 md:max-h-52 object-contain rounded-xl shadow-2xl border-2 border-white/20 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-2 md:p-3 bg-white/5 backdrop-blur-sm border border-white/10 border-dashed rounded-2xl min-h-[220px] md:min-h-[280px]">
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mb-1.5 md:mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-300 text-xs md:text-sm font-medium mb-0.5 md:mb-1">
                    No Image Selected
                  </p>
                  <p className="text-gray-400 text-xs text-center">
                    Upload an image to see the preview
                  </p>
                </div>
              )}

              {/* Results */}
              {data ? (
                <div className="flex flex-col gap-2 md:gap-3 p-2 md:p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl animate-slide-up min-h-[220px] md:min-h-[280px]">
                  <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                    <svg
                      className="w-4 h-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-200 font-semibold text-xs md:text-sm">
                      Analysis Results
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 p-2 md:p-3 rounded-xl">
                    <p className="text-gray-300 text-xs mb-1 md:mb-1.5">
                      Disease Detected:
                    </p>
                    <p
                      className={`text-base md:text-lg font-bold ${getSeverityColor(
                        data.disease_name
                      )} break-words leading-relaxed`}
                    >
                      {data.disease_name
                        ? data.disease_name.replace(/_/g, " ")
                        : "None"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 p-2 md:p-3 rounded-xl">
                    <p className="text-gray-300 text-xs mb-1 md:mb-1.5">
                      Confidence Level:
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg md:text-xl font-bold text-cyan-300">
                        {data.confidence || "0.00 %"}
                      </p>
                      {parseFloat(data.confidence) > 90 && (
                        <span className="text-xs bg-green-500/30 text-green-300 px-2 py-0.5 rounded-full font-semibold">
                          High
                        </span>
                      )}
                      {parseFloat(data.confidence) <= 90 &&
                        parseFloat(data.confidence) >= 70 && (
                          <span className="text-xs bg-yellow-500/30 text-yellow-300 px-2 py-0.5 rounded-full font-semibold">
                            Medium
                          </span>
                        )}
                      {parseFloat(data.confidence) < 70 && (
                        <span className="text-xs bg-red-500/60 text-red-200 px-2 py-0.5 rounded-full font-semibold">
                          Low
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-2 md:p-3 bg-white/5 backdrop-blur-sm border border-white/10 border-dashed rounded-2xl min-h-[220px] md:min-h-[280px]">
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mb-1.5 md:mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <p className="text-gray-300 text-xs md:text-sm font-medium mb-0.5 md:mb-1">
                    No Results Yet
                  </p>
                  <p className="text-gray-400 text-xs text-center">
                    Upload and analyze an image to see results
                  </p>
                </div>
              )}
            </div>

            {/* Info Footer */}
            <div className="pt-3 border-t border-white/10">
              <p className="text-gray-400 text-xs text-center">
                ⚡ Powered by TensorFlow & FastAPI • Supports Tomato, Potato &
                Pepper plants
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
