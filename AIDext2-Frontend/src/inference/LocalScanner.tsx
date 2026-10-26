import { FeatureExtractor } from "../features/FeatureExtractor";
import { ONNXClassifier } from "./ONNXClassifier";
//import { init } from '@bokuweb/zstd-wasm';
import { HUMAN_BYTES, AI_BYTES, AI_BYTES_MULTICLASS } from '../features/ReferenceModels';
import { Features } from "../features/Features";

const FEATURE_ORDER_BINARY = [
    "compression_ratio_1",
    "perplexity_1",
    "ncd_human",
    "ncd_ai",
    "ncd_diff",
    "ncsd_human",
    "ncsd_ai",
    "ncsd_diff",
    "shannon_entropy",
    "entropy_ratio_1",
    "lexical_richness",
    "lexical_density",
    "hapax_ratio",
    "uncommon_word_ratio",
    "vocabulary_richness_per100",
    "avg_sentence_length",
    "sentence_length_variance",
    "punctuation_density",
    "repetition_rate",
    "bigram_repetition_rate",
    "burstiness",
    "flesch_reading_ease",
    "gunning_fog",
    "smog_index"
]

const FEATURE_ORDER_MODEL = [
    "compression_ratio_1",
    "perplexity_1",
    "ncd_ai",
    "ncsd_ai",
    "shannon_entropy",
    "entropy_ratio_1",
    "lexical_richness",
    "lexical_density",
    "hapax_ratio",
    "uncommon_word_ratio",
    "vocabulary_richness_per100",
    "avg_sentence_length",
    "sentence_length_variance",
    "punctuation_density",
    "repetition_rate",
    "bigram_repetition_rate",
    "burstiness",
    "flesch_reading_ease",
    "gunning_fog",
    "smog_index"
];


export interface ChunkResult {
  start: number;
  end: number;
  probai: number;
  probhuman:number; 
  //label: "AI" | "Human" | "Hybrid";
  label:number;
  features: Record<string, number>;
  gen_model?: string;
  probmodel?:number
}

export interface ScanResponse {
  model: string;
  results: ChunkResult[];
  stride: number;
  window_size: number;
}

interface ScanOptions {
  windowMode: "chars" | "words";
}

function getWindowConfigWords(text: string): { window: number; stride: number } | null {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 50)   return null;                             
  if (wordCount < 200)  return { window: wordCount, stride: wordCount };
  if (wordCount < 1000) return { window: 400, stride: 200 };
  if (wordCount < 3000) return { window: 500, stride: 250 };
  return { window: 500, stride: 250 };
}

function getWindowConfigChars(text: string): { window: number; stride: number } | null {
  const charCount = text.length;
  if (charCount < 300)  return null;
  if (charCount < 1200)  return { window: charCount,  stride: charCount };
  if (charCount < 6000) return { window: 2400,  stride: 1200 };
  return { window: 3000, stride: 1500 };
}

export class LocalScanner {
  private binaryClassifier  = new ONNXClassifier();
  private modelClassifier   = new ONNXClassifier();
  private binaryExtractor: FeatureExtractor | null = null;
  private modelExtractor:  FeatureExtractor | null = null;
  private ready = false;
  private loadPromise: Promise<void> | null = null;
  

  constructor() {
      //console.log("human_bytes size", HUMAN_BYTES.length);
      //console.log("ai_bytes size", AI_BYTES.length);
  }

  /* async load() {
    if (this.ready) return;
    console.log("Initializing zstd...");
    await init();
    console.log("zstd ready");

    Features.initialized = true;

    console.log("Loading ONNX model...");
    await this.classifier.load();
    console.log("ONNX ready");

    this.extractor = new FeatureExtractor({
      human_bytes: HUMAN_BYTES,
      ai_bytes: AI_BYTES,
    });
    this.ready = true;
    console.log("LocalScanner fully ready");
  } */

    async load() {
      if (this.ready) return;
      if (this.loadPromise) return this.loadPromise;

      this.loadPromise = (async () => {
          //console.log("Initializing zstd...");
          await Features.init();
          //console.log("zstd ready");

          //console.log("Loading ONNX model...");
          //await this.classifier.load();
          await Promise.all([
            //this.binaryClassifier.load("/AIDetx2-Frontend/binary_model_no_pos_zipmap.onnx"),
            //this.modelClassifier.load("/AIDetx2-Frontend/ai_model_no_pos_zipmap.onnx"),
            this.binaryClassifier.load("binary_model_XGB.onnx"),
            this.modelClassifier.load("ai_model_MLP.onnx"),

        ]);
          //console.log("ONNX ready");

          /* this.extractor = new FeatureExtractor({
              human_bytes: HUMAN_BYTES,
              ai_bytes: AI_BYTES,
          }); */
          this.binaryExtractor = new FeatureExtractor({ human_bytes: HUMAN_BYTES, ai_bytes: AI_BYTES });
          this.modelExtractor  = new FeatureExtractor({ ai_bytes: AI_BYTES_MULTICLASS });

          this.ready = true;
          //console.log("LocalScanner fully ready");
      })();

      return this.loadPromise;
  }

