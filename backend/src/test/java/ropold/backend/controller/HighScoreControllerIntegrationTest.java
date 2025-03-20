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
import ropold.backend.model.GameMode;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class HighScoreControllerIntegrationTest {

    @Autowired
    private HighScoreRepository highScoreRepository;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        highScoreRepository.deleteAll();

        // Fester Zeitstempel für Teststabilität
        LocalDateTime fixedDate = LocalDateTime.of(2025, 3, 5, 12, 0, 0);

        HighScoreModel highScoreModel1 = new HighScoreModel(
                "1", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 10.2, 0, fixedDate);

        HighScoreModel highScoreModel2 = new HighScoreModel(
                "2", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 14.5, 15,fixedDate.minusMinutes(5));

        highScoreRepository.saveAll(List.of(highScoreModel1, highScoreModel2));
    }

    @Test
    void getBestHighScoresWithClicks_shouldReturnClicksHighScore() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/high-score/reveal-with-clicks"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
            [
                {
                    "id": "2",
                    "playerName": "player1",
                    "githubId": "123456",
                    "category": "ANIMAL",
                    "gameMode": "REVEAL_WITH_CLICKS",
                    "scoreTime": 14.5,
                    "numberOfClicks": 15,
                    "date": "2025-03-05T11:55:00"
                }
            ]
            """));
    }

    @Test
    void getBestHighScoresWithTime_shouldReturnTimeHighScore() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/high-score/reveal-over-time"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
            [
                {
                    "id": "1",
                    "playerName": "player1",
                    "githubId": "123456",
                    "category": "ANIMAL",
                    "gameMode": "REVEAL_OVER_TIME",
                    "scoreTime": 10.2,
                    "numberOfClicks": 0,
                    "date": "2025-03-05T12:00:00"
                }
            ]
            """));
    }

    @Test
    void postHighScore_shouldReturnSavedHighScore() throws Exception {
        // GIVEN
        highScoreRepository.deleteAll();

        String highScoreJson = """
        {
            "playerName": "player1",
            "githubId": "123456",
            "category": "ANIMAL",
            "gameMode": "REVEAL_OVER_TIME",
            "scoreTime": 9.5,
            "numberOfClicks": 0,
            "date": "2025-03-05T12:00:00"
        }
        """;

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/high-score")
                        .contentType("application/json")
                        .content(highScoreJson))
                .andExpect(status().isCreated());

        // THEN
        List<HighScoreModel> allHighScores = highScoreRepository.findAll();
        Assertions.assertEquals(1, allHighScores.size());

        HighScoreModel savedHighScore = allHighScores.getFirst();

        org.assertj.core.api.Assertions.assertThat(savedHighScore)
                .usingRecursiveComparison()
                .ignoringFields("id", "date")
                .isEqualTo(new HighScoreModel(
                        null,
                        "player1",
                        "123456",
                        Category.ANIMAL,
                        GameMode.REVEAL_OVER_TIME,
                        9.5,
                        0,
                        null
                ));
    }

    @Test
    void postHighScore_withHighTime_shouldNotSave() throws Exception {

        highScoreRepository.deleteAll();

        LocalDateTime fixedDate = LocalDateTime.of(2025, 3, 5, 12, 0, 0);

        List<HighScoreModel> existingScores = List.of(
                new HighScoreModel("1", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 10.2, 0, fixedDate),
                new HighScoreModel("2", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 10.5, 0, fixedDate),
                new HighScoreModel("3", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 10.7, 0, fixedDate),
                new HighScoreModel("4", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 11.0, 0, fixedDate),
                new HighScoreModel("5", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 11.2, 0, fixedDate),
                new HighScoreModel("6", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 11.5, 0, fixedDate),
                new HighScoreModel("7", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 11.7, 0, fixedDate),
                new HighScoreModel("8", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 12.0, 0, fixedDate),
                new HighScoreModel("9", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 12.2, 0, fixedDate),
                new HighScoreModel("10", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 12.5, 0, fixedDate)
        );

        highScoreRepository.saveAll(existingScores);
        Assertions.assertEquals(10, highScoreRepository.count());

        String highScoreJson = """
        {
            "playerName": "player1",
            "githubId": "123456",
            "category": "ANIMAL",
            "gameMode": "REVEAL_OVER_TIME",
            "scoreTime": 12.6,
            "numberOfClicks": 0,
            "date": "2025-03-05T12:00:00"
        }
        """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/high-score")
                        .contentType("application/json")
                        .content(highScoreJson))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.content().string(""));


        List<HighScoreModel> allHighScores = highScoreRepository.findAll();
        Assertions.assertEquals(10, allHighScores.size());
    }

    @Test
    void postHighScore_withHighClick_shouldNotSave() throws Exception {
        highScoreRepository.deleteAll();

        LocalDateTime fixedDate = LocalDateTime.of(2025, 3, 5, 12, 0, 0);

        List<HighScoreModel> existingScores = List.of(
                new HighScoreModel("1", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 10.2, 0, fixedDate),
                new HighScoreModel("2", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 10.5, 1, fixedDate),
                new HighScoreModel("3", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 10.7, 2, fixedDate),
                new HighScoreModel("4", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 11.0, 3, fixedDate),
                new HighScoreModel("5", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 11.2, 4, fixedDate),
                new HighScoreModel("6", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 11.5, 5, fixedDate),
                new HighScoreModel("7", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 11.7, 6, fixedDate),
                new HighScoreModel("8", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 12.0, 7, fixedDate),
                new HighScoreModel("9", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 12.2, 8, fixedDate),
                new HighScoreModel("10", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 12.5, 9, fixedDate)
        );

        highScoreRepository.saveAll(existingScores);
        Assertions.assertEquals(10, highScoreRepository.count());

        String highScoreJson = """
        {
            "playerName": "player1",
            "githubId": "123456",
            "category": "ANIMAL",
            "gameMode": "REVEAL_WITH_CLICKS",
            "scoreTime": 12.6,
            "numberOfClicks": 12,
            "date": "2025-03-05T12:00:00"
        }
        """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/high-score")
                        .contentType("application/json")
                        .content(highScoreJson))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.content().string(""));

        List<HighScoreModel> allHighScores = highScoreRepository.findAll();
        Assertions.assertEquals(10, allHighScores.size());
    }

    @Test
    void deleteHighScore_shouldDeleteHighScore() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/high-score/1"))
                .andExpect(status().isNoContent());
        Assertions.assertEquals(1, highScoreRepository.count());
        Assertions.assertTrue(highScoreRepository.existsById("2"));
    }

}
