/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect } from "react";

interface ClassProps {
    cls: { name: string; images: string[]; count: number };
    onAddImage: (className: string, image: string) => void;
    onDeleteClass: (className: string) => void;
    onDeleteImage: (className: string, imageIndex: number) => void;
    onEditClass: (className: string, newName: string) => void;
    openDropdownIndex: number | null;
    setOpenDropdownIndex: (index: number | null) => void;
    index: number;
}

export const Class = ({
    cls,
    onAddImage,
    onDeleteClass,
    onDeleteImage,
    onEditClass,
    openDropdownIndex,
    setOpenDropdownIndex,
    index,
}: ClassProps) => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Start camera for this class
    const startCamera = async () => {
        if (isCameraActive) return;

        try {
            const constraints = { video: { width: 640, height: 480 } };
            const stream = await navigator.mediaDevices.getUserMedia(
                constraints
            );
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsCameraActive(true);
        } catch (error) {
            console.error("Failed to access camera:", error);
            alert(
                "Failed to access camera. Please ensure your camera is connected and permissions are granted."
            );
        }
    };

    // Stop camera for this class
    const stopCamera = () => {
        if (!isCameraActive) return;

        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraActive(false);
        }
    };

    // Capture image and add it to the class
    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(videoRef.current, 0, 0, 224, 224);
        const imageBase64 = canvasRef.current.toDataURL();
        onAddImage(cls.name, imageBase64);
    };

    // Cleanup camera on component unmount
    useEffect(() => {
        const videoElement = videoRef.current;

        return () => {
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                videoElement.srcObject = null;
                setIsCameraActive(false);
            }
        };
    }, []);

    return (
        <div className="bg-white border border-[#9ACBD0] rounded-lg shadow-lg p-5">
            {/* Header with Editable Title and Dropdown */}
            <div className="relative flex justify-between items-center">
                <input
                    type="text"
                    value={cls.name}
                    onChange={(e) => onEditClass(cls.name, e.target.value)}
                    className="text-xl font-semibold text-[#006A71] bg-transparent border-b-2 border-[#9ACBD0] focus:outline-none focus:border-[#006A71] w-2/3 transition-all"
                />
                <button
                    className="text-[#006A71] hover:text-[#48A6A7] p-1 transition-all"
                    onClick={() =>
                        setOpenDropdownIndex(
                            openDropdownIndex === index ? null : index
                        )
                    }
                >
                    ⋮
                </button>

                {/* Dropdown Menu */}
                {openDropdownIndex === index && (
                    <div className="absolute right-0 top-0 mt-2 w-40 bg-white border border-[#9ACBD0] rounded-lg shadow-lg">
                        <ul className="py-2">
                            <li
                                className="px-4 py-2 text-[#006A71] hover:bg-[#9ACBD0] cursor-pointer transition-all"
                                onClick={() =>
                                    console.log("Edit class:", cls.name)
                                }
                            >
                                Edit
                            </li>
                            <li
                                className="px-4 py-2 text-[#D9534F] hover:bg-[#9ACBD0] cursor-pointer transition-all"
                                onClick={() => onDeleteClass(cls.name)}
                            >
                                Delete
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Image Count */}
            <p className="mt-3 text-sm font-medium text-[#006A71]">
                Image Samples: {cls.count}
            </p>

            {/* Camera Start/Stop Button */}
            <div className="mt-4">
                {!isCameraActive ? (
                    <button
                        className="bg-[#48A6A7] hover:bg-[#006A71] px-4 py-2 rounded-lg text-white transition-all"
                        onClick={startCamera}
                    >
                        Start Camera
                    </button>
                ) : (
                    <button
                        className="bg-[#D9534F] hover:bg-[#B52B27] px-4 py-2 rounded-lg text-white transition-all"
                        onClick={stopCamera}
                    >
                        Stop Camera
                    </button>
                )}
            </div>

            {/* Video Feed */}
            <div className={`mt-4 ${isCameraActive ? "" : "hidden"}`}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-82 h-62 rounded-lg border-2 border-[#9ACBD0]"
                />
                <canvas
                    ref={canvasRef}
                    width="224"
                    height="224"
                    className="hidden"
                />
            </div>

            {/* Capture Image Button */}
            <div className="mt-4">
                <button
                    className="bg-[#006A71] hover:bg-[#48A6A7] px-4 py-2 rounded-lg text-white transition-all"
                    onClick={captureImage}
                    disabled={!isCameraActive}
                >
                    Capture Image
                </button>
            </div>

            {/* Image Previews */}
            <div className="flex gap-2 mt-4 overflow-auto">
                {cls.images.map((img, idx) => (
                    <div key={idx} className="relative inline-block group">
                        <img
                            src={img}
                            alt="sample"
                            className="w-16 h-16 rounded-md object-cover border border-[#9ACBD0]"
                        />
                        <button
                            className="absolute top-0 right-0 bg-[#D9534F] hover:bg-[#B52B27] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => onDeleteImage(cls.name, idx)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