  /* async scan(
    text: string,
    { windowMode }: ScanOptions = { windowMode: "chars" },
    selected_model:string
  ): Promise<ScanResponse | null> {
    await this.load();

    const config = windowMode === "words"
      ? getWindowConfigWords(text)
      : getWindowConfigChars(text);
    
    console.log("Configuration",config)

    const isShortText = config === null;

    const windowSize = isShortText
      ? (windowMode === "words"
          ? text.split(/\s+/).filter(Boolean).length
          : text.length)
      : config.window;

    const stride = isShortText ? windowSize : config.stride;

    const chunks = isShortText
      ? [{ start: 0, end: text.length }]
      : (windowMode === "words"
          ? splitByWords(text, windowSize, stride)
          : splitByChars(text, windowSize, stride));

    const results: ChunkResult[] = [];

    for (const { start, end } of chunks) {
      
      const slice = text.slice(start, end);
      console.log(`Chunk [${start}-${end}] chars: ${slice.length} words: ${slice.split(/\s+/).filter(Boolean).length}`);
      if (!slice.trim()) continue;

      const featureMap = this.extractor!.extract(slice);
      const features   = toVector(featureMap);

      const { label, probHuman, probAI } =
        await this.classifier.predict(features);

      console.log(label)

      console.log("prob", probHuman)
      console.log("pro",probAI)
      const probai = probAI
      const probhuman = probHuman

      results.push({
        start,
        end,
        probai,
        probhuman,
        label,
        features: featureMap,
      });
    }

    console.log("Results", results)
    return {
      model: "local/onnx",
      results,
      stride,
      window_size: windowSize,
    };
  }*/

  async scan(
    text: string,
    { windowMode }: ScanOptions = { windowMode: "chars" },
    selectedModel: { id: string; category: string }
  ): Promise<ScanResponse | null> {
    await this.load();

    const config = windowMode === "words"
      ? getWindowConfigWords(text)
      : getWindowConfigChars(text);

    const isShortText = config === null;
    const windowSize = isShortText
      ? (windowMode === "words"
          ? text.split(/\s+/).filter(Boolean).length
          : text.length)
      : config.window;
    const stride = isShortText ? windowSize : config.stride;

    const chunks = isShortText
      ? [{ start: 0, end: text.length }]
      : (windowMode === "words"
          ? splitByWords(text, windowSize, stride)
          : splitByChars(text, windowSize, stride));

    const results: ChunkResult[] = [];

    for (const { start, end } of chunks) {
      const slice = text.slice(start, end);
      if (!slice.trim()) continue;

      let featureMap: Record<string, number> = {};
      const task = selectedModel.id; 


      let probai    = 0;
      let probhuman = 0;
      let label     = 0;
      let probmodel = 0;
      let gen_model: string | undefined = undefined;

      if (task === "binary") {
        featureMap = this.binaryExtractor!.extract(slice);
        const res = await this.binaryClassifier.predict(toVector(featureMap, FEATURE_ORDER_BINARY));
        label = res.label; probai = res.probAI; probhuman = res.probHuman;

      } else if (task === "model") {
        featureMap = this.modelExtractor!.extract(slice);
        const res = await this.modelClassifier.predictMulticlass(toVector(featureMap, FEATURE_ORDER_MODEL));
        label = 1; probmodel = res.confidence; gen_model = res.predictedModel;

      } else if (task === "binary/model") {
        featureMap = this.binaryExtractor!.extract(slice);
        const binary = await this.binaryClassifier.predict(toVector(featureMap, FEATURE_ORDER_BINARY));
        label = binary.label; probai = binary.probAI; probhuman = binary.probHuman;

        if (binary.label === 1) {
          const modelFeatures = this.modelExtractor!.extract(slice);   // different AI reference
          const model = await this.modelClassifier.predictMulticlass(toVector(modelFeatures, FEATURE_ORDER_MODEL));
          gen_model = model.predictedModel;
          probmodel = model.confidence;
        }
      }

      results.push({ start, end, probai, probhuman, label, features: featureMap, gen_model, probmodel });
    }

    return {
      model: "local/onnx",
      results,
      stride,
      window_size: windowSize,
    };
  }

}

/* function toVector(featureMap: Record<string, number>): number[] {
  return FEATURE_ORDER.map(key => featureMap[key] ?? 0);
} */

function toVector(featureMap: Record<string, number>, order: string[]): number[] {
    return order.map(key => featureMap[key] ?? 0);
}

function splitByChars(
  text: string,
  windowSize: number,
  stride: number
): { start: number; end: number }[] {
  const chunks: { start: number; end: number }[] = [];
  let start = 0;

  while (start < text.length) {
    chunks.push({ start, end: Math.min(start + windowSize, text.length) });
    if (start + windowSize >= text.length) break;
    start += stride;
  }

  return chunks;
}

function splitByWords(
  text: string,
  windowSize: number,
  stride: number
): { start: number; end: number }[] {
  const wordOffsets: { start: number; end: number }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    wordOffsets.push({ start: m.index, end: m.index + m[0].length });
  }

  if (wordOffsets.length < windowSize) return [];

  const chunks: { start: number; end: number }[] = [];

  for (let i = 0; i <= wordOffsets.length - windowSize; i += stride) {
    const from  = wordOffsets[i].start;
    const toIdx = i + windowSize - 1;
    const to    = wordOffsets[toIdx].end;
    chunks.push({ start: from, end: to });
  }

  return chunks;
}