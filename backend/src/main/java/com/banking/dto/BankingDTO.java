package com.banking.dto;

import com.banking.model.Account;
import com.banking.model.Transaction;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BankingDTO {

    @Data
    public static class CreateAccountRequest {
        @NotNull(message = "Account type is required")
        private Account.AccountType accountType;

        private BigDecimal initialDeposit = BigDecimal.ZERO;
    }

    @Data
    public static class AccountResponse {
        private Long id;
        private String accountNumber;
        private Account.AccountType accountType;
        private BigDecimal balance;
        private Account.AccountStatus status;
        private LocalDateTime createdAt;

        public static AccountResponse from(Account account) {
            AccountResponse r = new AccountResponse();
            r.id = account.getId();
            r.accountNumber = account.getAccountNumber();
            r.accountType = account.getAccountType();
            r.balance = account.getBalance();
            r.status = account.getStatus();
            r.createdAt = account.getCreatedAt();
            return r;
        }
    }

    @Data
    public static class DepositWithdrawRequest {
        @NotNull(message = "Account number is required")
        private String accountNumber;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        private BigDecimal amount;

        private String description;
    }

    @Data
    public static class TransferRequest {
        @NotBlank(message = "From account is required")
        private String fromAccountNumber;

        @NotBlank(message = "To account is required")
        private String toAccountNumber;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        private BigDecimal amount;

        private String description;
    }

    @Data
    public static class TransactionResponse {
        private Long id;
        private String transactionId;
        private Transaction.TransactionType type;
        private BigDecimal amount;
        private BigDecimal balanceAfter;
        private String description;
        private String toAccountNumber;
        private Transaction.TransactionStatus status;
        private LocalDateTime createdAt;

        public static TransactionResponse from(Transaction t) {
            TransactionResponse r = new TransactionResponse();
            r.id = t.getId();
            r.transactionId = t.getTransactionId();
            r.type = t.getType();
            r.amount = t.getAmount();
            r.balanceAfter = t.getBalanceAfter();
            r.description = t.getDescription();
            r.toAccountNumber = t.getToAccountNumber();
            r.status = t.getStatus();
            r.createdAt = t.getCreatedAt();
            return r;
        }
    }
}
