import { Button } from "@/components/ui/button";
import { archiveMeeting } from "@actions/meeting/archive/action";
import { toast } from "sonner";

interface DeletingModalProps {
    meetingDataId: string;
    isOpen: boolean;
    onClose: () => void;

    children?: React.ReactNode;
}
const DeletingModal: React.FC<DeletingModalProps> = ({
    meetingDataId,
    isOpen,
    onClose,
}) => {
    if (!isOpen) {
        return null;
    }

    const handleDeleteClick = async () => {
        try {
            onClose();
            await archiveMeeting(meetingDataId);
            toast.success("Meeting deleted successfully!");
        } catch (error) {
            alert("Failed to save the meeting. Please try again.");
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative max-w-lg rounded bg-white p-6 shadow-lg md:max-w-2xl lg:max-w-4xl">
                <div className="relative max-h-[vh] w-full overflow-y-auto rounded-xl border bg-white px-8 py-6 md:px-14">
                    <div className="flex flex-col gap-6">
                        <h2 className="font-bold-montserrat mb-4 text-xl">
                            Are you sure you want to delete this meeting? This
                            action cannot be undone.
                        </h2>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 text-gray-500 hover:text-black"
                >
                    &times;
                </button>
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={onClose}
                        className="mt-4 rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleDeleteClick}
                        className="mt-4 justify-end rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                    >
                        Yes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeletingModal;
