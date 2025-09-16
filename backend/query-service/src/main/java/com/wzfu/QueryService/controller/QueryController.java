package com.wzfu.QueryService.controller;

import com.wzfu.QueryService.dtos.QueryRequest;
import com.wzfu.QueryService.service.QueryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/query")
public class QueryController {

    private final QueryService queryService;

    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    @PostMapping
    public String ask(@RequestBody QueryRequest request) {
        return queryService.askQuery(request.getQuery());
    }
}