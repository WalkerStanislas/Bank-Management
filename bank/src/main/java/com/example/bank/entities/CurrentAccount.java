package com.example.bank.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("CURR")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CurrentAccount extends Account {
    private double overDraft;
}