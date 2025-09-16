package com.wzfu.FileService.service;

import com.wzfu.FileService.model.FileDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final RestTemplate restTemplate;

    // Send multiple files to Python Agent
    public void sendToAgent(List<FileDocument> files) {
        try {
//            python-agent
            String agentUrl = "http://python-agent:5005/process-multi"; // Python endpoint for multiple files
            String response = restTemplate.postForObject(agentUrl, files, String.class);
            System.out.println("Agent Response: " + response);
        } catch (Exception e) {
            System.err.println("Failed to send files to agent: " + e.getMessage());
        }
    }
}
