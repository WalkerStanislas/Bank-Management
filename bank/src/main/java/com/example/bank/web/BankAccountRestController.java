package com.example.bank.web;

import com.example.bank.dtos.*;
import com.example.bank.exceptions.AccountNotFoundException;
import com.example.bank.exceptions.BalanceNotSufficientException;
import com.example.bank.exceptions.CustomerNotFoundException;
import com.example.bank.services.BankAccountService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin("*")
public class BankAccountRestController {
    private BankAccountService bankAccountService;

    @GetMapping("/customers")
    public List<CustomerDTO> customers() {
        return bankAccountService.listCustomers();
    }

    @GetMapping("/customers/{id}")
    public CustomerDTO getCustomer(@PathVariable(name = "id") Long customerId) throws CustomerNotFoundException {
        return bankAccountService.getCustomer(customerId);
    }

    @PostMapping("/customers")
    public CustomerDTO saveCustomer(@RequestBody CustomerDTO customerDTO) {
        return bankAccountService.saveCustomer(customerDTO);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        bankAccountService.deleteCustomer(id);
    }

    @GetMapping("/accounts")
    public List<AccountDTO> listAccounts() {
        return bankAccountService.listAccounts();
    }

    @GetMapping("/accounts/{id}")
    public AccountDTO getAccount(@PathVariable String id) throws AccountNotFoundException {
        return bankAccountService.getAccount(id);
    }

    @PostMapping("/accounts/current")
    public CurrentAccountDTO saveCurrentAccount(@RequestBody CurrentAccountDTO currentAccountDTO)
            throws CustomerNotFoundException {
        return bankAccountService.saveCurrentAccount(
                currentAccountDTO.getBalance(),
                currentAccountDTO.getOverDraft(),
                currentAccountDTO.getCustomerDTO().getId());
    }

    @PostMapping("/accounts/saving")
    public SavingAccountDTO saveSavingAccount(@RequestBody SavingAccountDTO savingAccountDTO)
            throws CustomerNotFoundException {
        return bankAccountService.saveSavingAccount(
                savingAccountDTO.getBalance(),
                savingAccountDTO.getInterestRate(),
                savingAccountDTO.getCustomerDTO().getId());
    }

    @GetMapping("/accounts/{id}/operations")
    public List<OperationDTO> accountOperations(@PathVariable String id) {
        return bankAccountService.accountHistory(id);
    }

    @PostMapping("/accounts/{id}/debit")
    public void debit(@PathVariable String id, @RequestBody OperationDTO operationDTO)
            throws AccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.debit(id, operationDTO.getAmount(), operationDTO.getDescription());
    }

    @PostMapping("/accounts/{id}/credit")
    public void credit(@PathVariable String id, @RequestBody OperationDTO operationDTO)
            throws AccountNotFoundException {
        bankAccountService.credit(id, operationDTO.getAmount(), operationDTO.getDescription());
    }

    @PostMapping("/accounts/transfer")
    public void transfer(@RequestBody TransferRequestDTO transferRequestDTO)
            throws AccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.transfer(
                transferRequestDTO.getAccountSource(),
                transferRequestDTO.getAccountDestination(),
                transferRequestDTO.getAmount());
    }
}