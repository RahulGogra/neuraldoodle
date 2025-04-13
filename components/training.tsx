import React, { useState, useEffect } from "react";

interface TrainingProps {
    isTraining: boolean;
    onTrainModel: () => void;
    isPredicting: boolean;
    onStartPrediction: () => void;
    onStopPrediction: () => void;
    isDisabled: boolean;
}

export const Training = ({
    isTraining,
    onTrainModel,
    isPredicting,
    onStartPrediction,
    onStopPrediction,
    isDisabled,
}: TrainingProps) => {
    const [trainCount, setTrainCount] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [animationActive, setAnimationActive] = useState(false);

    // Pulse animation when training/predicting starts
    useEffect(() => {
        if (isTraining || isPredicting) {
            setAnimationActive(true);
            const timer = setTimeout(() => setAnimationActive(false), 700);
            return () => clearTimeout(timer);
        }
    }, [isTraining, isPredicting]);

    // Track elapsed time during prediction
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isPredicting) {
            timer = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else {
            setElapsedTime(0);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isPredicting]);

    // Format seconds to MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    // Simulate training progress
    const handleTrain = () => {
        if (!isDisabled) {
            setTrainCount((prev) => prev + 1);
            onTrainModel();
        }
    };

    // Custom progress indicator
    const ProgressIndicator = () => (
        <div
            className={`flex justify-center mt-2 ${
                isPredicting ? "visible" : "invisible"
            }`}
        >
            <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 w-2 rounded-full bg-[#48A6A7] opacity-60 animate-pulse`}
                        style={{ animationDelay: `${i * 0.15}s` }}
                    ></div>
                ))}
            </div>
        </div>
    );

    return (
        <div
            className={`bg-white p-6 shadow-lg rounded-lg w-72 border-2 ${
                animationActive ? "border-[#006A71]" : "border-[#9ACBD0]"
            } transition-all duration-300`}
        >
            {/* Header section */}
            <div className="mb-5 text-center">
                <h2 className="text-xl font-bold text-[#006A71]">
                    Model Controls
                </h2>
                <div className="h-1 w-16 bg-[#9ACBD0] mx-auto mt-2"></div>
            </div>

            {/* Training section */}
            <div className="mb-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#006A71]">
                        Training
                    </h3>
                    {trainCount > 0 && (
                        <span className="bg-[#F2EFE7] text-[#48A6A7] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {trainCount}{" "}
                            {trainCount === 1 ? "session" : "sessions"}
                        </span>
                    )}
                </div>

                <button
                    className={`relative w-full px-4 py-3 text-white rounded-lg font-medium transition-all ${
                        isTraining || isDisabled
                            ? "bg-[#9ACBD0] cursor-not-allowed opacity-60"
                            : "bg-gradient-to-r from-[#48A6A7] to-[#006A71] hover:shadow-md"
                    }`}
                    onClick={handleTrain}
                    disabled={isTraining || isPredicting || isDisabled}
                >
                    <div className="flex items-center justify-center">
                        {isTraining && (
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        )}
                        {isTraining ? "Training in progress..." : "Train Model"}
                    </div>
                </button>

                {isDisabled && (
                    <p className="text-xs text-red-500 text-center mt-2">
                        ⚠️ At least two classes with images are required.
                    </p>
                )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#F2EFE7] mb-4"></div>

            {/* Prediction section */}
            <div className="relative">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#006A71]">
                        Prediction
                    </h3>
                    {isPredicting && (
                        <div className="bg-[#48A6A7] text-white text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                            <span className="mr-1">⏱️</span>
                            {formatTime(elapsedTime)}
                        </div>
                    )}
                </div>

                <button
                    className={`relative w-full px-4 py-3 text-white rounded-lg font-medium transition-all ${
                        isPredicting
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-md"
                            : "bg-gradient-to-r from-[#006A71] to-[#48A6A7] hover:shadow-md"
                    }`}
                    onClick={
                        isPredicting ? onStopPrediction : onStartPrediction
                    }
                    disabled={isTraining || isDisabled}
                >
                    {isPredicting ? "Stop Prediction" : "Start Prediction"}
                </button>

                <ProgressIndicator />

                {isPredicting && (
                    <p className="text-xs text-[#48A6A7] text-center mt-3">
                        Analyzing webcam input in real-time...
                    </p>
                )}
            </div>

            {/* Status indicator */}
            <div className="mt-6 flex items-center justify-center">
                <div
                    className={`h-2 w-2 rounded-full ${
                        isPredicting
                            ? "bg-green-500 animate-pulse"
                            : "bg-gray-300"
                    } mr-2`}
                ></div>
                <span className="text-xs text-[#006A71]">
                    {isPredicting ? "Prediction active" : "Prediction inactive"}
                </span>
            </div>
        </div>
    );
};
