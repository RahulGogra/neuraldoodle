interface PredictionsProps {
    predictions: { label: string; confidence: number }[];
}

export const Predictions = ({ predictions }: PredictionsProps) => {
    return (
        <>
            <h2 className="text-lg font-semibold">Predictions</h2>
            <div className="mt-4">
                {predictions.map((pred, index) => (
                    <div
                        key={index}
                        className="p-2 bg-gray-100 rounded-lg my-2"
                    >
                        {pred.label} - {pred.confidence}%
                    </div>
                ))}
            </div>
        </>
    );
};
