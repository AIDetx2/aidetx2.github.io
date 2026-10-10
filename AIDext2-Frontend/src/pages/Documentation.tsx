import { useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import './Documentation.css'

interface NavItem {
  id: string
  label: string
  icon: string
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [{ id: 'overview', label: 'Introduction', icon: 'ti-home' }],
  },
  {
    label: 'Usage',
    items: [
      { id: 'tool', label: 'How it works', icon: 'ti-scan' },
      { id: 'window', label: 'Window segmentation', icon: 'ti-layout-columns' },
    ],
  },
  {
    label: 'Architecture',
    items: [
        { id: 'arch', label: 'Architecture Overview', icon: 'ti-sitemap' },
        { id: 'arch-backend', label: 'Backend architecture', icon: 'ti-server-2' },
        { id: 'arch-local', label: 'Local architecture', icon: 'ti-device-laptop' },
        { id: 'comparison', label: 'Local vs Backend', icon: 'ti-arrows-left-right' },
    ],
  },
  {
    label: 'Features',
    items: [
      { id: 'app-features', label: 'App features', icon: 'ti-sparkles' },
    ],
  },
  {
    label: 'Reference',
    items: [
        { id: 'faq', label: 'FAQ', icon: 'ti-help-circle' },
        { id: 'limitations', label: 'Limitations', icon: 'ti-alert-triangle' },
    ],
  },
  {
    label: 'Resources',
    items: [{ id: 'github', label: 'GitHub', icon: 'ti-brand-github' }],
  },
]

const appFeatures = [
    {
        icon: 'ti-robot',
        name: 'AI / Human detection',
        desc: 'Classifies submitted text as either human-written or AI-generated using the trained detection models.',
    },
    {
        icon: 'ti-files',
        name: 'Hybrid text detection',
        desc: 'Classifies documents as hybrid when they contain a mixture of human-written and AI-generated text, identifying cases where both types of content are present.',
    },
    {
        icon: 'ti-brain',
        name: 'AI model detection',
        desc: 'For AI-generated text, identifies the most likely source model from the supported generator classes.',
    },
    {
        icon: 'ti-layout-columns',
        name: 'Segment-level analysis',
        desc: 'Analyzes overlapping text segments independently, allowing AI-generated regions to be identified within a larger document.',
    },
    {
        icon: 'ti-gauge',
        name: 'Document confidence',
        desc: 'Combines segment-level predictions into a document-level confidence score and final classification.',
    },
    {
        icon: 'ti-highlight',
        name: 'Segment highlighting',
        desc: 'Highlights analyzed text segments according to their predictions, making potentially AI-generated regions easy to locate.',
    },
    {
        icon: 'ti-device-laptop',
        name: 'Local inference',
        desc: 'Runs detection directly in the browser using ONNX Runtime Web and WebAssembly, keeping submitted text on the user’s device.',
    },
    {
        icon: 'ti-server-2',
        name: 'Backend inference',
        desc: 'Sends text to the FastAPI backend for server-side processing and inference without requiring local model execution.',
    },
    {
        icon: 'ti-upload',
        name: 'File upload',
        desc: 'Upload TXT, DOCX, or PDF files and extract their text directly into the scanner for analysis.',
    },
    {
        icon: 'ti-arrows-split',
        name: 'Automatic window segmentation',
        desc: 'Choose between character- and word-based segmentation while the appropriate window size and stride are determined automatically from the document length.',
    },
    {
        icon: 'ti-target',
        name: 'Generator attribution',
        desc: 'Identifies the most common detected generator among AI-flagged segments and presents it in the analysis results.',
    },
]

const faqItems = [
  {
    q: 'What file types are supported?',
    a: '.txt, .docx, and .pdf. Text is extracted automatically when a file is uploaded.',
  },
  {
    q: 'What languages are supported?',
    a: (
      <>
        Currently, only English text is supported. The extracted features and
        trained models were built and tuned on English-language data, so
        results on other languages are unverified and may be unreliable.
      </>
    ),
  },
  {
    q: 'Is my text stored anywhere?',
    a: (
      <>
        In the local version, no — analysis happens entirely in your browser.
        In the backend version, submitted text is sent to the API for
        processing.{' '}
        <a href="#comparison">See Local vs. Backend</a> for more information
        about the two inference modes.
      </>
    ),
  },
  {
    q: 'How accurate is AIDetX2?',
    a: (
      <>
        Accuracy depends on the text and the type of detection being
        performed. Very short inputs provide less information for the models,
        while heavily edited AI-generated text can make detection more
        difficult. Results on languages other than English are also currently
        unverified. Confidence scores should therefore be treated as an
        indication rather than a certainty.
      </>
    ),
  },
  {
    q: 'Is there a file size limit?',
    a: (
      <>
        There is no specific file size limit imposed on uploaded documents,
        although very large files may require more time and resources to
        process. Pasted or typed text in the input area is limited to 100,000
        characters.
      </>
    ),
  },
  {
    q: 'Can I use AIDetx2 offline?',
    a: (
      <>
        Yes. The local version performs inference directly in the browser,
        without sending the text to the backend. It can be used offline once
        the required application resources have been loaded.{' '}
        <a href="#comparison">See Local vs. Backend</a> for more information.
      </>
    ),
  },
  {
    q: 'Can I use AIDetx2 to prove someone used AI to write something?',
    a: (
      <>
        No. No AI detector, including AIDetX2, should be treated as definitive
        proof that a text was written by AI. Detection results are probabilistic
        signals, and both false positives and false negatives can occur,
        particularly with short or heavily edited text. Results should be
        considered alongside other evidence rather than used as the sole basis
        for an accusation or decision.
      </>
    ),
  },
  {
    q: 'What is the difference between AI detection and model detection?',
    a: (
      <>
        AI detection determines whether a text is more likely to have been
        written by a human or generated by AI. Model detection goes one step
        further by attempting to identify which supported AI generator is most
        likely responsible for AI-flagged text.
      </>
    ),
  },
  {
    q: 'What AI models can AIDetx2 detect?',
    a: (
      <>
        Model detection currently supports the AI generator classes included
        in the trained models, including GPT-OSS, DeepSeek, LLaMA, Mistral 7B and Mistral Nemo.
        Model attribution is probabilistic and should be interpreted as the
        most likely supported generator rather than definitive identification.
      </>
    ),
  },
  {
    q: 'Can AIDetx2 identify AI models it was not trained on?',
    a: (
        <>
        Model attribution is limited to the generator classes supported by the
        trained models. Text generated by an unseen LLM may be misclassified,
        and attribution performance may be lower for such generators.
        AIDetx2 does not currently provide a dedicated label for unseen LLMs;
        instead, it may assign the text to one of the supported generator classes.
        Therefore, model attribution should be interpreted as a prediction
        among the supported classes, not as definitive identification of the
        actual generator.
        </>
    ),
  },
  {
    q: 'Why can local and backend results differ slightly?',
    a: (
      <>
        Both inference modes use the same underlying detection models and
        feature definitions. However, feature extraction is implemented in
        different languages, so some feature values may differ slightly
        between the local and backend implementations. These differences are
        not expected to meaningfully affect the final classification results.
        <a href="#comparison">See Local vs. Backend</a> for more information.
      </>
    ),
  },
]


