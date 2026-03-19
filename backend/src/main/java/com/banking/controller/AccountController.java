package com.banking.controller;

import com.banking.dto.BankingDTO;
import com.banking.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(Authentication auth,
                                           @Valid @RequestBody BankingDTO.CreateAccountRequest request) {
        try {
            return ResponseEntity.ok(accountService.createAccount(auth.getName(), request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-accounts")
    public ResponseEntity<List<BankingDTO.AccountResponse>> getMyAccounts(Authentication auth) {
        return ResponseEntity.ok(accountService.getUserAccounts(auth.getName()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(Authentication auth,
                                     @Valid @RequestBody BankingDTO.DepositWithdrawRequest request) {
        try {
            return ResponseEntity.ok(accountService.deposit(auth.getName(), request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(Authentication auth,
                                      @Valid @RequestBody BankingDTO.DepositWithdrawRequest request) {
        try {
            return ResponseEntity.ok(accountService.withdraw(auth.getName(), request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(Authentication auth,
                                      @Valid @RequestBody BankingDTO.TransferRequest request) {
        try {
            accountService.transfer(auth.getName(), request);
            return ResponseEntity.ok("Transfer successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<?> getTransactions(Authentication auth,
                                             @PathVariable String accountNumber) {
        try {
            return ResponseEntity.ok(accountService.getTransactions(accountNumber, auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
