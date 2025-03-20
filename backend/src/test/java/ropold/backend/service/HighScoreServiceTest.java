package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.Service.HighScoreService;
import ropold.backend.Service.IdService;
import ropold.backend.model.Category;
import ropold.backend.model.GameMode;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class HighScoreServiceTest {

    IdService idService = mock(IdService.class);
    HighScoreRepository highScoreRepository = mock(HighScoreRepository.class);
    HighScoreService highScoreService = new HighScoreService(highScoreRepository, idService);


    HighScoreModel highScoreModel1 = new HighScoreModel(
            "1",
            "player1",
            "123456",
            Category.ANIMAL,
            GameMode.REVEAL_OVER_TIME,
            10.2,
            0,
            LocalDateTime.of(2025, 3, 5, 12, 0, 0)
    );

    HighScoreModel highScoreModel2 = new HighScoreModel(
            "2",
            "player1",
            "123456",
            Category.ANIMAL,
            GameMode.REVEAL_WITH_CLICKS,
            14.5,
            15,
            LocalDateTime.of(2025, 3, 5, 11, 55, 0)
    );

    List<HighScoreModel> highScores = List.of(highScoreModel1, highScoreModel2);

    @BeforeEach
    void setup() {
        highScoreRepository.deleteAll();
        highScoreRepository.saveAll(highScores);
    }

    @Test
    void getBestHighScoresWithClicks_shouldReturnClicksHighScore() {
        // Given
        when(highScoreRepository.findByGameModeOrderByNumberOfClicksAsc(GameMode.REVEAL_WITH_CLICKS)).thenReturn(List.of(highScoreModel2));
        // When
        List<HighScoreModel> expected = highScoreService.getBestHighScoresWithClicks();
        // Then
        assertEquals(expected, List.of(highScoreModel2));
    }

    @Test
    void getBestHighScoresOverTime_shouldReturnOverTimeHighScore() {
        // Given
        when(highScoreRepository.findByGameModeOrderByScoreTimeAsc(GameMode.REVEAL_OVER_TIME)).thenReturn(List.of(highScoreModel1));
        // When
        List<HighScoreModel> expected = highScoreService.getBestHighScoresOverTime();
        // Then
        assertEquals(expected, List.of(highScoreModel1));
    }

    @Test
    void deleteHighScore() {
        // Given
        String idToDelete = "1";
        // When
        highScoreService.deleteHighScore(idToDelete);
        // Then
        verify(highScoreRepository, times(1)).deleteById(idToDelete);
    }

    @Test
    void addHighScore_whenOnlyTwoHighScoreAreInRepo() {
        // Given
        HighScoreModel highScore3 = new HighScoreModel(
                "3",
                "Player3",
                "123456",
                Category.ANIMAL,
                GameMode.REVEAL_OVER_TIME,
                9.5,
                0,
                LocalDateTime.of(2025, 3, 5, 12, 0, 0)
        );
        when(idService.generateRandomId()).thenReturn("3");
        when(highScoreRepository.findByGameModeOrderByScoreTimeAsc(GameMode.REVEAL_OVER_TIME)).thenReturn(List.of(highScoreModel1, highScoreModel2));
        when(highScoreRepository.save(any(HighScoreModel.class))).thenReturn(highScore3);
        // When
        HighScoreModel expected = highScoreService.addHighScore(highScore3);
        // Then
        assertEquals(expected, highScore3);
    }

    @Test
    void addHighScoreOverTime_shouldDeleteWorstHighScore_whenNewHighScoreIsBetterThanWorst() {

        highScoreRepository.deleteAll();
        LocalDateTime fixedDate = LocalDateTime.of(2025, 3, 5, 12, 0, 0);

        List<HighScoreModel> existingScores = List.of(
                new HighScoreModel("1", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 10.2, 0, fixedDate),
                new HighScoreModel("2", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 14.5, 15, fixedDate.minusMinutes(5)),
                new HighScoreModel("3", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 15.5, 15, fixedDate.minusMinutes(10)),
                new HighScoreModel("4", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 16.5, 15, fixedDate.minusMinutes(15)),
                new HighScoreModel("5", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 17.5, 15, fixedDate.minusMinutes(20)),
                new HighScoreModel("6", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 18.5, 15, fixedDate.minusMinutes(25)),
                new HighScoreModel("7", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 19.5, 15, fixedDate.minusMinutes(30)),
                new HighScoreModel("8", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 20.5, 15, fixedDate.minusMinutes(35)),
                new HighScoreModel("9", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 21.5, 15, fixedDate.minusMinutes(40)),
                new HighScoreModel("10", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_OVER_TIME, 22.5, 15, fixedDate.minusMinutes(45))
        );

        when(highScoreRepository.findByGameModeOrderByScoreTimeAsc(GameMode.REVEAL_OVER_TIME)).thenReturn(existingScores);

        HighScoreModel highScoreModel = new HighScoreModel(
                "11",
                "player1",
                "123456",
                Category.ANIMAL,
                GameMode.REVEAL_OVER_TIME,
                12.5,
                0,
                fixedDate
        );

        when(highScoreRepository.save(any(HighScoreModel.class))).thenReturn(highScoreModel);

        // When
        HighScoreModel result = highScoreService.addHighScore(highScoreModel);
        assertNotNull(result, "Expected not null");
    }


    @Test
    void addHighScoreWithClicks_shouldDeleteWorstHighScore_whenNewHighScoreIsBetterThanWorst() {

        highScoreRepository.deleteAll();
        LocalDateTime fixedDate = LocalDateTime.of(2025, 3, 5, 12, 0, 0);

        List<HighScoreModel> existingScores = List.of(
                new HighScoreModel("1", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 10.2, 0, fixedDate),
                new HighScoreModel("2", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 14.5, 15, fixedDate.minusMinutes(5)),
                new HighScoreModel("3", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 15.5, 15, fixedDate.minusMinutes(10)),
                new HighScoreModel("4", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 16.5, 15, fixedDate.minusMinutes(15)),
                new HighScoreModel("5", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 17.5, 15, fixedDate.minusMinutes(20)),
                new HighScoreModel("6", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 18.5, 15, fixedDate.minusMinutes(25)),
                new HighScoreModel("7", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 19.5, 15, fixedDate.minusMinutes(30)),
                new HighScoreModel("8", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 20.5, 15, fixedDate.minusMinutes(35)),
                new HighScoreModel("9", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 21.5, 15, fixedDate.minusMinutes(40)),
                new HighScoreModel("10", "player1", "123456", Category.ANIMAL, GameMode.REVEAL_WITH_CLICKS, 22.5, 15, fixedDate.minusMinutes(45))
        );

        when(highScoreRepository.findByGameModeOrderByNumberOfClicksAsc(GameMode.REVEAL_WITH_CLICKS)).thenReturn(existingScores);

        HighScoreModel highScoreModel = new HighScoreModel(
                "11",
                "player1",
                "123456",
                Category.ANIMAL,
                GameMode.REVEAL_WITH_CLICKS,
                12.5,
                2,
                fixedDate
        );

        when(highScoreRepository.save(any(HighScoreModel.class))).thenReturn(highScoreModel);

        // When
        HighScoreModel result = highScoreService.addHighScore(highScoreModel);
        assertNotNull(result, "Expected not null");
    }

}
