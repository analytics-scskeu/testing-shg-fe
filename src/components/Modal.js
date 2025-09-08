import { Fragment } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import Button from "@/components/form/Button";

export default function Modal({
    children,
    show = false,
    onClose,
    onConfirm,
    onConfirmText = "Save",
    onCancelText = "Cancel",
}) {
    const close = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center z-[100] transform transition-all"
                onClose={close}
            >
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75" />
                </TransitionChild>

                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={
                            "p-6 bg-white shadow-xl transform transition-all w-full sm:mx-auto sm:max-w-2xl z-100"
                        }
                    >
                        {children}
                        <div className="mt-6 flex justify-center gap-2">
                            {onClose && (
                                <Button type={"button"} styling={"clean"} onClick={onClose}>
                                    {onCancelText}
                                </Button>
                            )}
                            {onConfirm && (
                                <Button type={"button"} styling={"primary"} onClick={onConfirm}>
                                    {onConfirmText}
                                </Button>
                            )}
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
