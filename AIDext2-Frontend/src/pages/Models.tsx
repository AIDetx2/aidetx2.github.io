import { useEffect, useState } from 'react'
import './Models.css'

interface NavItem {
  id: string
  label: string
  icon: string
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Models',
    items: [
      { id: 'overview', label: 'Overview', icon: 'ti-ai' },
      { id: 'detection-tasks', label: 'Detection tasks', icon: 'ti-target' },
      { id: 'extracted_features', label: 'Features', icon: 'ti-adjustments' },
      { id: 'classifiers', label: 'Classifiers', icon: 'ti-brain' },
      { id: 'inference', label: 'Inference', icon: 'ti-player-play' },
      { id: 'attribution', label: 'Model attribution', icon: 'ti-robot' },
      { id: 'technical-notes', label: 'Technical notes', icon: 'ti-notes' },
      { id: 'deep-learning', label:'Deep Learning', icon:'ti-network'}
    ],
  },
]

export default function Models() {
  const [activeId, setActiveId] = useState('overview')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%', threshold: 0.05 }
    )

    const sections = document.querySelectorAll('.docs-section')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <div className="docs-shell">

      {/* ───────────────── Sidebar ───────────────── */}

      <aside className="docs-sidebar">

        {navGroups.map((group) => (
          <div className="docs-nav-group" key={group.label}>

            <div className="docs-nav-group-label">
              {group.label}
            </div>

            {group.items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`docs-nav-item ${
                  activeId === item.id ? 'active' : ''
                }`}
              >
                <i className={`ti ${item.icon}`} aria-hidden="true" />
                {item.label}
              </a>
            ))}

          </div>
        ))}

      </aside>


      <main className="docs-main">

        {/* ───────────────── Overview ───────────────── */}

        <section className="docs-section" id="overview">

          <div className="docs-eyebrow">
            Models
          </div>

          <h1 className="docs-title">
            Models & feature extraction
          </h1>

          <p className="docs-lead">
            AIDetx2 uses feature-based machine learning models to analyze
            statistical and linguistic properties of text. The same feature
            representation is used for both AI-generated text detection and
            AI model attribution.
          </p>

          <hr className="docs-divider" />

          <h3 className="docs-h2">
            How the models work
          </h3>

          <p className="docs-prose">
            Instead of operating directly on raw text, the classifiers receive
            a numerical representation produced by the feature extraction
            pipeline. The extracted features capture properties such as
            vocabulary diversity, entropy, sentence structure, repetition,
            compression, and readability.
          </p>

          <p className="docs-prose">
            These feature vectors are then passed to machine learning
            classifiers trained for the corresponding detection task.
          </p>

        </section>


        {/* ───────────────── Detection Tasks ───────────────── */}

        <section className="docs-section" id="detection-tasks">

          <div className="docs-eyebrow">
            Models
          </div>

          <h2 className="docs-title">
            Detection tasks
          </h2>

          <p className="docs-lead">
            AIDetx2 supports two related classification tasks based on the
            same extracted feature representation.
          </p>

          <hr className="docs-divider" />

          <div className="docs-model-type-grid">

            <div className="docs-feature-card">

              <div className="docs-feature-icon">
                <i className="ti ti-user-check" />
              </div>

              <div className="docs-feature-name">
                Binary AI Detection
              </div>

              <div className="docs-feature-desc">
                Classifies text as either human-written or AI-generated.
              </div>

            </div>


            <div className="docs-feature-card">

              <div className="docs-feature-icon">
                <i className="ti ti-robot" />
              </div>

              <div className="docs-feature-name">
                AI Model Attribution
              </div>

              <div className="docs-feature-desc">
                Predicts which supported AI generator most closely matches
                the detected text.
              </div>

            </div>

            <div className="docs-feature-card">
                <div className="docs-feature-icon">
                    <i className="ti ti-robot" />
                </div>

                <div className="docs-feature-name">
                    Binary + AI Model Attribution
                </div>

                <div className="docs-feature-desc">
                    Simultaneously determines whether text is AI-generated and predicts its likely AI model.
                </div>
            </div>

          </div>

        </section>


        {/* ───────────────── Features ───────────────── */}

        <section id="extracted_features">

          <div className="docs-eyebrow">
              Features
          </div>

          <h2 className="docs-title">Extracted Features</h2>

          <p className="docs-lead">
              The machine learning models operate on a set of
              <strong> 17 statistical and linguistic features </strong>
              extracted from each text. These features capture properties
              related to compression, entropy, vocabulary, sentence
              structure, repetition, and readability.
          </p>

          <hr className="docs-divider" />

          {/* ───────────── Compression-Based Features ───────────── */}
          <div className="docs-subsection" id="feat-compression">
          <h2 className="docs-subtitle">Compression-Based Features</h2>
          <p className="docs-prose">
              These features exploit the idea that predictable, low-entropy text (often
              a signature of AI generation) compresses more efficiently than genuinely
              novel human writing.
          </p>

          <div className="docs-table-wrapper">
              <table className="docs-table">
              <thead>
                  <tr><th>Feature</th><th>Definition</th></tr>
              </thead>
              <tbody>
                  <tr>
                  <td><code>compression_ratio_1</code></td>
                  <td>
                      Ratio of compressed to original size using Zstandard. Lower
                      values indicate more predictable, repetitive text.
                  </td>
                  </tr>
                  <tr>
                  <td><code>perplexity_1</code></td>
                  <td>
                      Approximates language-model perplexity from the compression
                      ratio: harder-to-compress text is treated as less predictable
                      and given a higher perplexity score.
                  </td>
                  </tr>
                  <tr>
                  <td><code>ncd_human</code> / <code>ncd_ai</code></td>
                  <td>
                      Normalized Compression Distance between the text and a reference
                      human or AI corpus. Computed as{' '}
                      <code>(C(ref+text) - min(C(ref), C(text))) / max(C(ref), C(text))</code>,
                      using LZMA compression. Lower values mean the text compresses
                      similarly to that reference corpus, i.e. is more "similar" to it.
                  </td>
                  </tr>
                  <tr>
                  <td><code>ncd_diff</code></td>
                  <td>
                      Difference between <code>ncd_human</code> and <code>ncd_ai</code>,
                      giving a signed measure of which reference corpus the text is
                      closer to.
                  </td>
                  </tr>
                  <tr>
                  <td><code>ncsd_human</code> / <code>ncsd_ai</code></td>
                  <td>
                      Normalized Conditional Sufficient Distance:{' '}
                      <code>(C(text+ref) - C(text)) / C(ref)</code>. Measures how much
                      additional information the reference corpus contributes when
                      compressed together with the text. Lower values indicate the
                      reference explains the text well.
                  </td>
                  </tr>
                  <tr>
                  <td><code>ncsd_diff</code></td>
                  <td>
                      Difference between <code>ncsd_human</code> and{' '}
                      <code>ncsd_ai</code>, indicating which reference corpus better
                      "explains" the text.
                  </td>
                  </tr>
              </tbody>
              </table>
          </div>
          </div>

          {/* ───────────── Entropy Features ───────────── */}
          <div className="docs-subsection" id="feat-entropy">
          <h2 className="docs-subtitle">Entropy Features</h2>
          <p className="docs-prose">
              Character-level information measures that capture randomness and
              predictability in the text.
          </p>

          <div className="docs-table-wrapper">
              <table className="docs-table">
              <thead>
                  <tr><th>Feature</th><th>Definition</th></tr>
              </thead>
              <tbody>
                  <tr>
                  <td><code>shannon_entropy</code></td>
                  <td>
                      Character-level Shannon entropy, computed from the probability
                      distribution of characters in the text. Lower entropy suggests
                      more repetitive or structured character usage.
                  </td>
                  </tr>
                  <tr>
                  <td><code>entropy_ratio_1</code></td>
                  <td>
                      Ratio between a compression-based entropy estimate and the
                      Shannon entropy of the text. Captures how much of the text's
                      theoretical randomness is actually "used".
                  </td>
                  </tr>
              </tbody>
              </table>
          </div>
          </div>

          {/* ───────────── Lexical Diversity Features ───────────── */}
          <div className="docs-subsection" id="feat-lexical">
          <h2 className="docs-subtitle">Lexical Diversity Features</h2>
          <p className="docs-prose">
              These features describe vocabulary range and word choice, which tend to
              differ between human and AI-generated writing.
          </p>

          <div className="docs-table-wrapper">
              <table className="docs-table">
              <thead>
                  <tr><th>Feature</th><th>Definition</th></tr>
              </thead>
              <tbody>
                  <tr>
                  <td><code>lexical_richness</code></td>
                  <td>
                      Ratio of unique words to total words (type-token ratio). Human
                      text typically shows greater lexical variation.
                  </td>
                  </tr>
                  <tr>
                  <td><code>lexical_density</code></td>
                  <td>
                      Ratio of content words (excluding common function words like
                      "the", "is", "and") to total words. Higher values can indicate
                      more formal, information-dense writing.
                  </td>
                  </tr>
                  <tr>
                  <td><code>hapax_ratio</code></td>
                  <td>
                      Ratio of words that appear exactly once in the text. Lower
                      values can indicate a narrower, "safer" vocabulary, common in
                      AI-generated text.
                  </td>
                  </tr>
                  <tr>
                  <td><code>uncommon_word_ratio</code></td>
                  <td>
                      Ratio of words with low frequency in general English usage
                      (via <code>wordfreq</code>), below a fixed threshold. AI text
                      tends to favor common vocabulary.
                  </td>
                  </tr>
                  <tr>
                  <td><code>vocabulary_richness_per100</code></td>
                  <td>
                      Number of unique words within the first 100 tokens of the text.
                      More stable across texts of varying length than a raw
                      type-token ratio.
                  </td>
                  </tr>
              </tbody>
              </table>
          </div>
          </div>

          {/* ───────────── Structural Features ───────────── */}
          <div className="docs-subsection" id="feat-structural">
          <h2 className="docs-subtitle">Structural Features</h2>
          <p className="docs-prose">
              Sentence- and character-level structural patterns.
          </p>

          <div className="docs-table-wrapper">
              <table className="docs-table">
              <thead>
                  <tr><th>Feature</th><th>Definition</th></tr>
              </thead>
              <tbody>
                  <tr>
                  <td><code>avg_sentence_length</code></td>
                  <td>Average number of words per sentence in the text.</td>
                  </tr>
                  <tr>
                  <td><code>sentence_length_variance</code></td>
                  <td>
                      Variance in sentence length across the text. AI-generated text
                      tends to have lower variance, i.e. more uniform sentence
                      structure.
                  </td>
                  </tr>
                  <tr>
                  <td><code>punctuation_density</code></td>
                  <td>
                      Ratio of punctuation characters to total character count.
                  </td>
                  </tr>
              </tbody>
              </table>
          </div>
          </div>

          {/* ───────────── Repetition Features ───────────── */}
          <div className="docs-subsection" id="feat-repetition">
          <h2 className="docs-subtitle">Repetition Features</h2>
          <p className="docs-prose">
              Measures of word- and phrase-level repetition, often elevated in
              generated text.
          </p>

          <div className="docs-table-wrapper">
              <table className="docs-table">
              <thead>
                  <tr><th>Feature</th><th>Definition</th></tr>
              </thead>
              <tbody>
                  <tr>
                  <td><code>repetition_rate</code></td>
                  <td>Ratio of repeated words (appearing more than once) to total words.</td>
                  </tr>
                  <tr>
                  <td><code>bigram_repetition_rate</code></td>
                  <td>
                      Ratio of repeated word-pairs (bigrams) to total bigrams,
                      capturing phrase-level rather than single-word repetition.
                  </td>
                  </tr>
                  <tr>
                  <td><code>burstiness</code></td>
                  <td>
                      Measures how clustered vs. uniformly distributed word
                      repetitions are across the text, computed from the standard
                      deviation and mean of the gaps between repeated word
                      occurrences. Human text tends to be more "bursty".
                  </td>
                  </tr>
              </tbody>
              </table>
          </div>
          </div>

          {/* ───────────── Readability Features ───────────── */}
          <div className="docs-subsection" id="feat-readability">
          <h2 className="docs-subtitle">Readability Features</h2>
          <p className="docs-prose">
              Standard readability metrics computed via <code>textstat</code>.
          </p>

          <div className="docs-table-wrapper">
              <table className="docs-table">
              <thead>
                  <tr><th>Feature</th><th>Definition</th></tr>
              </thead>
              <tbody>
                  <tr>
                  <td><code>flesch_reading_ease</code></td>
                  <td>
                      Flesch Reading Ease score, based on sentence length and
                      syllable count. Higher scores indicate easier-to-read text.
                  </td>
                  </tr>
                  <tr>
                  <td><code>gunning_fog</code></td>
                  <td>
                      Gunning Fog index, estimating the years of formal education
                      needed to understand the text on a first reading.
                  </td>
                  </tr>
                  <tr>
                  <td><code>smog_index</code></td>
                  <td>
                      SMOG readability index, estimating years of education required
                      to understand the text, based on polysyllabic word counts.
                  </td>
                  </tr>
              </tbody>
              </table>
          </div>
          </div>
      </section>


        {/* ───────────────── Classifiers ───────────────── */}

        <section className="docs-section" id="classifiers">

          <div className="docs-eyebrow">
            Models
          </div>

          <h2 className="docs-title">
            Classifiers
          </h2>

          <p className="docs-lead">
            Several classical machine learning classifiers were implemented
            and evaluated using the extracted feature vectors.
          </p>

          <hr className="docs-divider" />

          <div className="docs-table-wrapper">

            <table className="docs-table">

            <thead>
                <tr>
                <th>Model</th>
                <th>Type</th>
                <th>Description</th>
                </tr>
            </thead>

            <tbody>

                <tr>
                <td>
                    Gaussian Naive Bayes
                </td>

                <td>
                    Probabilistic
                </td>

                <td>
                    A lightweight probabilistic classifier based on
                    Bayes' theorem and the assumption that features
                    contribute independently to the prediction.
                </td>
                </tr>


                <tr>
                <td>
                    Linear SVM
                </td>

                <td>
                    Linear classifier
                </td>

                <td>
                    Finds a separating hyperplane between classes in
                    the feature space. The implemented classifier uses
                    <code> LinearSVC </code>.
                </td>
                </tr>


                <tr>
                <td>
                    K-Nearest Neighbors
                </td>

                <td>
                    Instance-based
                </td>

                <td>
                    Classifies an input according to the labels of
                    nearby samples in the feature space.
                </td>
                </tr>


                <tr>
                <td>
                    XGBoost
                </td>

                <td>
                    Gradient boosting
                </td>

                <td>
                    An ensemble of decision trees trained sequentially,
                    with each stage improving on the errors of the
                    previous trees.
                </td>
                </tr>


                <tr>
                <td>
                    MLP
                </td>

                <td>
                    Neural network
                </td>

                <td>
                    A multi-layer perceptron that learns non-linear
                    relationships between the extracted feature values.
                </td>
                </tr>

            </tbody>

            </table>

        </div>


          <p className="docs-prose">
            These classifiers were evaluated during development as part of
            the model selection process. The complete set of evaluated
            classifiers should therefore be distinguished from the models
            ultimately used for deployment.
          </p>

        </section>


        {/* ───────────────── Inference ───────────────── */}

        <section className="docs-section" id="inference">

          <div className="docs-eyebrow">
            Inference
          </div>

          <h2 className="docs-title">
            Inference
          </h2>

          <p className="docs-lead">
            The trained models can be executed through either the local
            browser-based inference pipeline or the backend API. Both
            approaches use the same feature-based detection workflow.
          </p>

          <hr className="docs-divider" />

          <div className="docs-diagram">
            <div className="docs-diagram-visual">
                <svg
                    width="100%"
                    viewBox="0 0 680 560"
                    style={{ fontFamily: 'inherit' }}
                    role="img"
                    aria-labelledby="feature-pipeline-title"
                >
                    <title id="feature-pipeline-title">
                        Machine Learning detection pipeline from input text to prediction
                    </title>

                    <defs>
                        <marker
                            id="arrowF"
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

                    {/* Input text */}
                    <rect
                        x="190"
                        y="20"
                        width="300"
                        height="56"
                        rx="8"
                        fill="#fff"
                        stroke="#333"
                        strokeWidth="1"
                    />

                    <text
                        x="340"
                        y="43"
                        textAnchor="middle"
                        fontSize="14"
                    >
                        Input text
                    </text>

                    <text
                        x="340"
                        y="63"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#666"
                    >
                        submitted document or text segment
                    </text>

                    <line
                        x1="340"
                        y1="76"
                        x2="340"
                        y2="116"
                        stroke="#333"
                        strokeWidth="1"
                        markerEnd="url(#arrowF)"
                    />

                    {/* Feature extraction */}
                    <rect
                        x="158"
                        y="116"
                        width="360"
                        height="64"
                        rx="8"
                        fill="#fff"
                        stroke="#333"
                        strokeWidth="1"
                    />

                    <text
                        x="340"
                        y="141"
                        textAnchor="middle"
                        fontSize="14"
                    >
                        Feature extraction
                    </text>

                    <text
                        x="340"
                        y="161"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#666"
                    >
                        linguistic, statistical &amp; structural properties
                    </text>

                    <line
                        x1="340"
                        y1="180"
                        x2="340"
                        y2="220"
                        stroke="#333"
                        strokeWidth="1"
                        markerEnd="url(#arrowF)"
                    />

                    {/* 17 features */}
                    <rect
                        x="190"
                        y="220"
                        width="300"
                        height="64"
                        rx="8"
                        fill="#eef2fb"
                        stroke="#333"
                        strokeWidth="1"
                    />

                    <text
                        x="340"
                        y="245"
                        textAnchor="middle"
                        fontSize="14"
                    >
                        17 extracted features
                    </text>

                    <text
                        x="340"
                        y="265"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#666"
                    >
                        feature vector used as model input
                    </text>

                    <line
                        x1="340"
                        y1="284"
                        x2="340"
                        y2="324"
                        stroke="#333"
                        strokeWidth="1"
                        markerEnd="url(#arrowF)"
                    />

                    {/* ML classifier */}
                    <rect
                        x="164"
                        y="324"
                        width="350"
                        height="64"
                        rx="8"
                        fill="#fff"
                        stroke="#333"
                        strokeWidth="1"
                    />

                    <text
                        x="340"
                        y="349"
                        textAnchor="middle"
                        fontSize="14"
                    >
                        Machine Learning classifier
                    </text>

                    <text
                        x="340"
                        y="369"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#666"
                    >
                        trained classifier processes the feature vector
                    </text>

                    <line
                        x1="340"
                        y1="388"
                        x2="340"
                        y2="428"
                        stroke="#333"
                        strokeWidth="1"
                        markerEnd="url(#arrowF)"
                    />

                    {/* Prediction */}
                    <rect
                        x="190"
                        y="428"
                        width="300"
                        height="64"
                        rx="8"
                        fill="#eef7ee"
                        stroke="#333"
                        strokeWidth="1"
                    />

                    <text
                        x="340"
                        y="453"
                        textAnchor="middle"
                        fontSize="14"
                    >
                        Prediction
                    </text>

                    <text
                        x="340"
                        y="473"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#666"
                    >
                        Human / AI classification + confidence
                    </text>
                </svg>
            </div>

            <p className="docs-diagram-caption">
                Machine Learning detection flow: text is transformed into a set of 17
                extracted features, which are then passed to a trained classifier to
                produce the final prediction.
            </p>
          </div>

          <div className="docs-inference-grid">
  
            <a href="/docs#arch-local"
              className="docs-feature-card docs-feature-card--link"
            >
              <div className="docs-feature-icon">
                <i className="ti ti-device-laptop" />
              </div>
              <div className="docs-feature-name">
                Local inference
              </div>
              <div className="docs-feature-desc">
                Feature extraction and model inference run directly in the
                browser via ONNX Runtime Web.
              </div>
              <div className="docs-feature-link-hint">
                View local architecture <i className="ti ti-arrow-right" />
              </div>
            </a>

            
            <a  href="/docs#arch-backend"
              className="docs-feature-card docs-feature-card--link"
            >
              <div className="docs-feature-icon">
                <i className="ti ti-server-2" />
              </div>
              <div className="docs-feature-name">
                Backend inference
              </div>
              <div className="docs-feature-desc">
                The input is sent to the FastAPI service, where feature
                extraction and inference are performed server-side.
              </div>
              <div className="docs-feature-link-hint">
                View backend architecture <i className="ti ti-arrow-right" />
              </div>
            </a>
          </div>

        </section>


        {/* ───────────────── Model Attribution ───────────────── */}

        <section className="docs-section" id="attribution">

          <div className="docs-eyebrow">
            Model attribution
          </div>

          <h2 className="docs-title">
            AI model attribution
          </h2>

          <p className="docs-lead">
            In addition to binary AI detection, AIDetx2 can estimate which
            supported AI generator most closely matches the detected text.
          </p>

          <hr className="docs-divider" />

          <p className="docs-prose">
            Model attribution is treated as a multi-class classification
            problem. Instead of predicting only whether text is AI-generated,
            the classifier learns patterns associated with the supported
            generator classes.
          </p>

          <h3 className="docs-h2">
            Unseen-model evaluation
          </h3>

          <p className="docs-prose">
            During evaluation, model attribution was also tested using an
            unseen-model setup. A generator can be excluded from the training
            data and subsequently used as the test class. This evaluates
            whether the extracted features capture patterns that generalize
            beyond the specific generators represented during training.
          </p>

          <p className="docs-prose">
            Because different AI systems can produce similar statistical and
            linguistic patterns, attribution to a previously unseen generator
            is inherently uncertain. Predictions should therefore be
            interpreted as the model class that best matches the learned
            representation rather than definitive identification of the
            generator.
          </p>

        </section>


        {/* ───────────────── Technical Notes ───────────────── */}

        <section className="docs-section" id="technical-notes">

          <div className="docs-eyebrow">
            Reference
          </div>

          <h2 className="docs-title">
            Technical notes
          </h2>

          <p className="docs-lead">
            Implementation details relevant to the feature extraction and
            classification pipeline.
          </p>

          <hr className="docs-divider" />

          <div className="docs-info-block">

            <div className="docs-info-label">
              Feature representation
            </div>

            <div className="docs-info-value">
              17 numerical features extracted from each input text.
            </div>

          </div>


          <div className="docs-info-block">

            <div className="docs-info-label">
              Classification approach
            </div>

            <div className="docs-info-value">
              Classical machine learning classifiers operating on
              feature vectors rather than raw text.
            </div>

          </div>


          <div className="docs-info-block">

            <div className="docs-info-label">
              Supported attribution classes
            </div>

            <div className="docs-info-value">
              GPT-OSS, DeepSeek, Llama, and Mistral.
            </div>

          </div>


          <div className="docs-info-block">

            <div className="docs-info-label">
              Inference environments
            </div>

            <div className="docs-info-value">
              Browser-based inference through ONNX Runtime Web and
              server-side inference through the FastAPI backend.
            </div>

          </div>

        </section>

        <section className="docs-section" id="deep-learning">

          <div className="docs-eyebrow">
            Deep Learning
          </div>

          <h2 className="docs-title">
            Deep Learning Models
          </h2>

          <p className="docs-lead">
            AIDetx2 also includes a Deep Learning approach based on BERT-based
            transformer models for AI-generated text detection. Unlike the
            Machine Learning pipeline, which relies on manually extracted
            linguistic and statistical features, these models operate directly
            on the input text.
          </p>

          <hr className="docs-divider" />

          <p className="docs-prose">
            The Deep Learning models were developed as an alternative detection
            approach and are fully implemented in the AIDetx2 codebase. They
            learn relevant textual patterns directly from the training data,
            rather than relying on the 17 handcrafted features used by the
            Machine Learning classifiers.
          </p>

          <div className="docs-note">
            <i className="ti ti-alert-circle" aria-hidden="true" />
            <div>
              <strong>Deployment status:</strong> The Deep Learning models are
              <strong> not currently deployed in the web application</strong>.
              The deployed backend currently uses the Machine Learning
              classifiers, while the browser-based version is also limited to
              the Machine Learning models due to the computational and model-size
              requirements of BERT-based inference.
            </div>
          </div>

          <p className="docs-prose">
            The Deep Learning implementation is nevertheless available through
            the <strong>AIDetx2 CLI</strong>, where the models can be used for
            inference directly from the command line.
          </p>

          <div className="docs-github-card">
            <div className="docs-github-left">
            <i className="ti ti-brand-github docs-github-icon" />

            <div>
                <div className="docs-github-title">
                AIDetx2 CLI
                </div>

                <div className="docs-github-sub">
                    AIDetx2 CLI · GitHub repository
                </div>
            </div>
            </div>

            <a
            href="https://github.com/DiogoSilva1904/AIDetx2-CLI"
            className="docs-github-btn"
            target="_blank"
            rel="noreferrer"
            >
            <i className="ti ti-external-link" />
            View repo
            </a>
        </div>

        </section>

      </main>

    </div>
  )
}