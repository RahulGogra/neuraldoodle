interface PredictionsProps {
    predictions: { label: string; confidence: number }[];
}

export const Predictions = ({ predictions }: PredictionsProps) => {
    return (
        <div className="w-full p-4 bg-white shadow-lg rounded-lg border border-[#9ACBD0]">
            <h2 className="text-xl font-semibold text-[#006A71] mb-3 text-center">
                Predictions
            </h2>
            <div className="space-y-3">
                {predictions.map((pred, index) => (
                    <div
                        key={index}
                        className="p-3 bg-gray-50 border border-[#48A6A7] rounded-lg shadow-sm"
                    >
                        <div className="flex justify-between">
                            <span className="text-md font-medium text-gray-700">
                                {pred.label}
                            </span>
                            <span
                                className={`text-sm font-semibold ${
                                    pred.confidence > 75
                                        ? "text-green-600"
                                        : pred.confidence > 50
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                }`}
                            >
                                {pred.confidence}%
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 h-2 rounded-md mt-2">
                            <div
                                className={`h-2 rounded-md ${
                                    pred.confidence > 75
                                        ? "bg-green-500"
                                        : pred.confidence > 50
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{ width: `${pred.confidence}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
