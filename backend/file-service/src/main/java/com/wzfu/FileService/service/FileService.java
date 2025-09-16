package com.wzfu.FileService.service;

import com.wzfu.FileService.model.FileDocument;
import com.wzfu.FileService.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final AgentService agentService; // Service to send files to Python Agent

    // Upload multiple files
    public List<FileDocument> uploadFiles(MultipartFile[] files) throws IOException {

        List<FileDocument> filesToSend = Stream.of(files)
                .map(file -> {
                    try {
                        // Convert file to Base64 (safe for text + PDF)
                        String jsonData = Base64.getEncoder().encodeToString(file.getBytes());

                        FileDocument doc;
                        var existing = fileRepository.findByFileName(file.getOriginalFilename());
                        if (existing.isPresent()) {
                            doc = existing.get(); // use existing file
                            doc.setData(jsonData); // optionally update content
                        } else {
                            doc = new FileDocument();
                            doc.setFileName(file.getOriginalFilename());
                            doc.setContentType(file.getContentType());
                            doc.setData(jsonData);
                            fileRepository.save(doc);
                        }
                        return doc;

                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());

        // Send all files to Python Agent
        if (!filesToSend.isEmpty()) {
            agentService.sendToAgent(filesToSend);
        }

        return filesToSend;
    }

    // List all files
    public List<FileDocument> listAllFiles() {
        return fileRepository.findAll();
    }

    // Search files by name
    public List<FileDocument> searchFiles(String keyword) {
        return fileRepository.findAll().stream()
                .filter(f -> f.getFileName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }
}
