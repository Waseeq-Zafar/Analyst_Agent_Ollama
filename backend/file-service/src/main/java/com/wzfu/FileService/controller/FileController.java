package com.wzfu.FileService.controller;


import com.wzfu.FileService.model.FileDocument;
import com.wzfu.FileService.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    // Upload multiple files
    @PostMapping("/upload")
    public List<FileDocument> uploadFiles(@RequestParam("files") MultipartFile[] files) throws IOException {
        return fileService.uploadFiles(files);
    }

    // List all files
    @GetMapping
    public List<FileDocument> listFiles() {
        return fileService.listAllFiles();
    }

    // Search files
    @GetMapping("/search")
    public List<FileDocument> searchFiles(@RequestParam String keyword) {
        return fileService.searchFiles(keyword);
    }
}
