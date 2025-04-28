package com.example.bank;

import com.example.bank.dtos.CustomerDTO;
//import com.example.bank.enums.AccountStatus;
import com.example.bank.services.BankAccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.stream.Stream;

@SpringBootApplication
public class BankAccountServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankAccountServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner start(BankAccountService bankAccountService) {
        return args -> {
            Stream.of("Hassan", "Yassine", "Aicha").forEach(name -> {
                CustomerDTO customer = new CustomerDTO();
                customer.setName(name);
                customer.setEmail(name.toLowerCase() + "@gmail.com");
                bankAccountService.saveCustomer(customer);
            });
            
            bankAccountService.listCustomers().forEach(customer -> {
                try {
                    bankAccountService.saveCurrentAccount(Math.random() * 90000, 9000, customer.getId());
                    bankAccountService.saveSavingAccount(Math.random() * 120000, 5.5, customer.getId());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
            
            // Effectuer quelques opérations
            bankAccountService.listAccounts().forEach(account -> {
                for (int i = 0; i < 10; i++) {
                    try {
                        bankAccountService.credit(account.getId(), 10000 + Math.random() * 120000, "Credit");
                        bankAccountService.debit(account.getId(), 1000 + Math.random() * 9000, "Debit");
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        };
    }
}