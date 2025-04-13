"use client";
import { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import { Class } from "../components/class";
import { AddClass } from "../components/addClass";
import { Training } from "@/components/training";
import { Predictions } from "@/components/prediction";
import toast from "react-hot-toast";

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
    const [mobilenetModel, setMobilenetModel] =
        useState<mobilenet.MobileNet | null>(null);
    const classifier = useRef(knnClassifier.create());
    const predictionIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const predictionVideoRef = useRef<HTMLVideoElement | null>(null);
    const predictionCanvasRef = useRef<HTMLCanvasElement | null>(null);

    /** 🔄 Load & Train Model */
    const trainModel = async () => {
        // Validate classes before training
        if (classes.length < 2) {
            toast.error("❌ At least two classes are required for training!", {
                duration: 3000,
            });
            return;
        }

        if (classes.some((cls) => cls.images.length === 0)) {
            toast.error("❌ Each class must have at least one image!", {
                duration: 3000,
            });
            return;
        }

        setIsTraining(true);
        console.log("🔄 Loading MobileNet model...");
        try {
            const model = await mobilenet.load();
            setMobilenetModel(model);
            console.log("✅ MobileNet model loaded!");
            await trainClassifier(model);
            setTimeout(() => {
                toast.success("✅ Model trained successfully!", {
                    duration: 3000,
                });
            }, 2000);
        } catch (error) {
            console.error("❌ Failed to load MobileNet model:", error);
            toast.error("❌ Failed to load the model!", { duration: 3000 });
        }
        setIsTraining(false);
    };

    /** 🚀 Train Classifier */
    const trainClassifier = async (model: mobilenet.MobileNet) => {
        console.log("🚀 Training the classifier...");
        for (const cls of classes) {
            for (const imageSrc of cls.images) {
                const img = new Image();
                img.src = imageSrc;
                await new Promise((resolve) => {
                    img.onload = async () => {
                        const imageTensor = tf.browser.fromPixels(img);
                        const activation = model.infer(imageTensor, true);
                        classifier.current.addExample(activation, cls.name);
                        imageTensor.dispose();
                        tf.dispose(activation);
                        resolve(true);
                    };
                });
            }
        }
        console.log("✅ Model trained with collected images.");
    };

    /** 📸 Add Image to Class */
    const addImageToClass = (className: string, image: string) => {
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
    };

    /** 🎥 Start Prediction */
    const startPrediction = async () => {
        if (!mobilenetModel) {
            toast.error("❌ Model not trained yet! Train it first.", {
                duration: 3000,
            });
            return;
        }
        setIsPredicting(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (predictionVideoRef.current) {
                predictionVideoRef.current.srcObject = stream;
                await predictionVideoRef.current.play();
                console.log("🎥 Video stream started");
                predictionIntervalRef.current = setInterval(
                    () => predictClass(),
                    1000
                );
            }
        } catch (error) {
            console.error("❌ Failed to start prediction camera:", error);
            toast.error("❌ Failed to start camera!", { duration: 3000 });
            setIsPredicting(false);
        }
    };

    /** 🛑 Stop Prediction */
    const stopPrediction = () => {
        if (predictionIntervalRef.current) {
            clearInterval(predictionIntervalRef.current);
            predictionIntervalRef.current = null;
        }

        if (predictionVideoRef.current?.srcObject) {
            (predictionVideoRef.current.srcObject as MediaStream)
                .getTracks()
                .forEach((track) => track.stop());
            predictionVideoRef.current.srcObject = null;
        }

        setIsPredicting(false);
        console.log("🛑 Stopped predictions.");
    };

    /** 🔮 Predict Class */
    const predictClass = async () => {
        if (
            !mobilenetModel ||
            !predictionVideoRef.current ||
            !classifier.current
        ) {
            console.error("❌ Missing model, video, or classifier.");
            return;
        }

        const video = predictionVideoRef.current;
        const image = tf.browser.fromPixels(video);
        const activation = mobilenetModel.infer(image, true);

        try {
            const result = await classifier.current.predictClass(activation);

            if (result && result.label) {
                setPredictions(
                    Object.keys(result.confidences).map((label) => ({
                        label,
                        confidence: Math.round(result.confidences[label] * 100),
                    }))
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

    /** 🏗️ Export & Download KNN Model */
    const exportModel = () => {
        if (!classifier.current) {
            toast.error("❌ No trained model to export!", { duration: 3000 });
            return;
        }

        const dataset = classifier.current.getClassifierDataset();
        const datasetJSON = JSON.stringify(
            Object.fromEntries(
                Object.entries(dataset).map(([label, tensor]) => [
                    label,
                    Array.from(tensor.dataSync()),
                ])
            )
        );

        const blob = new Blob([datasetJSON], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "knn-classifier.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("✅ Model exported successfully!", { duration: 3000 });
        console.log("✅ Model exported and downloaded!");
    };

    /** Cleanup */
    useEffect(() => {
        return () => {
            if (predictionIntervalRef.current)
                clearInterval(predictionIntervalRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col p-6 pt-15 bg-[#F2EFE7] pl-25">
            <div className="flex space-x-4">
                <div className="h-150 overflow-y-auto border-2 p-2 border-[#9ACBD0] rounded-lg mr-6">
                    {/* Class Management */}
                    <div className="w-1xl space-y-4 mt-6">
                        {classes.map((cls, index) => (
                            <Class
                                key={index}
                                cls={cls}
                                onAddImage={addImageToClass}
                                onDeleteClass={(className) =>
                                    setClasses((prev) =>
                                        prev.filter(
                                            (cls) => cls.name !== className
                                        )
                                    )
                                }
                                onDeleteImage={(className, imageIndex) =>
                                    setClasses((prev) =>
                                        prev.map((cls) =>
                                            cls.name === className
                                                ? {
                                                      ...cls,
                                                      images: cls.images.filter(
                                                          (_, idx) =>
                                                              idx !== imageIndex
                                                      ),
                                                      count: cls.count - 1,
                                                  }
                                                : cls
                                        )
                                    )
                                }
                                onEditClass={(className, newName) =>
                                    setClasses((prev) =>
                                        prev.map((cls) =>
                                            cls.name === className
                                                ? { ...cls, name: newName }
                                                : cls
                                        )
                                    )
                                }
                                openDropdownIndex={openDropdownIndex}
                                setOpenDropdownIndex={setOpenDropdownIndex}
                                index={index}
                            />
                        ))}
                    </div>
                    {/* Add Class */}
                    <AddClass
                        onAddClass={(className) =>
                            setClasses([
                                ...classes,
                                { name: className, images: [], count: 0 },
                            ])
                        }
                    />
                </div>

                {/* Training & Prediction Section */}
                <div className="flex items-center space-x-5 mt-6">
                    <div className="flex flex-col">
                        <Training
                            isTraining={isTraining}
                            onTrainModel={trainModel}
                            isPredicting={isPredicting}
                            onStartPrediction={startPrediction}
                            onStopPrediction={stopPrediction}
                            isDisabled={
                                isTraining ||
                                classes.length < 2 ||
                                classes.some((cls) => cls.images.length === 0)
                            }
                        />
                        <button
                            onClick={exportModel}
                            className={`mt-4 px-4 py-2 rounded-lg transition ${
                                isTraining || !mobilenetModel
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#48A6A7] text-white hover:bg-[#006A71]"
                            }`}
                            disabled={isTraining || !mobilenetModel}
                        >
                            📥 Export & Download Model
                        </button>
                    </div>

                    {isPredicting && (
                        <div className="bg-white p-4 shadow-lg rounded-lg w-64 text-center border-2 border-[#9ACBD0]">
                            <Predictions predictions={predictions} />
                            <div className="mt-6">
                                <video
                                    ref={predictionVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`rounded-lg border-2 border-[#48A6A7] ${
                                        isPredicting ? "block" : "hidden"
                                    }`}
                                    width="224"
                                    height="224"
                                />
                                <canvas
                                    ref={predictionCanvasRef}
                                    width="224"
                                    height="224"
                                    className="hidden"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
