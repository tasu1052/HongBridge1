package com.example.HongBridge.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.stream.Collectors;

@Service
public class OpenAiService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.organization.id:}")  // 선택적으로 org ID 사용
    private String organizationId;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getChatResponse(String userMessage) throws Exception {
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setRequestProperty("Content-Type", "application/json");

        if (organizationId != null && !organizationId.isEmpty()) {
            conn.setRequestProperty("OpenAI-Organization", organizationId);
        }

        conn.setDoOutput(true);

        String requestBody = "{\n" +
                "  \"model\": \"gpt-3.5-turbo\",\n" +
                "  \"messages\": [\n" +
                "    {\"role\": \"system\", \"content\": \"You are a helpful assistant.\"},\n" +
                "    {\"role\": \"user\", \"content\": \"" + userMessage + "\"}\n" +
                "  ]\n" +
                "}";

        try (OutputStream os = conn.getOutputStream()) {
            os.write(requestBody.getBytes());
            os.flush();
        }

        int statusCode = conn.getResponseCode();

        InputStream responseStream = (statusCode >= 200 && statusCode < 300)
                ? conn.getInputStream()
                : conn.getErrorStream();

        String responseBody = new BufferedReader(new InputStreamReader(responseStream))
                .lines().collect(Collectors.joining("\n"));

        if (statusCode != 200) {
            throw new RuntimeException("OpenAI API 요청 실패 (" + statusCode + "): " + responseBody);
        }

        JsonNode response = objectMapper.readTree(responseBody);
        return response.get("choices").get(0).get("message").get("content").asText();
    }
}