export default function Documentation() {
    const [activeId, setActiveId] = useState('overview')
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const location = useLocation()

    useEffect(() => {
        // 1. Define the observer to watch section visibility
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            // If a section is in view (intersecting), set it as active
            // threshold: 0.5 means when 50% of the section is visible
            if (entry.isIntersecting) {
                setActiveId(entry.target.id)
            }
            })
        },
        {rootMargin: '-20% 0% -35% 0%', threshold: 0.05 }
        )

        // 2. Observe all sections that have an ID
        const sections = document.querySelectorAll('.docs-section')
        sections.forEach((section) => observer.observe(section))

        return () => {
        sections.forEach((section) => observer.unobserve(section))
        }
    }, [])

    // 2. Scroll to the hash target whenever it changes (including on first load)
    useEffect(() => {
        if (!location.hash) return

        const id = location.hash.slice(1) // strip the leading "#"
        // small delay lets the DOM finish rendering before we try to scroll
        const timeout = setTimeout(() => {
            const el = document.getElementById(id)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setActiveId(id)
            }
        }, 50)

        return () => clearTimeout(timeout)
    }, [location.hash])
    return (
        <div className="docs-shell">
        <aside className="docs-sidebar">
            {navGroups.map((group) => (
            <div className="docs-nav-group" key={group.label}>
                <div className="docs-nav-group-label">{group.label}</div>

                {group.items.map((item) => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`docs-nav-item ${activeId === item.id ? 'active' : ''}`}
                >
                    <i className={`ti ${item.icon}`} aria-hidden="true" />
                    {item.label}
                </a>
                ))}
            </div>
            ))}
        </aside>

        <main className="docs-main">
            <div className="docs-content">

                {/* ───────────────── Overview ───────────────── */}

                <section className="docs-section" id="overview">
                    <div className="docs-eyebrow">Overview</div>

                    <h2 className="docs-title">Introduction</h2>

                    <p className="docs-lead">
                        AIDetx2 is an AI-generated text detection platform that analyzes written content to determine whether it was written by a human or generated by an AI model, with support for identifying the most likely generating model. Distinguishing AI-generated text from human writing is an increasingly important but challenging problem, particularly as generated text becomes more similar to natural human writing and can be further modified or combined with human-written content. AIDetx2addresses this problem through a lightweight detection pipeline that can run either locally in the browser or through a backend service.
                    </p>

                    <hr className="docs-divider" />

                    <h3 className="docs-h2">What does it do?</h3>

                    <p className="docs-prose">
                        AIDetx2 splits each submitted text into overlapping segments using a
                        sliding window approach, then analyzes each segment independently to
                        produce its own prediction. These segment-level predictions are then
                        combined into a single document-level result.
                    </p>

                    <p className="docs-prose">
                        This segment-first approach allows AIDetx2 to catch mixed or partially
                        AI-generated content that a single whole-document prediction would
                        miss. Depending on the length of the input, the text may be processed
                        as one segment or split into many — see{' '}
                        <a href="#window">Sliding Window Segmentation</a> for exactly how that's
                        determined.
                    </p>

                    <p className="docs-prose">
                        At the end of this process, AIDetx2 reports:
                    </p>

                    <ul className="docs-list">
                        <li>
                            <strong>Human vs. AI detection</strong> — classifies text as
                            human-written, AI-generated, or hybrid, containing a mixture of
                            human-written and AI-generated content.
                        </li>
                        <li>
                            <strong>Model attribution</strong> — for AI-generated text,
                            identifies the most likely source model.
                        </li>
                    </ul>

                    <p className="docs-prose">
                        AIDetx2 is available in two forms: a{' '}
                        <a href="#arch-backend">backend-hosted version</a> that runs
                        detection server-side, and a{' '}
                        <a href="#arch-local">fully local version</a> that runs entirely
                        in-browser with no data leaving your device. See{' '}
                        <a href="#comparison">Local vs. Backend</a> for help choosing
                        between them.
                    </p>

                </section>
                {/* ───────────────── Tool ───────────────── */}

                <section className="docs-section" id="tool">
                    <div className="docs-eyebrow">Usage</div>

                    <h2 className="docs-title">How it works</h2>

                    <p className="docs-lead">
                        AIDetx2 analyzes text through a multi-stage detection pipeline
                        that combines segment-level predictions into a final document
                        classification.
                    </p>

                    <hr className="docs-divider" />

                    <h3 className="docs-h2">Detection pipeline</h3>

                   <p className="docs-prose">
                        When a document is submitted, the text first goes through a
                        preprocessing stage, where formatting inconsistencies, spacing
                        issues, and unsupported characters are normalized.
                    </p>

                    <p className="docs-prose">
                        The document is then divided into smaller, overlapping segments
                        using a <a href="#window">sliding window approach</a>. For each
                        segment, <a href="/models#extracted_features">information-theoretic,
                        lexical, and structural features</a> are extracted and analyzed
                        by the selected Machine Learning model.
                    </p>

                    <p className="docs-prose">
                        The predictions generated for each segment are then combined by
                        averaging their confidence scores across the document, producing a
                        single document-level classification. This smooths out noise from
                        any individual segment and improves overall detection stability
                        compared to relying on a single prediction alone.
                    </p>

                    <div className="docs-pipeline">
                        <div className="docs-diagram">
                            <svg width="100%" viewBox="0 0 680 680" style={{ fontFamily: 'inherit' }} role="img" aria-labelledby="pipeline-diagram-title">
                                <title id="pipeline-diagram-title">Detection pipeline, from input document to final classification</title>
                                <defs>
                                <marker id="arrowP" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M2 1L8 5L2 9" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </marker>
                                </defs>

                                {/* 1. Input document */}
                                <rect x="190" y="20" width="300" height="44" rx="8" fill="#fff" stroke="#333" strokeWidth="1" />
                                <text x="340" y="46" textAnchor="middle" fontSize="14">Input document</text>
                                <line x1="340" y1="64" x2="340" y2="104" stroke="#333" strokeWidth="1" markerEnd="url(#arrowP)" />

                                {/* 2. Preprocessing */}
                                <rect x="190" y="104" width="300" height="56" rx="8" fill="#fff" stroke="#333" strokeWidth="1" />
                                <text x="340" y="126" textAnchor="middle" fontSize="14">Preprocessing</text>
                                <text x="340" y="146" textAnchor="middle" fontSize="12" fill="#666">normalize formatting &amp; encoding</text>
                                <line x1="340" y1="160" x2="340" y2="200" stroke="#333" strokeWidth="1" markerEnd="url(#arrowP)" />

                                {/* 3. Sliding window segmentation */}
                                <rect x="190" y="200" width="300" height="56" rx="8" fill="#fff" stroke="#333" strokeWidth="1" />
                                <text x="340" y="222" textAnchor="middle" fontSize="14">Sliding window segmentation</text>
                                <text x="340" y="242" textAnchor="middle" fontSize="12" fill="#666">overlapping character/word blocks</text>
                                <line x1="340" y1="256" x2="340" y2="296" stroke="#333" strokeWidth="1" markerEnd="url(#arrowP)" />

                                {/* 4. Feature extraction */}
                                <rect x="190" y="296" width="300" height="56" rx="8" fill="#fff" stroke="#333" strokeWidth="1" />
                                <text x="340" y="318" textAnchor="middle" fontSize="14">Feature extraction</text>
                                <text x="340" y="338" textAnchor="middle" fontSize="12" fill="#666">per-segment stylometric features</text>
                                <line x1="340" y1="352" x2="340" y2="392" stroke="#333" strokeWidth="1" markerEnd="url(#arrowP)" />

                                {/* 5. Model prediction */}
                                <rect x="190" y="392" width="300" height="56" rx="8" fill="#fff" stroke="#333" strokeWidth="1" />
                                <text x="340" y="414" textAnchor="middle" fontSize="14">Model prediction</text>
                                <text x="340" y="434" textAnchor="middle" fontSize="12" fill="#666">per-segment confidence score</text>
                                <line x1="340" y1="448" x2="340" y2="488" stroke="#333" strokeWidth="1" markerEnd="url(#arrowP)" />

                                {/* 6. Aggregation */}
                                <rect x="190" y="488" width="300" height="56" rx="8" fill="#eef2fb" stroke="#333" strokeWidth="1" />
                                <text x="340" y="510" textAnchor="middle" fontSize="14">Aggregation</text>
                                <text x="340" y="530" textAnchor="middle" fontSize="12" fill="#666">average confidence across segments</text>
                                <line x1="340" y1="544" x2="340" y2="584" stroke="#333" strokeWidth="1" markerEnd="url(#arrowP)" />

                                {/* 7. Final classification */}
                                <rect x="190" y="584" width="300" height="56" rx="8" fill="#eef7ee" stroke="#333" strokeWidth="1" />
                                <text x="340" y="606" textAnchor="middle" fontSize="14">Final classification</text>
                                <text x="340" y="626" textAnchor="middle" fontSize="12" fill="#666">Human / AI + model attribution</text>
                            </svg>
                        </div>
                        <p className="docs-diagram-caption">
                        The detection pipeline: each document is preprocessed, segmented, and
                        scored per-segment before those scores are aggregated into one final
                        result.
                        </p>
                    </div>
                </section>

                {/* ───────────────── Window ───────────────── */}

                <section className="docs-section" id="window">

                    <h2 className="docs-title">Sliding Window Segmentation</h2>

                    <p className="docs-lead">
                        AIDetx2 uses an overlapping sliding-window strategy to divide documents into
                        smaller text segments that are analyzed independently by the detection models.
                    </p>

                    <hr className="docs-divider" />

                    <p className="docs-prose">
                        Rather than processing an entire document as a single input, the text is divided
                        into multiple overlapping segments. This allows AIDetx2 to identify localized
                        AI-generated patterns across different regions of the document.
                    </p>

                    <p className="docs-prose">
                        This approach is particularly useful for hybrid documents containing both
                        human-written and AI-generated content. By analyzing each segment independently,
                        AIDetx2 can identify isolated AI-generated regions even when they are embedded
                        within predominantly human-written text.
                    </p>

                    <p className="docs-prose">
                        Consecutive segments overlap to preserve context between neighboring regions and
                        reduce boundary effects. The amount of overlap is determined by the stride, which
                        is automatically calculated together with the window size based on the length of
                        the submitted text. The user does not need to configure these values manually.
                    </p>

                    <p className="docs-prose">
                        For example, a character-based configuration with a window size of 500 characters
                        and a stride of 250 means that each new segment starts 250 characters after the
                        previous one, resulting in a 50% overlap between consecutive segments.
                    </p>

                    <p className="docs-prose">
                        AIDetx2 supports two segmentation modes: word-based and character-based.
                        The user selects the segmentation mode, while the system automatically determines
                        the appropriate window size and stride according to the document length.
                        Smaller documents may be processed as a single segment, while larger documents
                        are divided into multiple overlapping segments for more detailed segment-level
                        analysis.
                    </p>

                    <hr className="docs-divider" />

                    <div className="docs-table-wrapper">
                        <table className="docs-table">
                            <thead>
                                <tr>
                                    <th>Mode</th>
                                    <th>Document length</th>
                                    <th>Window</th>
                                    <th>Stride</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Character</td>
                                    <td>&lt; 1,000 chars</td>
                                    <td>Direct</td>
                                    <td>—</td>
                                </tr>
                                <tr>
                                    <td>Character</td>
                                    <td>1,000–4,999</td>
                                    <td>500</td>
                                    <td>250</td>
                                </tr>
                                <tr>
                                    <td>Character</td>
                                    <td>5,000–14,999</td>
                                    <td>750</td>
                                    <td>375</td>
                                </tr>
                                <tr>
                                    <td>Character</td>
                                    <td>15,000+</td>
                                    <td>1,000</td>
                                    <td>500</td>
                                </tr>
                                <tr>
                                    <td>Word</td>
                                    <td>&lt; 200 words</td>
                                    <td>Direct</td>
                                    <td>—</td>
                                </tr>
                                <tr>
                                    <td>Word</td>
                                    <td>200–999</td>
                                    <td>100</td>
                                    <td>50</td>
                                </tr>
                                <tr>
                                    <td>Word</td>
                                    <td>1,000–2,999</td>
                                    <td>150</td>
                                    <td>75</td>
                                </tr>
                                <tr>
                                    <td>Word</td>
                                    <td>3,000+</td>
                                    <td>200</td>
                                    <td>100</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                   {/*  <div className="docs-feature-grid">
                    <div className="docs-feature-card">
                        <div className="docs-feature-icon">
                        <i className="ti ti-text-size" />
                        </div>

                        <div className="docs-feature-name">
                        Character mode
                        </div>

                        <div className="docs-feature-desc">
                        <br />
                        <strong>Behavior:</strong><br />
                        • &lt; 1,000 chars → single prediction<br />
                        • 1,000–4,999 → block 500 / stride 250<br />
                        • 5,000–14,999 → block 750 / stride 375<br />
                        • 15,000+ → block 1,000 / stride 500
                        </div>
                    </div>

                    <div className="docs-feature-card">
                        <div className="docs-feature-icon">
                        <i className="ti ti-align-left" />
                        </div>

                        <div className="docs-feature-name">
                        Word mode
                        </div>

                        <div className="docs-feature-desc">
                        <br />
                        <strong>Behavior:</strong><br />
                        • &lt; 200 words → single prediction<br />
                        • 200–999 → block 100 / stride 50<br />
                        • 1,000–2,999 → block 150 / stride 75<br />
                        • 3,000+ → block 200 / stride 100
                        </div>
                    </div>
                    </div> */}
                </section>

                <section className="docs-section" id="arch">
                    <div className="docs-eyebrow">Architecture</div>

                    <h2 className="docs-title">Architecture Overview</h2>

                    <p className="docs-lead">
                        AIDetx2 supports two inference modes: <strong>Local</strong> and{' '}
                        <strong>Backend</strong>. Both provide the same core detection functionality,
                        but differ in where text processing and model inference take place.
                    </p>

                    <hr className="docs-divider" />

                    <p className="docs-prose">
                        In <strong>Local mode</strong>, the detection pipeline runs directly in the
                        user's browser. Text processing and inference are performed client-side using
                        <strong> ONNX Runtime Web</strong> and WebAssembly, allowing the submitted text
                        to remain on the user's device.
                    </p>

                    <p className="docs-prose">
                        In <strong>Backend mode</strong>, the frontend sends the submitted text to a
                        <strong> FastAPI</strong> REST API, where processing and inference are performed
                        on the server. The resulting predictions are then returned to the frontend
                        for presentation.
                    </p>

                    <p className="docs-prose">
                        These two approaches provide different trade-offs between privacy, offline
                        availability, and computational resources. The following sections describe
                        each architecture in more detail and compare their main characteristics.
                    </p>
                </section>

                {/* ───────────────── Backend Architecture ───────────────── */}
                <section className="docs-section" id="arch-backend">

                    <h2 className="docs-title">Backend Architecture</h2>

                    <p className="docs-lead">
                        In Backend mode, text processing and model inference are performed on the
                        server through a FastAPI-based REST API. The frontend communicates with the
                        API for each analysis request, and the resulting predictions are returned
                        to the browser.
                    </p>

                    <hr className="docs-divider" />

                    <h3 className="docs-h2">How a request flows through the system</h3>
                    
                    <p className="docs-prose">
                        The React + Vite frontend sends the submitted text to the FastAPI REST API.
                        The backend then processes the input, normalizing and segmenting the text
                        when necessary before preparing it for inference.
                    </p>

                    <p className="docs-prose">
                        The backend supports two model families: classical{' '}
                        <a href="/models#ml">Machine Learning</a> classifiers,
                        which operate on the extracted feature set, and{' '}
                        <a href="/models#dl">Deep Learning</a> models (BERT-based),
                        which operate directly on the text. After inference, the prediction results
                        are returned by FastAPI to the frontend for presentation.
                    </p>

                    <div className="docs-note">
                        <i className="ti ti-alert-circle" aria-hidden="true" />
                        <div>
                            <strong>Note:</strong> the deployed backend currently uses only the
                            Machine Learning models. The Deep Learning (BERT) models are implemented
                            and available in the codebase, but are not active in production because
                            of the resource requirements of the hosting environment.
                        </div>
                    </div>

                    {/* <div className="docs-diagram">
                        <svg width="100%" viewBox="0 0 680 610" style={{ fontFamily: 'inherit' }}>
                            <defs>
                            <marker id="arrowB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M2 1L8 5L2 9" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </marker>
                            </defs>

                            
                            <rect x="310" y="16" width="100" height="36" rx="18" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="39" textAnchor="middle" fontSize="14">User</text>
                            <line x1="360" y1="52" x2="360" y2="104" stroke="#333" strokeWidth="1" markerEnd="url(#arrowB)" />

                            
                            <rect x="220" y="70" width="280" height="90" rx="10" fill="#f5f7fb" stroke="#3355aa" strokeWidth="1" />
                            <text x="236" y="90" fontSize="13" fontWeight="600" fill="#3355aa">Frontend</text>
                            <rect x="270" y="104" width="180" height="44" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="130" textAnchor="middle" fontSize="14">React + Vite</text>

                            
                            <line x1="360" y1="160" x2="360" y2="270" stroke="#333" strokeWidth="1" markerStart="url(#arrowB)" markerEnd="url(#arrowB)" />
                            <rect x="330" y="204" width="80" height="20" fill="#eee" />
                            <text x="370" y="218" textAnchor="middle" fontSize="12" fill="#555">REST API</text>

                            
                            <rect x="150" y="230" width="440" height="340" rx="10" fill="#f7f7f7" stroke="#333" strokeWidth="1" />
                            <text x="166" y="250" fontSize="13" fontWeight="600">Backend</text>

                            <rect x="280" y="270" width="160" height="44" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="296" textAnchor="middle" fontSize="14">FastAPI REST API</text>
                            <line x1="360" y1="314" x2="360" y2="350" stroke="#333" strokeWidth="1" markerEnd="url(#arrowB)" />

                            <rect x="280" y="350" width="160" height="44" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="376" textAnchor="middle" fontSize="14">Text processing</text>
                            <line x1="360" y1="394" x2="360" y2="430" stroke="#333" strokeWidth="1" markerEnd="url(#arrowB)" />

                            <rect x="280" y="430" width="160" height="44" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="456" textAnchor="middle" fontSize="14">Detection models</text>

                            <path d="M360 474 L360 490 L260 490 L260 506" fill="none" stroke="#333" strokeWidth="1" markerEnd="url(#arrowB)" />

                            <rect x="180" y="506" width="160" height="44" rx="6" fill="#eef2fb" stroke="#333" strokeWidth="1" />
                            <text x="260" y="532" textAnchor="middle" fontSize="14">Machine learning</text>

                            <path d="M440 452 C 555 452 555 292 440 292" fill="none" stroke="#333" strokeWidth="1" markerEnd="url(#arrowB)" />
                        </svg>
                    </div> */}

                    <div className="docs-diagram">
                        <svg width="100%" viewBox="0 0 680 610" style={{ fontFamily: 'inherit' }}>
                            <defs>
                                <marker
                                    id="arrowB"
                                    viewBox="0 0 10 10"
                                    refX="8"
                                    refY="5"
                                    markerWidth="6"
                                    markerHeight="6"
                                    orient="auto-start-reverse"
                                >
                                    <path
                                        d="M2 1L8 5L2 9"
                                        fill="none"
                                        stroke="#333"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </marker>
                            </defs>

                            {/* User */}
                            <rect
                                x="310"
                                y="16"
                                width="100"
                                height="36"
                                rx="18"
                                fill="#fff"
                                stroke="#333"
                                strokeWidth="1"
                            />
                            <text x="360" y="39" textAnchor="middle" fontSize="14">
                                User
                            </text>

                            <line
                                x1="360"
                                y1="52"
                                x2="360"
                                y2="104"
                                stroke="#333"
                                strokeWidth="1"
                                markerEnd="url(#arrowB)"
                            />

                            {/* Frontend container */}
                            <rect
                                x="220"
                                y="70"
                                width="280"
                                height="90"
                                rx="10"
                                fill="#f5f7fb"
                                stroke="#3355aa"
                                strokeWidth="1"
                            />
                            <text
                                x="236"
                                y="90"
                                fontSize="13"
                                fontWeight="600"
                                fill="#3355aa"
                            >
                                Frontend
                            </text>

                            <rect
                                x="270"
                                y="104"
                                width="180"
                                height="44"
                                rx="6"
                                fill="#fff"
                                stroke="#333"
                                strokeWidth="1"
                            />
                            <text x="360" y="130" textAnchor="middle" fontSize="14">
                                React + Vite
                            </text>

                            {/* REST API bidirectional arrow */}
                            <line
                                x1="360"
                                y1="160"
                                x2="360"
                                y2="270"
                                stroke="#333"
                                strokeWidth="1"
                                markerStart="url(#arrowB)"
                                markerEnd="url(#arrowB)"
                            />

                            <rect x="330" y="204" width="80" height="20" fill="#eee" />
                            <text x="370" y="218" textAnchor="middle" fontSize="12" fill="#555">
                                REST API
                            </text>

                            {/* Backend container */}
                            <rect
                                x="150"
                                y="230"
                                width="440"
                                height="340"
                                rx="10"
                                fill="#f7f7f7"
                                stroke="#333"
                                strokeWidth="1"
                            />
                            <text x="166" y="250" fontSize="13" fontWeight="600">
                                Backend
                            </text>

                            <rect
                                x="280"
                                y="270"
                                width="160"
                                height="44"
                                rx="6"
                                fill="#fff"
                                stroke="#333"
                                strokeWidth="1"
                            />
                            <text x="360" y="296" textAnchor="middle" fontSize="14">
                                FastAPI REST API
                            </text>

                            <line
                                x1="360"
                                y1="314"
                                x2="360"
                                y2="350"
                                stroke="#333"
                                strokeWidth="1"
                                markerEnd="url(#arrowB)"
                            />

                            <rect
                                x="280"
                                y="350"
                                width="160"
                                height="44"
                                rx="6"
                                fill="#fff"
                                stroke="#333"
                                strokeWidth="1"
                            />
                            <text x="360" y="376" textAnchor="middle" fontSize="14">
                                Text processing
                            </text>

                            <line
                                x1="360"
                                y1="394"
                                x2="360"
                                y2="430"
                                stroke="#333"
                                strokeWidth="1"
                                markerEnd="url(#arrowB)"
                            />

                            <rect
                                x="280"
                                y="430"
                                width="160"
                                height="44"
                                rx="6"
                                fill="#fff"
                                stroke="#333"
                                strokeWidth="1"
                            />
                            <text x="360" y="456" textAnchor="middle" fontSize="14">
                                Detection models
                            </text>

                            <path
                                d="M360 474 L360 506"
                                fill="none"
                                stroke="#333"
                                strokeWidth="1"
                                markerEnd="url(#arrowB)"
                            />

                            <rect
                                x="280"
                                y="506"
                                width="160"
                                height="44"
                                rx="6"
                                fill="#eef2fb"
                                stroke="#333"
                                strokeWidth="1"
                            />

                            <text x="360" y="532" textAnchor="middle" fontSize="14">
                                Machine learning
                            </text>


                            {/* Return path to FastAPI */}
                            <path
                                d="M440 452 C555 452 555 292 440 292"
                                fill="none"
                                stroke="#333"
                                strokeWidth="1"
                                markerEnd="url(#arrowB)"
                            />
                        </svg>
                        <p className="docs-diagram-caption">
                            Backend inference flow: the submitted text is sent from the frontend to
                            FastAPI, processed on the server, and passed to the Machine Learning models
                            before the prediction is returned.
                        </p>
                    </div>

                     <p className="docs-prose">
                        Because inference is performed on the server, the backend is not limited by
                        the computational and memory constraints of the user's device. This makes it
                        possible to deploy models and processing pipelines that may be impractical to
                        run directly in the browser. The trade-off is that each analysis requires a
                        network connection and a round-trip between the frontend and backend.
                    </p>
                </section>

                {/* ───────────────── Local Architecture ───────────────── */}

                <section className="docs-section" id="arch-local">

                    <h2 className="docs-title">Local Architecture</h2>

                    <p className="docs-lead">
                        In Local mode, text processing and model inference run entirely in the
                        browser. No server round-trip is required, and the submitted text never
                        leaves the user's device.
                    </p>

                    <hr className="docs-divider" />

                    <h3 className="docs-h2">How a request flows through the system</h3>

                    <p className="docs-prose">
                        Instead of sending the submitted text to a remote API, the React + Vite
                        frontend passes it to a local inference engine running in the browser.
                        The engine performs the required text processing and feature extraction
                        before passing the prepared input to <strong>ONNX Runtime Web</strong>,
                        which executes the detection models locally using WebAssembly.
                    </p>

                    <p className="docs-prose">
                        As with the backend mode, detection relies on the same Machine Learning
                        classifiers. The difference is that inference is performed directly in
                        the browser using ONNX Runtime Web, with WebAssembly providing the
                        execution environment instead of a Python server process.
                    </p>

                    <div className="docs-note">
                        <i className="ti ti-alert-circle" aria-hidden="true" />
                        <div>
                            <strong>Note:</strong> the local version does not currently support
                            the Deep Learning (BERT) models. The trained models are too large
                            to run efficiently in the browser, so only the Machine Learning
                            classifiers are available client-side.
                        </div>
                    </div>

                    {/* <div className="docs-diagram">
                        <svg width="100%" viewBox="0 0 680 660" style={{ fontFamily: 'inherit' }}>
                            <defs>
                            <marker id="arrowL" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M2 1L8 5L2 9" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </marker>
                            </defs>

                            <rect x="310" y="16" width="100" height="36" rx="18" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="39" textAnchor="middle" fontSize="14">User</text>
                            <line x1="360" y1="52" x2="360" y2="68" stroke="#333" strokeWidth="1" markerEnd="url(#arrowL)" />

                            <rect x="310" y="68" width="100" height="40" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="93" textAnchor="middle" fontSize="14">UI</text>
                            <line x1="360" y1="108" x2="360" y2="140" stroke="#333" strokeWidth="1" markerEnd="url(#arrowL)" />

                            <rect x="150" y="140" width="440" height="480" rx="10" fill="#f5f7fb" stroke="#3355aa" strokeWidth="1" />
                            <text x="166" y="160" fontSize="13" fontWeight="600" fill="#3355aa">Frontend (browser)</text>

                            <rect x="270" y="180" width="180" height="44" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="206" textAnchor="middle" fontSize="14">React + Vite</text>
                            <line x1="360" y1="224" x2="360" y2="250" stroke="#333" strokeWidth="1" markerEnd="url(#arrowL)" />

                            <rect x="255" y="250" width="210" height="44" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="276" textAnchor="middle" fontSize="14">Local inference engine</text>
                            <line x1="360" y1="294" x2="360" y2="320" stroke="#333" strokeWidth="1" markerEnd="url(#arrowL)" />

                            <rect x="280" y="320" width="160" height="44" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="346" textAnchor="middle" fontSize="14">Text processing</text>
                            <line x1="360" y1="364" x2="360" y2="390" stroke="#333" strokeWidth="1" markerEnd="url(#arrowL)" />

                            <rect x="265" y="390" width="190" height="56" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="412" textAnchor="middle" fontSize="14">ONNX Runtime Web</text>
                            <text x="360" y="430" textAnchor="middle" fontSize="12" fill="#666">WebAssembly</text>
                            <line x1="360" y1="446" x2="360" y2="470" stroke="#333" strokeWidth="1" markerEnd="url(#arrowL)" />

                            <rect x="280" y="470" width="160" height="44" rx="6" fill="#fff" stroke="#333" strokeWidth="1" />
                            <text x="360" y="496" textAnchor="middle" fontSize="14">Detection models</text>

                            <path d="M360 514 L360 530 L260 530 L260 546" fill="none" stroke="#333" strokeWidth="1" markerEnd="url(#arrowL)" />
                            <path d="M360 514 L360 530 L467 530 L467 546" fill="none" stroke="#333" strokeWidth="1" markerEnd="url(#arrowL)" />

                            <rect x="180" y="546" width="160" height="44" rx="6" fill="#eef2fb" stroke="#333" strokeWidth="1" />
                            <text x="260" y="572" textAnchor="middle" fontSize="14">Machine learning</text>

                            <rect x="370" y="546" width="195" height="44" rx="6" fill="#fbeeee" stroke="#333" strokeWidth="1" />
                            <text x="467" y="572" textAnchor="middle" fontSize="14">Deep learning (BERT)</text>

                            <path d="M440 492 C 545 492 545 272 465 272" fill="none" stroke="#333" strokeWidth="1" markerEnd="url(#arrowL)" />
                        </svg>
                    </div> */}

                    <div className="docs-diagram">
                        <div className="docs-diagram-visual">
                            <svg
                                width="100%"
                                viewBox="0 0 680 610"
                                style={{ fontFamily: 'inherit' }}
                                role="img"
                                aria-labelledby="local-architecture-diagram-title"
                            >
                                <title id="local-architecture-diagram-title">
                                    Local inference architecture, from user input to Machine Learning models
                                </title>

                                <defs>
                                    <marker
                                        id="arrowL"
                                        viewBox="0 0 10 10"
                                        refX="8"
                                        refY="5"
                                        markerWidth="6"
                                        markerHeight="6"
                                        orient="auto-start-reverse"
                                    >
                                        <path
                                            d="M2 1L8 5L2 9"
                                            fill="none"
                                            stroke="#333"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </marker>
                                </defs>

                                {/* User */}
                                <rect
                                    x="310"
                                    y="16"
                                    width="100"
                                    height="36"
                                    rx="18"
                                    fill="#fff"
                                    stroke="#333"
                                    strokeWidth="1"
                                />
                                <text
                                    x="360"
                                    y="39"
                                    textAnchor="middle"
                                    fontSize="14"
                                >
                                    User
                                </text>

                                <line
                                    x1="360"
                                    y1="52"
                                    x2="360"
                                    y2="68"
                                    stroke="#333"
                                    strokeWidth="1"
                                    markerEnd="url(#arrowL)"
                                />

                                {/* UI */}
                                <rect
                                    x="310"
                                    y="68"
                                    width="100"
                                    height="40"
                                    rx="6"
                                    fill="#fff"
                                    stroke="#333"
                                    strokeWidth="1"
                                />
                                <text
                                    x="360"
                                    y="93"
                                    textAnchor="middle"
                                    fontSize="14"
                                >
                                    UI
                                </text>

                                <line
                                    x1="360"
                                    y1="108"
                                    x2="360"
                                    y2="140"
                                    stroke="#333"
                                    strokeWidth="1"
                                    markerEnd="url(#arrowL)"
                                />

                                {/* Browser/frontend container */}
                                <rect
                                    x="150"
                                    y="140"
                                    width="440"
                                    height="460"
                                    rx="10"
                                    fill="#f5f7fb"
                                    stroke="#3355aa"
                                    strokeWidth="1"
                                />

                                <text
                                    x="166"
                                    y="160"
                                    fontSize="13"
                                    fontWeight="600"
                                    fill="#3355aa"
                                >
                                    Frontend (browser)
                                </text>

                                {/* React */}
                                <rect
                                    x="270"
                                    y="180"
                                    width="180"
                                    height="44"
                                    rx="6"
                                    fill="#fff"
                                    stroke="#333"
                                    strokeWidth="1"
                                />
                                <text
                                    x="360"
                                    y="206"
                                    textAnchor="middle"
                                    fontSize="14"
                                >
                                    React + Vite
                                </text>

                                <line
                                    x1="360"
                                    y1="224"
                                    x2="360"
                                    y2="250"
                                    stroke="#333"
                                    strokeWidth="1"
                                    markerEnd="url(#arrowL)"
                                />

                                {/* Local inference engine */}
                                <rect
                                    x="255"
                                    y="250"
                                    width="210"
                                    height="44"
                                    rx="6"
                                    fill="#fff"
                                    stroke="#333"
                                    strokeWidth="1"
                                />
                                <text
                                    x="360"
                                    y="276"
                                    textAnchor="middle"
                                    fontSize="14"
                                >
                                    Local inference engine
                                </text>

                                <line
                                    x1="360"
                                    y1="294"
                                    x2="360"
                                    y2="320"
                                    stroke="#333"
                                    strokeWidth="1"
                                    markerEnd="url(#arrowL)"
                                />

                                {/* Text processing */}
                                <rect
                                    x="280"
                                    y="320"
                                    width="160"
                                    height="44"
                                    rx="6"
                                    fill="#fff"
                                    stroke="#333"
                                    strokeWidth="1"
                                />
                                <text
                                    x="360"
                                    y="346"
                                    textAnchor="middle"
                                    fontSize="14"
                                >
                                    Text processing
                                </text>

                                <line
                                    x1="360"
                                    y1="364"
                                    x2="360"
                                    y2="390"
                                    stroke="#333"
                                    strokeWidth="1"
                                    markerEnd="url(#arrowL)"
                                />

                                {/* ONNX Runtime Web */}
                                <rect
                                    x="265"
                                    y="390"
                                    width="190"
                                    height="56"
                                    rx="6"
                                    fill="#fff"
                                    stroke="#333"
                                    strokeWidth="1"
                                />
                                <text
                                    x="360"
                                    y="412"
                                    textAnchor="middle"
                                    fontSize="14"
                                >
                                    ONNX Runtime Web
                                </text>
                                <text
                                    x="360"
                                    y="430"
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="#666"
                                >
                                    WebAssembly
                                </text>

                                <line
                                    x1="360"
                                    y1="446"
                                    x2="360"
                                    y2="470"
                                    stroke="#333"
                                    strokeWidth="1"
                                    markerEnd="url(#arrowL)"
                                />

                                {/* Detection models */}
                                <rect
                                    x="280"
                                    y="470"
                                    width="160"
                                    height="44"
                                    rx="6"
                                    fill="#fff"
                                    stroke="#333"
                                    strokeWidth="1"
                                />
                                <text
                                    x="360"
                                    y="496"
                                    textAnchor="middle"
                                    fontSize="14"
                                >
                                    Detection models
                                </text>

                                <line
                                    x1="360"
                                    y1="514"
                                    x2="360"
                                    y2="546"
                                    stroke="#333"
                                    strokeWidth="1"
                                    markerEnd="url(#arrowL)"
                                />

                                {/* Machine Learning */}
                                <rect
                                    x="280"
                                    y="546"
                                    width="160"
                                    height="44"
                                    rx="6"
                                    fill="#eef2fb"
                                    stroke="#333"
                                    strokeWidth="1"
                                />
                                <text
                                    x="360"
                                    y="572"
                                    textAnchor="middle"
                                    fontSize="14"
                                >
                                    Machine learning
                                </text>
                            </svg>
                        </div>

                        <p className="docs-diagram-caption">
                            Local inference flow: the submitted text is processed entirely in the
                            browser, with ONNX Runtime Web executing the Machine Learning models
                            through WebAssembly.
                        </p>
                    </div>
                </section>

                {/* ───────────────── Local vs Backend ───────────────── */}
                <section className="docs-section" id="comparison">

                    <h2 className="docs-title">Local vs. Backend: which should I use?</h2>

                    <p className="docs-lead">
                        Both versions use the same detection pipeline, models, and feature definitions.
                        The main difference is where processing and inference take place: Local mode runs
                        entirely in the browser, while Backend mode sends the text to the server for
                        processing. This results in different trade-offs in terms of privacy, offline
                        availability, performance, and resource requirements.
                    </p>

                    <hr className="docs-divider" />

                    <div className="docs-table-wrapper">
                        <table className="docs-table">
                        <thead>
                            <tr>
                            <th></th>
                            <th>Local</th>
                            <th>Backend</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>Where inference runs</td>
                            <td>In-browser (ONNX Runtime Web / WASM)</td>
                            <td>Server (FastAPI + Python)</td>
                            </tr>
                            <tr>
                            <td>Data leaves your device?</td>
                            <td>No — text never leaves the browser</td>
                            <td>Yes — text is sent to the API for analysis</td>
                            </tr>
                            <tr>
                            <td>Works offline?</td>
                            <td>Yes, after the initial page load</td>
                            <td>No — requires a network connection</td>
                            </tr>
                            <tr>
                            <td>Speed</td>
                            <td>Depends on device resources</td>
                            <td>Consistent, server-controlled</td>
                            </tr>
                            <tr>
                            <td>Deep Learning (BERT) support</td>
                            <td>Not available — model is too large to run in the browser</td>
                            <td>Implemented, but not currently deployed due to hosting resource limits</td>
                            </tr>
                            <tr>
                            <td>Currently available models</td>
                            <td>Machine Learning only</td>
                            <td>Machine Learning only</td>
                            </tr>
                            <tr>
                            <td>Best for</td>
                            <td>Privacy, offline use, and on-device inference</td>
                            <td>Centralized inference and access to server-side resources</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>

                    <div className="docs-note">
                        <i className="ti ti-info-circle" aria-hidden="true" />
                        <div>
                            <strong>Implementation note:</strong> the local and backend versions implement
                            feature extraction in different languages, so some feature values may differ
                            slightly between the two. These differences do not meaningfully affect the
                            resulting classification.
                        </div>
                    </div>
                </section>

                {/* ───────────────── App Features ───────────────── */}

                <section className="docs-section" id="app-features">
                <div className="docs-eyebrow">Features</div>

                <h2 className="docs-title">App features</h2>

                <p className="docs-lead">
                    AIDetx2 combines AI detection, model attribution, segment-level analysis,
                    and multiple inference options into a single text analysis interface.
                </p>

                <hr className="docs-divider" />

                <div className="docs-feature-grid">
                    {appFeatures.map((f) => (
                    <div className="docs-feature-card" key={f.name}>
                        <div className="docs-feature-icon">
                        <i className={`ti ${f.icon}`} />
                        </div>

                        <div className="docs-feature-name">
                        {f.name}
                        </div>

                        <div className="docs-feature-desc">
                        {f.desc}
                        </div>
                    </div>
                    ))}
                </div>
                </section>

                {/* ───────────────── FAQ ───────────────── */}
                <section className="docs-section" id="faq">
                    <div className="docs-eyebrow">Reference</div>

                    <h2 className="docs-title">FAQ</h2>

                    <p className="docs-lead">
                        Answers to common questions about detection, supported inputs, privacy,
                        and how the results should be interpreted.
                    </p>

                    <hr className="docs-divider" />

                    <div className="docs-faq-list">
                        {faqItems.map((item, i) => {
                            const isOpen = openFaq === i
                            return (
                                <div className="docs-faq-item" key={item.q}>
                                    <button
                                        className="docs-faq-question"
                                        onClick={() => setOpenFaq(isOpen ? null : i)}
                                        aria-expanded={isOpen}
                                    >
                                        <span>{item.q}</span>
                                        <i className={`ti ti-chevron-down docs-faq-chevron ${isOpen ? 'open' : ''}`} />
                                    </button>

                                    <div className={`docs-faq-answer ${isOpen ? 'open' : ''}`}>
                                        <div className="docs-faq-answer-inner">
                                            {item.a}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

               <section className="docs-section" id="limitations">

                    <h2 className="docs-title">Limitations & known issues</h2>

                    <p className="docs-lead">
                        AIDetx2 provides probabilistic predictions rather than definitive
                        conclusions. Understanding its limitations is important when interpreting
                        detection and model attribution results.
                    </p>

                    <hr className="docs-divider" />

                    <div className="docs-limitation-grid">

                        <div className="docs-limitation-card">
                            <div className="docs-limitation-icon">
                                <i className="ti ti-ruler-2" />
                            </div>
                            <div className="docs-limitation-content">
                                <h3>Text length</h3>
                                <p>
                                    Very short inputs provide less information for the classifier
                                    and can produce less reliable predictions. Features based on
                                    sentence structure, vocabulary distribution, and repetition
                                    become harder to estimate when there is very little text
                                    available. Results on short snippets should therefore be
                                    interpreted with caution.
                                </p>
                            </div>
                        </div>

                        <div className="docs-limitation-card">
                            <div className="docs-limitation-icon">
                                <i className="ti ti-edit" />
                            </div>
                            <div className="docs-limitation-content">
                                <h3>Heavily edited AI text</h3>
                                <p>
                                    Text that was originally AI-generated but has been
                                    substantially rewritten, paraphrased, or mixed with human
                                    edits may become harder to classify. Editing can alter the
                                    statistical and stylistic patterns that the classifier relies
                                    on, potentially making AI-generated text appear more similar
                                    to human-written text.
                                </p>
                            </div>
                        </div>

                        <div className="docs-limitation-card">
                            <div className="docs-limitation-icon">
                                <i className="ti ti-language" />
                            </div>
                            <div className="docs-limitation-content">
                                <h3>Language coverage</h3>
                                <p>
                                    AIDetx2 was developed and evaluated primarily on English-language
                                    text. Its behavior on other languages is currently unverified,
                                    so the reported results and confidence levels should not be
                                    assumed to generalize beyond English.
                                </p>
                            </div>
                        </div>

                        <div className="docs-limitation-card">
                            <div className="docs-limitation-icon">
                                <i className="ti ti-shield-exclamation" />
                            </div>
                            <div className="docs-limitation-content">
                                <h3>Evasion and adversarial input</h3>
                                <p>
                                    Like other statistical classifiers, AIDetx2 can be affected
                                    by text that has been deliberately modified to obscure the
                                    patterns used for detection. The system is intended as a
                                    detection aid and should not be considered a security control
                                    against deliberate attempts to evade classification.
                                </p>
                            </div>
                        </div>

                        <div className="docs-limitation-card">
                            <div className="docs-limitation-icon">
                                <i className="ti ti-cpu" />
                            </div>
                            <div className="docs-limitation-content">
                                <h3>Model attribution</h3>
                                <p>
                                    Identifying which AI model generated a text is more difficult
                                    than the binary human/AI classification. Different models can
                                    produce similar linguistic patterns, while newer, fine-tuned,
                                    or previously unseen models may not match the patterns
                                    represented in the training data. Model attribution should
                                    therefore be interpreted as a probabilistic prediction, not
                                    definitive identification.
                                </p>
                            </div>
                        </div>

                        <div className="docs-limitation-card">
                            <div className="docs-limitation-icon">
                                <i className="ti ti-brand-openai" />
                            </div>
                            <div className="docs-limitation-content">
                                <h3>Unseen AI models</h3>
                                <p>
                                    Model attribution is limited to the patterns learned from the
                                    supported generator classes. Text produced by an AI model that
                                    was not represented during training may be incorrectly
                                    attributed to one of the supported models, particularly when
                                    its writing patterns resemble an existing class.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ───────────────── GitHub ───────────────── */}

                <section className="docs-section" id="github">
                    <div className="docs-eyebrow">Resources</div>

                    <h2 className="docs-title">GitHub</h2>

                    <p className="docs-lead">
                        Source code, dataset, and contributions.
                    </p>

                    <hr className="docs-divider" />

                    <div className="docs-github-card">
                        <div className="docs-github-left">
                        <i className="ti ti-brand-github docs-github-icon" />

                        <div>
                            <div className="docs-github-title">
                            AIDetx2
                            </div>

                            <div className="docs-github-sub">
                                Official GitHub organization · Project repositories
                            </div>
                        </div>
                        </div>

                        <a
                        href="https://github.com/AIDetx2"
                        className="docs-github-btn"
                        target="_blank"
                        rel="noreferrer"
                        >
                        <i className="ti ti-external-link" />
                        Explore repositories
                        </a>
                    </div>
                </section>
            </div>
        </main>
        </div>
    )
}