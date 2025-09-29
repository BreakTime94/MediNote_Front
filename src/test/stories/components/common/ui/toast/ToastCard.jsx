import { X } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import {
    CircleCheckBig, CircleX, TriangleAlert, Info, Loader2,
    Undo2, WifiOff, ClipboardCheck, FileWarning, LockKeyhole,
} from "lucide-react";

export default function ToastCard({
                                      type = "info",
                                      title,
                                      desc,
                                      supportId,
                                      actionLabel,
                                      onAction,
                                      t, // react-hot-toast가 제공하는 핸들
                                  }) {
    const handleClose = (e) => {
        e.preventDefault();
        toast.remove(t.id);
        // toast.dismiss(t.id);
    };

    const tone =
        ({
            success: "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100",
            error:   "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-900/30 dark:text-rose-100",
            warning: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100",
            info:    "bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-900/30 dark:text-sky-100",
            loading: "bg-zinc-50 text-zinc-900 dark:bg-zinc-900/50 dark:text-zinc-100",
            action:  "bg-indigo-50 text-indigo-900 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-100",
            offline: "bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-100",
            copied:  "bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-900/30 dark:text-sky-100",
            formerr: "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-900/30 dark:text-rose-100",
            perm:    "bg-purple-50 text-purple-900 border-purple-200 dark:bg-purple-900/30 dark:text-purple-100",
        }[type]) ?? "bg-sky-50 text-sky-900 border-sky-200";

    const Icon = (
        {
            success: <CircleCheckBig className="w-4 h-4" />,
            error:   <CircleX className="w-4 h-4" />,
            warning: <TriangleAlert className="w-4 h-4" />,
            info:    <Info className="w-4 h-4" />,
            loading: <Loader2 className="w-4 h-4 animate-spin" />,
            action:  <Undo2 className="w-4 h-4" />,
            offline: <WifiOff className="w-4 h-4" />,
            copied:  <ClipboardCheck className="w-4 h-4" />,
            formerr: <FileWarning className="w-4 h-4" />,
            perm:    <LockKeyhole className="w-4 h-4" />,
        }[type] ?? <Info className="w-4 h-4" />
    );

    const handleAction = (e) => {
        e.preventDefault();
        try {
            onAction?.();
        } finally {
            toast.dismiss(t.id);
        }
    };

    return (
        <div
            className={clsx("flex items-start gap-3 p-4 max-w-96 border rounded-2xl", tone)}
            role="status"
            aria-live="polite"
        >
            <div className={clsx("mt-0.5", type === "loading" && "animate-pulse")} aria-hidden={true}>
                {Icon}
            </div>

            <div className="flex-1">
                {title && <div className="text-sm leading-5 font-medium">{title}</div>}
                {desc && <div className="text-xs leading-5 opacity-80 mt-0.5">{desc}</div>}
                {supportId && type === "error" && (
                    <div className="text-[11px] opacity-60 mt-1">지원 코드: {supportId}</div>
                )}

                {actionLabel && onAction && (
                    <button
                        type="button"
                        className="text-xs font-medium underline underline-offset-2 mt-2"
                        onClick={handleAction}
                    >
                        {actionLabel}
                    </button>
                )}
            </div>

            <button
                type="button"
                className="opacity-70 hover:opacity-100"
                onClick={handleClose}
                aria-label="닫기"
            >
                <X className="w-4 h-4" aria-hidden="true" />
            </button>
        </div>
    );
}