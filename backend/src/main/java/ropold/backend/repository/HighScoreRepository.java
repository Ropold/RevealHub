package ropold.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import ropold.backend.model.GameMode;
import ropold.backend.model.HighScoreModel;

import java.util.List;

@Repository
public interface HighScoreRepository extends MongoRepository<HighScoreModel, String> {

    // Methode, um HighScores für REVEAL_OVER_TIME nach scoreTime (kleinste Zeit zuerst) zu sortieren
    List<HighScoreModel> findByGameModeOrderByScoreTimeAsc(GameMode gameMode);

    // Methode, um HighScores für REVEAL_WITH_CLICKS nach numberOfClicks (wenigste Klicks zuerst) zu sortieren
    List<HighScoreModel> findByGameModeOrderByNumberOfClicksAsc(GameMode gameMode);
}
