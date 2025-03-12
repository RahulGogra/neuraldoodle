"use client";
import { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import { Class } from "../components/class";
import { AddClass } from "../components/addClass";
import { Training } from "@/components/training";
import { Predictions } from "@/components/prediction";

export default function TeachableMachine() {
    const [classes, setClasses] = useState<
        { name: string; images: string[]; count: number }[]
    >([
        { name: "Class 1", images: [], count: 0 },
        { name: "Class 2", images: [], count: 0 },
    ]);
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
        null
    );
    const [predictions, setPredictions] = useState<
        { label: string; confidence: number }[]
    >([]);
    const [isPredicting, setIsPredicting] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const predictionIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [mobilenetModel, setMobilenetModel] =
        useState<mobilenet.MobileNet | null>(null);
    const classifier = useRef(knnClassifier.create());
    const predictionVideoRef = useRef<HTMLVideoElement | null>(null);
    const predictionCanvasRef = useRef<HTMLCanvasElement | null>(null);

    // Load MobileNet model
    useEffect(() => {
        const loadModel = async () => {
            try {
                const model = await mobilenet.load();
                setMobilenetModel(model);
                console.log("✅ MobileNet model loaded!");
            } catch (error) {
                console.error("Failed to load MobileNet model:", error);
            }
        };
        loadModel();
    }, []);

    // Add image to a class
    const addImageToClass = async (className: string, image: string) => {
        if (!mobilenetModel) return;

        const img = new Image();
        img.src = image;
        img.onload = async () => {
            const imageTensor = tf.browser.fromPixels(img);
            const activation = mobilenetModel.infer(imageTensor, true);
            classifier.current.addExample(activation, className);

            setClasses((prev) =>
                prev.map((cls) =>
                    cls.name === className
                        ? {
                              ...cls,
                              images: [...cls.images, image],
                              count: cls.count + 1,
                          }
                        : cls
                )
            );

            // Dispose of tensors to avoid memory leaks
            imageTensor.dispose();
            tf.dispose(activation);
        };
    };

    // Delete a class
    const deleteClass = (className: string) => {
        setClasses((prev) => prev.filter((cls) => cls.name !== className));
        setOpenDropdownIndex(null);
    };

    // Delete an image from a class
    const deleteImageFromClass = (className: string, imageIndex: number) => {
        setClasses((prev) =>
            prev.map((cls) =>
                cls.name === className
                    ? {
                          ...cls,
                          images: cls.images.filter(
                              (_, idx) => idx !== imageIndex
                          ),
                          count: cls.count - 1,
                      }
                    : cls
            )
        );
    };

    // Edit a class name
    const editClass = (className: string, newName: string) => {
        setClasses((prev) =>
            prev.map((cls) =>
                cls.name === className ? { ...cls, name: newName } : cls
            )
        );
    };

    // Train the model
    const trainModel = async () => {
        setIsTraining(true);
        console.log("Training model...");

        // Simulate a delay of 2 seconds (2000 milliseconds)
        await new Promise((resolve) => setTimeout(resolve, 3500));

        console.log("Model trained with current data.");
        setIsTraining(false);
    };

    // Start prediction
    const startPrediction = async () => {
        if (!predictionVideoRef.current || !mobilenetModel) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            predictionVideoRef.current.srcObject = stream;
            predictionVideoRef.current.play();
            setIsPredicting(true);

            predictionIntervalRef.current = setInterval(async () => {
                await predictClass();
            }, 1000);
        } catch (error) {
            console.error("Failed to start prediction camera:", error);
        }
    };

    // Stop prediction
    const stopPrediction = () => {
        if (
            predictionVideoRef.current &&
            predictionVideoRef.current.srcObject
        ) {
            const stream = predictionVideoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            predictionVideoRef.current.srcObject = null;
        }
        setIsPredicting(false);
        if (predictionIntervalRef.current) {
            clearInterval(predictionIntervalRef.current);
            predictionIntervalRef.current = null;
        }
    };

    // Predict class
    const predictClass = async () => {
        if (
            !mobilenetModel ||
            !predictionVideoRef.current ||
            !predictionCanvasRef.current
        )
            return;

        const ctx = predictionCanvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(predictionVideoRef.current, 0, 0, 224, 224);
        const image = tf.browser.fromPixels(predictionCanvasRef.current);
        const activation = mobilenetModel.infer(image, true);
        const result = await classifier.current.predictClass(activation);

        setPredictions(
            Object.keys(result.confidences).map((label) => ({
                label,
                confidence: Math.round(result.confidences[label] * 100),
            }))
        );

        // Dispose of tensors to avoid memory leaks
        image.dispose();
        tf.dispose(activation);
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (predictionIntervalRef.current) {
                clearInterval(predictionIntervalRef.current);
                predictionIntervalRef.current = null;
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-6">Teachable Machine Clone</h1>

            <div className="flex space-x-4">
                <div>
                    {/* Class Sections */}
                    <div className="w-2xl space-y-4 mt-6">
                        {classes.map((cls, index) => (
                            <Class
                                key={index}
                                cls={cls}
                                onAddImage={addImageToClass}
                                onDeleteClass={deleteClass}
                                onDeleteImage={deleteImageFromClass}
                                onEditClass={editClass}
                                openDropdownIndex={openDropdownIndex}
                                setOpenDropdownIndex={setOpenDropdownIndex}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Add Class Section */}
                    <AddClass
                        onAddClass={(className) =>
                            setClasses([
                                ...classes,
                                { name: className, images: [], count: 0 },
                            ])
                        }
                    />
                </div>

                {/* Training and Predictions Section */}
                <div className="flex items-center space-x-5 mt-6">
                    <Training
                        isTraining={isTraining}
                        onTrainModel={trainModel}
                        isPredicting={isPredicting}
                        onStartPrediction={startPrediction}
                        onStopPrediction={stopPrediction}
                    />
                    <div className="bg-white p-4 shadow-lg rounded-lg w-64 text-center">
                        <Predictions predictions={predictions} />
                        {/* Prediction Camera Feed */}
                        <div className={`mt-6 ${isPredicting ? "" : "hidden"}`}>
                            <video
                                ref={predictionVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="rounded-lg border-2 border-gray-300"
                            />
                            <canvas
                                ref={predictionCanvasRef}
                                width="224"
                                height="224"
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
