// AIDetx2 - Web interface for AI-generated text detection.
// Copyright (C) 2026 Diogo Silva
// Licensed under the GNU GPL-3.0-or-later.
// See the LICENSE file for details.
import "./Home.css";
import TextScanner from "../components/TextClassifierBox/TextClassifierBox";
import TextScannerAPI from "../components/TextClassifierBox/TextClassifierBoxAPI";
import { useMode } from "../context/ModeContext";

function Home() {
    const { useLocal } = useMode();

    return (
        <>
            {/* <div className="mode-switch-container">
                <span className={!useLocal ? "inactive-label" : ""}>
                    ⚡ Local
                </span>

                <label className="switch">
                    <input
                        type="checkbox"
                        checked={!useLocal}
                        onChange={() => setUseLocal((u) => !u)}
                    />
                    <span className="slider"></span>
                </label>

                <span className={useLocal ? "inactive-label" : ""}>
                    ☁ Backend
                </span>
            </div> */}

            {useLocal ? <TextScanner /> : <TextScannerAPI />}
        </>
    );
}

export default Home;