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
        <div className="bg-white p-6 shadow-lg rounded-lg w-64 text-center border border-[#9ACBD0]">
            <h2 className="text-lg font-semibold text-[#006A71]">Training</h2>
            <button
                className={`mt-3 px-4 py-2 text-white rounded-lg w-full transition-all ${
                    isTraining
                        ? "bg-[#9ACBD0] cursor-not-allowed"
                        : "bg-[#48A6A7] hover:bg-[#006A71]"
                }`}
                onClick={onTrainModel}
                disabled={isTraining}
            >
                {isTraining ? "Training..." : "Train Model"}
            </button>

            <h2 className="text-lg font-semibold mt-5 text-[#006A71]">
                Prediction
            </h2>
            <button
                className={`mt-3 px-4 py-2 text-white rounded-lg w-full transition-all ${
                    isPredicting
                        ? "bg-[#9ACBD0] cursor-pointer"
                        : "bg-[#006A71] hover:bg-[#48A6A7]"
                }`}
                onClick={isPredicting ? onStopPrediction : onStartPrediction}
            >
                {isPredicting ? "Stop Prediction" : "Start Prediction"}
            </button>
        </div>
    );
};
