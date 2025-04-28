package com.example.bank.entities;

import com.example.bank.enums.OperationType;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Operation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date operationDate;
    private double amount;
    private String description;

    @Enumerated(EnumType.STRING)
    private OperationType type;

    @ManyToOne
    private Account account;
}