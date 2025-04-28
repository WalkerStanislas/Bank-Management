package com.example.bank.dtos;

import com.example.bank.enums.OperationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor
public class OperationDTO {
    private Long id;
    private Date operationDate;
    private double amount;
    private String description;
    private OperationType type;
    private String accountId;
}