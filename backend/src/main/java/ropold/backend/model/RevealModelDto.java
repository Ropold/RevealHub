package ropold.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RevealModelDto(
        @NotBlank
        @Size(min = 3, message = "Name must be at least 3 characters long")
        String name,

        @NotEmpty(message = "Solution words cannot be empty")
        List<String> solutionWords,

        List<String> closeSolutionWords,

        @NotNull(message = "Category is required")
        Category category,

        String description,
        boolean isActive,
        String githubId,

        @NotBlank(message = "Image URL cannot be blank")
        String imageUrl
) {
}

