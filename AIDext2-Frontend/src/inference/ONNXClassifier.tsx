// AIDetx2 - Web interface for AI-generated text detection.
// Copyright (C) 2026 Diogo Silva
// Licensed under the GNU GPL-3.0-or-later.
// See the LICENSE file for details.
import * as ort from "onnxruntime-web";

const LABEL_MAP: Record<number, string> = {
    0: "deepseek",
    1: "gpt_oss",
    2: "llama",
    3: "mistral7b",
    4: "mistral_nemo"
};

export class ONNXClassifier {

    private session?: ort.InferenceSession;


    /* async load() {

        this.session =
            await ort.InferenceSession.create(
                "../../public/binary_model.onnx"
            );
    } */

    /* async load() {
        
        this.session = await ort.InferenceSession.create("/AIDext2-Frontend/binary_model_no_pos_zipmap.onnx",{ executionProviders: ["wasm"]});

        console.log(this.session);
        
        console.log("Input names:",  this.session.inputNames);
        console.log("Output names:", this.session.outputNames);
    } */

    async load(path: string = "/binary_model_no_pos_zipmap.onnx") {
        //ort.env.wasm.wasmPaths = "/AIDext2-Frontend/";
        this.session = await ort.InferenceSession.create(path, {
            executionProviders: ["wasm"]
        });
    }

   /*  async predict(features: number[]) {
        if (!this.session) throw new Error("Model not loaded");

        console.log("Feature length:", features.length);
        console.log("Non-zero features:", features.filter(f => f !== 0).length);
        console.log("Features:", features);

        const tensor = new ort.Tensor(
            "float32",
            Float32Array.from(features),
            [1, features.length]
        );

        const output = await this.session.run({ float_input: tensor });

        const label = Number(output["label"].data[0]);
        const probability = output["probabilities"].data[1];

        console.log("probability",probability)

        console.log("Label:", label, "Probability:", probability);
        //console.log("All probabilities:", Array.from(output["probabilities"].data));

        return { label, probability: probability as number };
    } */

    async predictMulticlass(features: number[]) {
        if (!this.session) throw new Error("Model not loaded");

        const tensor = new ort.Tensor("float32", Float32Array.from(features), [1, features.length]);
        const output = await this.session.run({ float_input: tensor });
        //console.log("Output multiclass",output)

        const label = Number(output["label"].data[0]);
        const probabilities = Array.from(output["probabilities"].data as Float32Array);
        const predictedModel = LABEL_MAP[label];
        const confidence = probabilities[label];

        //console.log("Predicted model:", predictedModel, "| Confidence:", confidence.toFixed(4));

        return { label, predictedModel, confidence, probabilities };
    }

    async predict(features: number[]) {
        if (!this.session) throw new Error("Model not loaded");

        /* console.table(
            features.map((val, i) => ({
            feature: FEATURE_NAMES[i] ?? `feat_${i}`,
            value: val,
            zero: val === 0,
            }))
        ); */

        const tensor = new ort.Tensor(
            "float32",
            Float32Array.from(features),
            [1, features.length]
        );

        const output = await this.session.run({ float_input: tensor });

        //console.log("Outpu",output)

        const label = Number(output["label"].data[0]);
        const probHuman = output["probabilities"].data[0] as number;
        const probAI = output["probabilities"].data[1] as number;

        /* console.log(
            "Label:", label === 1 ? "AI" : "Human",
            "| P(Human):", probHuman.toFixed(4),
            "| P(AI):", probAI.toFixed(4)
        ); */

        return { label, probHuman, probAI };
    }

}