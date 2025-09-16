package com.wzfu.QueryService.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@Service
public class QueryService {

    private final RestTemplate restTemplate;
    private final String agentUrl;

    public QueryService(RestTemplate restTemplate, @Value("http://python-agent:5005/query") String agentUrl) {
        this.restTemplate = restTemplate;
        this.agentUrl = agentUrl;
    }

    public String askQuery(String query) {
        try {
            Map<String, String> payload = new HashMap<>();
            payload.put("query", query);

            ResponseEntity<Map> response = restTemplate.postForEntity(agentUrl, payload, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().get("answer").toString();
            }
            return "No answer received from agent.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error querying agent: " + e.getMessage();
        }
    }
}