package com.example.bank.entities;

import com.example.bank.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "ACCOUNT_TYPE", discriminatorType = DiscriminatorType.STRING, length = 4)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Account {
    @Id
    private String id;
    private double balance;
    private Date createdAt;
    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @ManyToOne
    private Customer customer;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    private List<Operation> operations;
}