import { RefObject } from "react";

interface CameraProps {
    isCameraActive: boolean;
    onStartCamera: () => void;
    onStopCamera: () => void;
    videoRef: RefObject<HTMLVideoElement | null>; // Allow null in the ref type
}

export const Camera = ({
    isCameraActive,
    onStartCamera,
    onStopCamera,
    videoRef,
}: CameraProps) => {
    return (
        <div>
            <div className="flex justify-center gap-4">
                {!isCameraActive ? (
                    <button
                        className="bg-green-500 px-6 py-2 rounded-lg"
                        onClick={onStartCamera}
                    >
                        Start Camera
                    </button>
                ) : (
                    <button
                        className="bg-red-500 px-6 py-2 rounded-lg"
                        onClick={onStopCamera}
                    >
                        Stop Camera
                    </button>
                )}
            </div>
            <div className={`mt-4 ${isCameraActive ? "" : "hidden"}`}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-96 h-64 rounded-lg border-2 border-gray-300"
                />
            </div>
        </div>
    );
};
