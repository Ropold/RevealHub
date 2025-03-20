package ropold.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record HighScoreModel(
        String id,
        @NotBlank(message = "Player name must not be blank")
        @Size(min = 3, message = "Name must contain at least 3 characters")
        String playerName,
        String githubId,
        Category category,
        GameMode gameMode,
        double scoreTime,
        int numberOfClicks,
        @NotNull LocalDateTime date
) {
}
