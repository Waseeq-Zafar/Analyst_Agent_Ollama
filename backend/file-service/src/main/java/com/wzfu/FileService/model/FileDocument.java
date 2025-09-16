package com.wzfu.FileService.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "files")
public class FileDocument {

    @Id
    private String id;

    private String fileName;
    private String contentType;
    private String data;
}
