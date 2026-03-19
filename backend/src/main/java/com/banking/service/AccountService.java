package com.banking.service;

import com.banking.dto.BankingDTO;
import com.banking.model.Account;
import com.banking.model.Transaction;
import com.banking.model.User;
import com.banking.repository.AccountRepository;
import com.banking.repository.TransactionRepository;
import com.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired private AccountRepository accountRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private UserRepository userRepository;

    public BankingDTO.AccountResponse createAccount(String email, BankingDTO.CreateAccountRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = Account.builder()
                .accountNumber(generateAccountNumber())
                .accountType(request.getAccountType())
                .balance(request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO)
                .user(user)
                .build();

        Account saved = accountRepository.save(account);

        if (request.getInitialDeposit() != null && request.getInitialDeposit().compareTo(BigDecimal.ZERO) > 0) {
            recordTransaction(saved, Transaction.TransactionType.DEPOSIT,
                    request.getInitialDeposit(), saved.getBalance(), "Initial deposit", null);
        }

        return BankingDTO.AccountResponse.from(saved);
    }

    public List<BankingDTO.AccountResponse> getUserAccounts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return accountRepository.findByUserId(user.getId())
                .stream().map(BankingDTO.AccountResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public BankingDTO.AccountResponse deposit(String email, BankingDTO.DepositWithdrawRequest request) {
        Account account = getAccountAndValidateOwner(request.getAccountNumber(), email);
        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);
        recordTransaction(account, Transaction.TransactionType.DEPOSIT,
                request.getAmount(), account.getBalance(),
                request.getDescription() != null ? request.getDescription() : "Deposit", null);
        return BankingDTO.AccountResponse.from(account);
    }

    @Transactional
    public BankingDTO.AccountResponse withdraw(String email, BankingDTO.DepositWithdrawRequest request) {
        Account account = getAccountAndValidateOwner(request.getAccountNumber(), email);
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);
        recordTransaction(account, Transaction.TransactionType.WITHDRAWAL,
                request.getAmount(), account.getBalance(),
                request.getDescription() != null ? request.getDescription() : "Withdrawal", null);
        return BankingDTO.AccountResponse.from(account);
    }

    @Transactional
    public void transfer(String email, BankingDTO.TransferRequest request) {
        Account fromAccount = getAccountAndValidateOwner(request.getFromAccountNumber(), email);
        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        String desc = request.getDescription() != null ? request.getDescription() : "Fund Transfer";

        recordTransaction(fromAccount, Transaction.TransactionType.TRANSFER,
                request.getAmount(), fromAccount.getBalance(), desc, request.getToAccountNumber());
        recordTransaction(toAccount, Transaction.TransactionType.TRANSFER,
                request.getAmount(), toAccount.getBalance(), "Received: " + desc, null);
    }

    public List<BankingDTO.TransactionResponse> getTransactions(String accountNumber, String email) {
        Account account = getAccountAndValidateOwner(accountNumber, email);
        return transactionRepository.findByAccountIdOrderByCreatedAtDesc(account.getId())
                .stream().map(BankingDTO.TransactionResponse::from).collect(Collectors.toList());
    }

    private Account getAccountAndValidateOwner(String accountNumber, String email) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized access to account");
        }
        return account;
    }

    private void recordTransaction(Account account, Transaction.TransactionType type,
                                    BigDecimal amount, BigDecimal balanceAfter,
                                    String description, String toAccountNumber) {
        Transaction tx = Transaction.builder()
                .transactionId(UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .type(type)
                .amount(amount)
                .balanceAfter(balanceAfter)
                .description(description)
                .toAccountNumber(toAccountNumber)
                .account(account)
                .build();
        transactionRepository.save(tx);
    }

    private String generateAccountNumber() {
        String number;
        do {
            number = "ACC" + (1000000000L + new Random().nextInt(900000000));
        } while (accountRepository.existsByAccountNumber(number));
        return number;
    }
}
