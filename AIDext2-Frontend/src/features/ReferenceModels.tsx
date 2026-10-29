// AIDetx2 - Web interface for AI-generated text detection.
// Copyright (C) 2026 Diogo Silva
// Licensed under the GNU GPL-3.0-or-later.
// See the LICENSE file for details.
import ref_binary from "./references_binary.json";
import ref_multiclass from "./references_ai.json"

function base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);

    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

export const HUMAN_BYTES =
    base64ToUint8Array(ref_binary.human_bytes).slice(0, 65536);

export const AI_BYTES =
    base64ToUint8Array(ref_binary.ai_bytes).slice(0, 65536);

export const AI_BYTES_MULTICLASS =
    base64ToUint8Array(ref_multiclass.ai_bytes).slice(0, 65536);

export type Mode = "binary" | "multiclass";

export const REFERENCES: Record<Mode, Record<string, Uint8Array>> = {
    binary:     { human_bytes: HUMAN_BYTES, ai_bytes: AI_BYTES },
    multiclass: { ai_bytes: AI_BYTES_MULTICLASS },
};