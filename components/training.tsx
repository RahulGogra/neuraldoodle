interface TrainingProps {
    isTraining: boolean;
    onTrainModel: () => void;
    isPredicting: boolean;
    onStartPrediction: () => void;
    onStopPrediction: () => void;
}

export const Training = ({
    isTraining,
    onTrainModel,
    isPredicting,
    onStartPrediction,
    onStopPrediction,
}: TrainingProps) => {
    return (
        <div className="bg-white p-4 shadow-lg rounded-lg w-64 text-center">
            <h2 className="text-lg font-semibold">Training</h2>
            <button
                className={`mt-3 px-4 py-2 ${
                    isTraining ? "bg-yellow-500" : "bg-green-500"
                } text-white rounded-lg`}
                onClick={onTrainModel}
                disabled={isTraining}
            >
                {isTraining ? "Training..." : "Train Model"}
            </button>

            <h2 className="text-lg font-semibold mt-4">Prediction</h2>
            <button
                className={`mt-3 px-4 py-2 ${
                    isPredicting ? "bg-yellow-500" : "bg-blue-500"
                } text-white rounded-lg`}
                onClick={isPredicting ? onStopPrediction : onStartPrediction}
            >
                {isPredicting ? "Stop Prediction" : "Start Prediction"}
            </button>
        </div>
    );
};
