"use client";
import { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";

// Custom SVG icons to replace Lucide React
const IconUpload = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const IconCamera = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

const IconAlert = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const IconX = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default function ImportModel() {
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictions, setPredictions] = useState<
        { label: string; confidence: number }[]
    >([]);
    const [uploadTime, setUploadTime] = useState<string | null>(null);
    const [predictionStartTime, setPredictionStartTime] = useState<
        string | null
    >(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [dragActive, setDragActive] = useState(false);

    const classifier = useRef(knnClassifier.create());
    const mobilenetModel = useRef<mobilenet.MobileNet | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const uploadTimeRef = useRef<Date | null>(null);
    const predictionInterval = useRef<NodeJS.Timeout | null>(null);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);

    // Timer for tracking elapsed prediction time
    useEffect(() => {
        if (isPredicting && !timerInterval.current) {
            timerInterval.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else if (!isPredicting && timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
            setElapsedTime(0);
        }

        return () => {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
            }
        };
    }, [isPredicting]);

    // Format seconds into MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    // Handle drag events
    const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    // Trigger file input click
    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    /** 📂 Process uploaded file */
    const processFile = async (file: File) => {
        if (!file) return;

        uploadTimeRef.current = new Date();
        setUploadTime(uploadTimeRef.current.toLocaleTimeString());

        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!e.target?.result) return;

            try {
                const datasetJSON = JSON.parse(e.target.result as string);
                const dataset = Object.fromEntries(
                    Object.entries(datasetJSON).map(([label, data]) => {
                        const values = data as number[];
                        const numFeatures = 1024; // MobileNet feature size
                        const numSamples = values.length / numFeatures;

                        if (values.length % numFeatures !== 0) {
                            console.error(
                                `❌ Data shape error: Cannot reshape ${values.length} elements into 2D.`
                            );
                            return [label, null];
                        }

                        return [
                            label,
                            tf.tensor2d(values, [numSamples, numFeatures]),
                        ];
                    })
                );

                classifier.current.setClassifierDataset(
                    dataset as { [label: string]: tf.Tensor2D }
                );
                setIsModelLoaded(true);

                // Calculate and log loading time
                const loadTime =
                    new Date().getTime() - uploadTimeRef.current!.getTime();
                console.log(`✅ Model imported successfully in ${loadTime}ms!`);
            } catch (error) {
                console.error("❌ Failed to load model:", error);
            }
        };
        reader.readAsText(file);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    /** 🎥 Start Webcam */
    const startWebcam = async () => {
        const startTime = new Date();
        setPredictionStartTime(startTime.toLocaleTimeString());
        setIsPredicting(true);

        if (!mobilenetModel.current) {
            console.log("⏳ Loading MobileNet...");
            mobilenetModel.current = await mobilenet.load();
            const loadTime = new Date().getTime() - startTime.getTime();
            console.log(`✅ MobileNet loaded in ${loadTime}ms!`);
        }

        try {
            console.log("⏳ Starting webcam...");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                // 🛑 Wait for the webcam to load before starting predictions
                await new Promise((resolve) => {
                    videoRef.current!.onloadedmetadata = () => resolve(true);
                });

                await videoRef.current.play();

                const webcamTime = new Date().getTime() - startTime.getTime();
                console.log(`✅ Webcam started in ${webcamTime}ms!`);
            }

            predictionInterval.current = setInterval(
                () => predictClass(),
                1000
            );
            console.log("🎥 Webcam started for predictions.");
        } catch (error) {
            console.error("❌ Webcam access error:", error);
            setIsPredicting(false);
        }
    };

    /** 🛑 Stop Webcam */
    const stopWebcam = () => {
        setIsPredicting(false);

        if (predictionInterval.current) {
            clearInterval(predictionInterval.current);
            predictionInterval.current = null;
        }

        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream)
                .getTracks()
                .forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }

        console.log("🛑 Webcam stopped.");
    };

    /** 🔮 Predict Class */
    const predictClass = async () => {
        if (
            !mobilenetModel.current ||
            !videoRef.current ||
            !classifier.current
        ) {
            console.error("❌ Model, webcam, or classifier missing.");
            return;
        }

        const video = videoRef.current;
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error("❌ Webcam is not providing frames.");
            return;
        }

        const predStart = performance.now();
        const image = tf.browser.fromPixels(video);
        const activation = mobilenetModel.current.infer(image, true);

        try {
            const result = await classifier.current.predictClass(activation);

            if (result?.label) {
                setPredictions(
                    Object.keys(result.confidences)
                        .map((label) => ({
                            label,
                            confidence: Math.round(
                                result.confidences[label] * 100
                            ),
                        }))
                        .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
                );

                const predEnd = performance.now();
                console.log(
                    `⏱️ Prediction completed in ${Math.round(
                        predEnd - predStart
                    )}ms`
                );
            } else {
                console.warn("⚠️ No predictions received.");
            }
        } catch (error) {
            console.error("❌ Prediction error:", error);
        }

        image.dispose();
        tf.dispose(activation);
    };

    useEffect(() => {
        return () => {
            if (predictionInterval.current) {
                clearInterval(predictionInterval.current);
            }
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center p-6 bg-[#F2EFE7] pt-25">
            <div className="w-full max-w-3xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#006A71]">
                        Model Inference
                    </h1>
                    <p className="text-[#48A6A7] mt-2">
                        Upload a trained model and start real-time predictions
                    </p>
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#9ACBD0]">
                    {/* Model Upload Section */}
                    <div className="p-6 border-b border-[#9ACBD0]">
                        <div className="flex items-center mb-4">
                            <IconUpload />
                            <h2 className="ml-2 text-xl font-semibold text-[#006A71]">
                                Upload Model
                            </h2>
                        </div>

                        <label
                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                dragActive
                                    ? "border-[#006A71] bg-[#E2F5F6]"
                                    : "border-[#9ACBD0] hover:bg-gray-50"
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                        Drop your model file here
                                    </span>{" "}
                                    or click to browse
                                </p>
                                <p className="text-xs text-gray-500">
                                    Upload your TensorFlow.js model (.json)
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="hidden"
                                accept=".json"
                                onChange={handleFileChange}
                            />
                        </label>

                        {uploadTime && (
                            <div className="mt-4 text-sm text-gray-600">
                                <span className="font-medium">
                                    Model uploaded at:
                                </span>{" "}
                                {uploadTime}
                            </div>
                        )}

                        {isModelLoaded && (
                            <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md flex items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L5 6.6L7 8.6L11 4.6L12.4 6L7 11.4Z"
                                        fill="#10B981"
                                    />
                                </svg>
                                <span className="ml-2 text-green-700">
                                    Model loaded successfully!
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Prediction Section */}
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <IconCamera />
                            <h2 className="ml-2 text-xl font-semibold text-[#006A71]">
                                Real-time Prediction
                            </h2>
                        </div>

                        <div className="mb-6">
                            {!isPredicting ? (
                                <button
                                    onClick={startWebcam}
                                    disabled={!isModelLoaded}
                                    className={`flex items-center justify-center px-4 py-2 rounded-md ${
                                        isModelLoaded
                                            ? "bg-[#006A71] text-white hover:bg-[#005057] transition-colors"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    <IconCamera />
                                    <span className="ml-2">Start Webcam</span>
                                </button>
                            ) : (
                                <button
                                    onClick={stopWebcam}
                                    className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    <IconX />
                                    <span className="ml-2">Stop Webcam</span>
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Webcam Feed */}
                            <div className="flex-1">
                                <div className="relative bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        className="w-full h-64 object-cover"
                                        autoPlay
                                        playsInline
                                        muted
                                    ></video>

                                    {isPredicting && (
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                            {formatTime(elapsedTime)}
                                        </div>
                                    )}

                                    {!isPredicting && !isModelLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 text-white">
                                            <div className="text-center p-4">
                                                <IconAlert />
                                                <p className="mt-2">
                                                    Upload a model to start
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {!isPredicting && isModelLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 text-white">
                                            <div className="text-center p-4">
                                                <IconCamera />
                                                <p className="mt-2">
                                                    Click &quot;Start
                                                    Webcam&quot; to begin
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Predictions */}
                            <div className="flex-1">
                                <div className="border border-[#9ACBD0] rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
                                    <h3 className="font-medium text-[#006A71] mb-3">
                                        Prediction Results
                                    </h3>

                                    {predictionStartTime && isPredicting && (
                                        <div className="text-xs text-gray-500 mb-3">
                                            Started at: {predictionStartTime}
                                        </div>
                                    )}

                                    {predictions.length > 0 ? (
                                        <div className="space-y-3">
                                            {predictions.map(
                                                (prediction, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-white p-3 rounded border border-gray-200"
                                                    >
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium text-gray-800">
                                                                {
                                                                    prediction.label
                                                                }
                                                            </span>
                                                            <span className="text-sm font-medium text-[#006A71]">
                                                                {
                                                                    prediction.confidence
                                                                }
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-[#48A6A7] h-2 rounded-full"
                                                                style={{
                                                                    width: `${prediction.confidence}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : isPredicting ? (
                                        <div className="flex items-center justify-center h-40 text-gray-500">
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-40 text-gray-500">
                                            No predictions yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer with Information */}
                    <div className="p-4 bg-gray-50 border-t border-[#9ACBD0] text-xs text-gray-500">
                        <div className="flex items-center">
                            <IconAlert />
                            <p className="ml-2">
                                This application runs TensorFlow.js locally in
                                your browser. No data is sent to any server.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
