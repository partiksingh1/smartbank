package com.smartbank.repository;

import com.smartbank.entity.Account;
import com.smartbank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction,Long> {
}
