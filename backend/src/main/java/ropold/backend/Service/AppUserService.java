package ropold.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AppUserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUser getUserById(String userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<String> getUserFavorites(String userId) {
        AppUser user = getUserById(userId);
        return user.favorites();
    }

    public void addRevealToFavorites(String authenticatedUserId, String revealId) {
        AppUser user = getUserById(authenticatedUserId);

        if (!user.favorites().contains(revealId)) {
            user.favorites().add(revealId);
            appUserRepository.save(user);
        }
    }

    public void removeRevealFromFavorites(String authenticatedUserId, String revealId) {
        AppUser user = getUserById(authenticatedUserId);

        if (user.favorites().contains(revealId)) {
            user.favorites().remove(revealId);
            appUserRepository.save(user);
        }
    }
}
