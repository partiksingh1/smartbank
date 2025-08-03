package com.smartbank.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private Long id;

    @NotEmpty
    @Column(unique = true)
    private String accountNumber;

    @NotEmpty
    private String accountType = "Savings";

    private double balance;
    private String branch;

    private String Pin;

    @NotNull
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
