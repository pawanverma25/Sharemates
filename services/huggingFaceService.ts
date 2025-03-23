import axios from "axios";
import apiClient from "./apiClient";
import { expenseCategories } from "@/util/constants";

export const categorizeTextWithHuggingFace = async (text: string) => {
    try {
        const API_KEY = await apiClient.get(`/getHugginFaceAPIKey`);
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/joeddav/xlm-roberta-large-xnli",
            {
                inputs: text,
                parameters: { candidate_labels: expenseCategories },
            },
            {
                headers: { Authorization: `Bearer ${API_KEY}` },
            }
        );

        return response.data.labels[0];
    } catch (error) {
        console.error("Error categorizing text:", error);
        return "Unknown";
    }
};
