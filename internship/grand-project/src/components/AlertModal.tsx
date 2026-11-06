"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, CircleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AlertInfo = {
    title: string;
    message: string;
    variant?: "warning" | "error";
    // Optional second button, e.g. "Try again"
    actionLabel?: string;
    onAction?: () => void;
};

const variantStyles = {
    warning: {
        icon: AlertTriangle,
        iconWrap: "bg-orange-100 text-orange-600",
    },
    error: {
        icon: CircleAlert,
        iconWrap: "bg-red-100 text-red-600",
    },
};

// App-styled replacement for window.alert(). Render it with an AlertInfo to show it,
// or null to hide it.
export default function AlertModal({
    alert,
    onClose,
}: {
    alert: AlertInfo | null;
    onClose: () => void;
}) {
    const okRef = useRef<HTMLButtonElement>(null);
    // Kept in a ref so an inline onClose doesn't re-run the effect on every render
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    // Focus the button so Enter/Space dismisses it, and close on Escape
    useEffect(() => {
        if (!alert) return;
        okRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseRef.current();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [alert]);

    if (!alert) return null;

    const { icon: Icon, iconWrap } = variantStyles[alert.variant ?? "warning"];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 animate-in fade-in duration-150"
            onClick={onClose}>
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="alert-title"
                aria-describedby="alert-message"
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-orange-100 p-6 text-center animate-in zoom-in-95 fade-in duration-150">
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer">
                    <X className="h-4 w-4" />
                </button>

                <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${iconWrap}`}>
                    <Icon className="h-7 w-7" />
                </div>

                <h2
                    id="alert-title"
                    className="text-xl font-bold text-gray-800 mb-2">
                    {alert.title}
                </h2>
                <p id="alert-message" className="text-gray-600 text-sm mb-6">
                    {alert.message}
                </p>

                <div className="flex justify-center gap-3">
                    {alert.actionLabel && alert.onAction && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                onClose();
                                alert.onAction?.();
                            }}
                            className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 cursor-pointer">
                            {alert.actionLabel}
                        </Button>
                    )}
                    <Button
                        ref={okRef}
                        onClick={onClose}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 cursor-pointer">
                        OK
                    </Button>
                </div>
            </div>
        </div>
    );
}
