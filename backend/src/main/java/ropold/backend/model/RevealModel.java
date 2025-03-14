package ropold.backend.model;

import java.util.List;

public record RevealModel(
        String id,
        String name,
        List<String> solutionWords,
        List<String> closeSolutionWords,
        Category category,
        String description,
        boolean isActive,
        String appUserGithubId,
        String appUserUsername,
        String appUserAvatarUrl,
        String appUserGithubUrl,
        String imageUrl
) {
}
