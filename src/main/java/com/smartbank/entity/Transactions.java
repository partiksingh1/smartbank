package com.smartbank.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Transactions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private long id;

    @Enumerated(EnumType.STRING)
    private TranscationType transactionType;
    private Date transactionDate;

    @ManyToOne
    @JoinColumn(name = "source_account_id")
    private Account sourceAccount;

    @ManyToOne
    @JoinColumn(name = "target_account_id")
    private Account targetAccount;
}
