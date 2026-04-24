package com.tcb_server.auth.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private final ConcurrentHashMap<String, ResetEntry> store = new ConcurrentHashMap<>();

    private record ResetEntry(String code, LocalDateTime expiresAt, boolean verified) {}

    public String generateAndStoreCode(String email) {
        String code = String.format("%06d", new Random().nextInt(1_000_000));
        store.put(email.toLowerCase(), new ResetEntry(code, LocalDateTime.now().plusMinutes(3), false));
        return code;
    }

    public boolean verifyCode(String email, String code) {
        String key = email.toLowerCase();
        ResetEntry entry = store.get(key);
        if (entry == null || LocalDateTime.now().isAfter(entry.expiresAt())) {
            store.remove(key);
            return false;
        }
        if (!entry.code().equals(code)) {
            return false;
        }
        store.put(key, new ResetEntry(entry.code(), entry.expiresAt(), true));
        return true;
    }

    public boolean isVerified(String email) {
        ResetEntry entry = store.get(email.toLowerCase());
        return entry != null && entry.verified() && LocalDateTime.now().isBefore(entry.expiresAt());
    }

    public void clear(String email) {
        store.remove(email.toLowerCase());
    }
}
