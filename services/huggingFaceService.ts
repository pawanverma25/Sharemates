import axios from "axios";
import apiClient from "./apiClient";
import { expenseCategories } from "@/constants/expense";

export const categorizeTextWithHuggingFace = async (text: string) => {
    try {
        const keyResponse = await apiClient.get(`/getHugginFaceAPIKey`);
        const apiKey = keyResponse?.data;
        if (!apiKey) return "Unknown";

        const response = await axios.post(
            "https://api-inference.huggingface.co/models/joeddav/xlm-roberta-large-xnli",
            {
                inputs: text,
                parameters: { candidate_labels: expenseCategories },
            },
            {
                headers: { Authorization: `Bearer ${apiKey}` },
            }
        );

        return response.data?.labels?.[0] || "Unknown";
    } catch (error: any) {
        console.error("Error categorizing text:", error?.message || "Categorization request failed");
        return "Unknown";
    }
};
