package com.example.bank.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("SAVE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SavingAccount extends Account {
    private double interestRate;
}