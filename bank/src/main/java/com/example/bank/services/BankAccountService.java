package com.example.bank.services;

import com.example.bank.dtos.*;
import com.example.bank.exceptions.AccountNotFoundException;
import com.example.bank.exceptions.BalanceNotSufficientException;
import com.example.bank.exceptions.CustomerNotFoundException;

import java.util.List;

public interface BankAccountService {
    CustomerDTO saveCustomer(CustomerDTO customerDTO);

    CurrentAccountDTO saveCurrentAccount(double initialBalance, double overDraft, Long customerId)
            throws CustomerNotFoundException;

    SavingAccountDTO saveSavingAccount(double initialBalance, double interestRate, Long customerId)
            throws CustomerNotFoundException;

    List<CustomerDTO> listCustomers();

    AccountDTO getAccount(String accountId) throws AccountNotFoundException;

    void debit(String accountId, double amount, String description)
            throws AccountNotFoundException, BalanceNotSufficientException;

    void credit(String accountId, double amount, String description) throws AccountNotFoundException;

    void transfer(String accountIdSource, String accountIdDestination, double amount)
            throws AccountNotFoundException, BalanceNotSufficientException;

    List<AccountDTO> listAccounts();

    List<OperationDTO> accountHistory(String accountId);

    CustomerDTO getCustomer(Long customerId) throws CustomerNotFoundException;

    void deleteCustomer(Long customerId);
}