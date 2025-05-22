import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { archiveMeeting } from "@actions/meeting/archive/action";
import { toast } from "sonner";

interface DeleteModalProps {
    meetingId: string;
    isOpen: boolean;
    onClose: () => void;
}
const DeleteModal = ({ meetingId, isOpen, onClose }: DeleteModalProps) => {
    if (!isOpen) {
        return null;
    }

    const handleDeleteClick = async () => {
        onClose();
        await archiveMeeting(meetingId);
        toast.success("Meeting deleted successfully!");
    };
    return (
        <Dialog open={isOpen}>
            <DialogContent className="md:max-w-1xl lg:max-h-lg overflow-y-auto rounded bg-white p-6 shadow-lg lg:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Delete Meeting</DialogTitle>
                </DialogHeader>
                <DialogDescription className="relative flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border bg-white px-8 py-6 md:px-14">
                    Are you sure you want to delete this meeting? This action
                    cannot be undone.
                </DialogDescription>
                <DialogFooter>
                    <Button
                        onClick={onClose}
                        className="mt-4 rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleDeleteClick}
                        className="mt-4 justify-end rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export { DeleteModal };
