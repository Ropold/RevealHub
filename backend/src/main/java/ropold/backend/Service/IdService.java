package ropold.backend.Service;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class IdService {
    public String generateRandomId() {
        return UUID.randomUUID().toString();
    }
}
