package com.example.bank.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequestDTO {
    private String accountSource;
    private String accountDestination;
    private double amount;
}