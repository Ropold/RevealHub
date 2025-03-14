package ropold.backend.controller;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import ropold.backend.model.Category;
import ropold.backend.model.RevealModel;
import ropold.backend.repository.RevealRepository;

import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RevealControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    RevealRepository revealRepository;

    @BeforeEach
    void setup() {
        revealRepository.deleteAll();

        RevealModel revealModel1 = new RevealModel(
                "1",
                "Bobby Brown",
                List.of("word1", "word2", "word3"),
                List.of("closeWord1", "closeWord2"),
                Category.ANIMAL,
                "Sample description for the RevealModel.",
                true,
                "user",
                "user1",
                "https://avatars.example.com/user1.png",
                "https://github.com/user1",
                "https://example.com/image1.jpg"
        );

        RevealModel revealModel2 = new RevealModel(
                "2",
                "Johnny Cash",
                List.of("Solution1", "Solution2"),
                List.of("Close Solution1", "Close Solution2"),
                Category.FOOD,
                "A brief description",
                true,
                "user",
                "user1",
                "https://avatars.example.com/user1.png",
                "https://github.com/user1",
                "https://example.com/image1.jpg"
        );
        revealRepository.saveAll(List.of(revealModel1, revealModel2));
    }

    @Test
    void getAllReveals_shouldReturnAllReveals() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/reveal-hub")
                )

                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                [
                    {
                        "id": "1",
                        "name": "Bobby Brown",
                        "solutionWords": ["word1", "word2", "word3"],
                        "closeSolutionWords": ["closeWord1", "closeWord2"],
                        "category": "ANIMAL",
                        "description": "Sample description for the RevealModel.",
                        "isActive": true,
                        "appUserGithubId": "user",
                        "appUserUsername": "user1",
                        "appUserAvatarUrl": "https://avatars.example.com/user1.png",
                        "appUserGithubUrl": "https://github.com/user1",
                        "imageUrl": "https://example.com/image1.jpg"
                    },
                    {
                        "id": "2",
                        "name": "Johnny Cash",
                        "solutionWords": ["Solution1", "Solution2"],
                        "closeSolutionWords": ["Close Solution1", "Close Solution2"],
                        "category": "FOOD",
                        "description": "A brief description",
                        "isActive": true,
                        "appUserGithubId": "user",
                        "appUserUsername": "user1",
                        "appUserAvatarUrl": "https://avatars.example.com/user1.png",
                        "appUserGithubUrl": "https://github.com/user1",
                        "imageUrl": "https://example.com/image1.jpg"
                    }
                ]
            """));
    }

    @Test
    void postTestReveal_shouldReturnCreatedReveal() throws Exception {
        revealRepository.deleteAll();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/reveal-hub/test-add")
                .contentType("application/json")
                .content("""
                    {
                        "name": "Test Reveal",
                        "solutionWords": ["Solution1", "Solution2"],
                        "closeSolutionWords": ["Close Solution1", "Close Solution2"],
                        "category": "FOOD",
                        "description": "A brief description",
                        "isActive": true,
                        "appUserGithubId": "user",
                        "appUserUsername": "user1",
                        "appUserAvatarUrl": "https://avatars.example.com/user1.png",
                        "appUserGithubUrl": "https://github.com/user1",
                        "imageUrl": "https://example.com/image1.jpg"
                    }
                    """)
        ).andExpect(status().isCreated());

        List<RevealModel> allReveals = revealRepository.findAll();
        Assertions.assertEquals(1, allReveals.size());

        RevealModel revealModel = allReveals.getFirst();
        org.assertj.core.api.Assertions.assertThat(revealModel)
                .hasFieldOrPropertyWithValue("name", "Test Reveal")
                .hasFieldOrPropertyWithValue("solutionWords", List.of("Solution1", "Solution2"))
                .hasFieldOrPropertyWithValue("closeSolutionWords", List.of("Close Solution1", "Close Solution2"))
                .hasFieldOrPropertyWithValue("category", Category.FOOD)
                .hasFieldOrPropertyWithValue("description", "A brief description")
                .hasFieldOrPropertyWithValue("isActive", true)
                .hasFieldOrPropertyWithValue("appUserGithubId", "user")
                .hasFieldOrPropertyWithValue("appUserUsername", "user1")
                .hasFieldOrPropertyWithValue("appUserAvatarUrl", "https://avatars.example.com/user1.png")
                .hasFieldOrPropertyWithValue("appUserGithubUrl", "https://github.com/user1")
                .hasFieldOrPropertyWithValue("imageUrl", "https://example.com/image1.jpg");
    }


}
