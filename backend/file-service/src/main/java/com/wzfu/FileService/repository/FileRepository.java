package com.wzfu.FileService.repository;

import com.wzfu.FileService.model.FileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FileRepository extends MongoRepository<FileDocument,String> {
    Optional<FileDocument> findByFileName(String fileName);
}
