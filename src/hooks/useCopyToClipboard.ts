import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "../lib/clipboard";

type UseCopyToClipboardOptions = {
  /** How long the "copied" state persists, in ms. */
  resetDelayMs?: number;
};

/**
 * Copy a value to the clipboard with transient "copied" feedback.
 *
 * Returns:
 * - `copied`: true briefly after a successful copy.
 * - `copy`: call with a value to copy (defaults to the initial value).
 */
export function useCopyToClipboard(
  initialValue: string,
  { resetDelayMs = 2000 }: UseCopyToClipboardOptions = {},
) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copy = useCallback(
    async (value: string = initialValue) => {
      const ok = await copyText(value);
      if (ok) {
        setCopied(true);
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(
          () => setCopied(false),
          resetDelayMs,
        );
      }
    },
    [initialValue, resetDelayMs],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return { copied, copy };
}
