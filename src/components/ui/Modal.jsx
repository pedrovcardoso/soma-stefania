'use client';

import { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { MdClose } from 'react-icons/md';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = 'max-w-md',
    showCloseButton = true
}) {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className={`relative transform overflow-hidden rounded-2xl bg-surface text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-border`}>
                                <div className="bg-surface px-6 pt-6 pb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        {title && (
                                            <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-text">
                                                {title}
                                            </Dialog.Title>
                                        )}
                                        {showCloseButton && (
                                            <button
                                                type="button"
                                                className="rounded-full p-1 text-text-muted hover:text-text hover:bg-surface-alt transition-colors outline-none"
                                                onClick={onClose}
                                            >
                                                <MdClose size={20} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        {children}
                                    </div>
                                </div>
                                {footer && (
                                    <div className="bg-surface-alt/50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-border">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
