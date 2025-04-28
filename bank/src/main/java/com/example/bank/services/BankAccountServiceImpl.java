package com.example.bank.services;

import com.example.bank.dtos.*;
import com.example.bank.entities.*;
import com.example.bank.enums.AccountStatus;
import com.example.bank.enums.OperationType;
import com.example.bank.exceptions.AccountNotFoundException;
import com.example.bank.exceptions.BalanceNotSufficientException;
import com.example.bank.exceptions.CustomerNotFoundException;
import com.example.bank.mappers.BankAccountMapper;
import com.example.bank.repositories.AccountRepository;
import com.example.bank.repositories.CustomerRepository;
import com.example.bank.repositories.OperationRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class BankAccountServiceImpl implements BankAccountService {
    private AccountRepository accountRepository;
    private CustomerRepository customerRepository;
    private OperationRepository operationRepository;
    private BankAccountMapper dtoMapper;

    @Override
    public CustomerDTO saveCustomer(CustomerDTO customerDTO) {
        log.info("Saving new Customer");
        Customer customer = dtoMapper.fromCustomerDTO(customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return dtoMapper.fromCustomer(savedCustomer);
    }

    @Override
    public CurrentAccountDTO saveCurrentAccount(double initialBalance, double overDraft, Long customerId)
            throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null)
            throw new CustomerNotFoundException("Customer not found");

        CurrentAccount currentAccount = new CurrentAccount();
        currentAccount.setId(UUID.randomUUID().toString());
        currentAccount.setCreatedAt(new Date());
        currentAccount.setBalance(initialBalance);
        currentAccount.setOverDraft(overDraft);
        currentAccount.setCustomer(customer);
        currentAccount.setStatus(AccountStatus.CREATED);

        CurrentAccount savedAccount = accountRepository.save(currentAccount);
        return dtoMapper.fromCurrentAccount(savedAccount);
    }

    @Override
    public SavingAccountDTO saveSavingAccount(double initialBalance, double interestRate, Long customerId)
            throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null)
            throw new CustomerNotFoundException("Customer not found");

        SavingAccount savingAccount = new SavingAccount();
        savingAccount.setId(UUID.randomUUID().toString());
        savingAccount.setCreatedAt(new Date());
        savingAccount.setBalance(initialBalance);
        savingAccount.setInterestRate(interestRate);
        savingAccount.setCustomer(customer);
        savingAccount.setStatus(AccountStatus.CREATED);

        SavingAccount savedAccount = accountRepository.save(savingAccount);
        return dtoMapper.fromSavingAccount(savedAccount);
    }

    @Override
    public List<CustomerDTO> listCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(dtoMapper::fromCustomer)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDTO getAccount(String accountId) throws AccountNotFoundException {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        if (account instanceof SavingAccount)
            return dtoMapper.fromSavingAccount((SavingAccount) account);
        else
            return dtoMapper.fromCurrentAccount((CurrentAccount) account);
    }

    @Override
    public void debit(String accountId, double amount, String description)
            throws AccountNotFoundException, BalanceNotSufficientException {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        if (account.getBalance() < amount) {
            throw new BalanceNotSufficientException("Balance not sufficient");
        }

        Operation operation = new Operation();
        operation.setType(OperationType.DEBIT);
        operation.setAmount(amount);
        operation.setDescription(description);
        operation.setOperationDate(new Date());
        operation.setAccount(account);
        operationRepository.save(operation);

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);
    }

    @Override
    public void credit(String accountId, double amount, String description) throws AccountNotFoundException {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        Operation operation = new Operation();
        operation.setType(OperationType.CREDIT);
        operation.setAmount(amount);
        operation.setDescription(description);
        operation.setOperationDate(new Date());
        operation.setAccount(account);
        operationRepository.save(operation);

        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);
    }

    @Override
    public void transfer(String accountIdSource, String accountIdDestination, double amount)
            throws AccountNotFoundException, BalanceNotSufficientException {
        debit(accountIdSource, amount, "Transfer to " + accountIdDestination);
        credit(accountIdDestination, amount, "Transfer from " + accountIdSource);
    }

    @Override
    public List<AccountDTO> listAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream().map(account -> {
            if (account instanceof SavingAccount)
                return dtoMapper.fromSavingAccount((SavingAccount) account);
            else
                return dtoMapper.fromCurrentAccount((CurrentAccount) account);
        }).collect(Collectors.toList());
    }

    @Override
    public List<OperationDTO> accountHistory(String accountId) {
        List<Operation> operations = operationRepository.findByAccountId(accountId, PageRequest.of(0, 10)).getContent();
        return operations.stream().map(dtoMapper::fromOperation).collect(Collectors.toList());
    }

    @Override
    public CustomerDTO getCustomer(Long customerId) throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
        return dtoMapper.fromCustomer(customer);
    }

    @Override
    public void deleteCustomer(Long customerId) {
        customerRepository.deleteById(customerId);
    }
}