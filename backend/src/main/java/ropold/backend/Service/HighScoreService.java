package ropold.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.GameMode;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HighScoreService {

    private final HighScoreRepository highScoreRepository;
    private final IdService idService;

    public List<HighScoreModel> getBestHighScoresOverTime() {
        return highScoreRepository.findByGameModeOrderByScoreTimeAsc(GameMode.REVEAL_OVER_TIME);
    }

    public List<HighScoreModel> getBestHighScoresWithClicks() {
        return highScoreRepository.findByGameModeOrderByNumberOfClicksAsc(GameMode.REVEAL_WITH_CLICKS);
    }

    public HighScoreModel addHighScore(HighScoreModel highScoreModel) {

        // Erstelle ein neues HighScoreModel mit einer neuen ID
        HighScoreModel newHighScoreModel = new HighScoreModel(
                idService.generateRandomId(),
                highScoreModel.playerName(),
                highScoreModel.githubId(),
                highScoreModel.category(),
                highScoreModel.gameMode(),
                highScoreModel.scoreTime(),
                highScoreModel.numberOfClicks(),
                highScoreModel.date()
        );

        // Holen von bestehenden Scores nach GameMode und Sortierung
        List<HighScoreModel> existingScores = new ArrayList<>();

        // Prüfen, ob der GameMode "REVEAL_OVER_TIME" oder "REVEAL_WITH_CLICKS" ist und entsprechend die Liste abrufen
        if (newHighScoreModel.gameMode() == GameMode.REVEAL_OVER_TIME) {
            existingScores = highScoreRepository.findByGameModeOrderByScoreTimeAsc(GameMode.REVEAL_OVER_TIME);
        } else if (newHighScoreModel.gameMode() == GameMode.REVEAL_WITH_CLICKS) {
            existingScores = highScoreRepository.findByGameModeOrderByNumberOfClicksAsc(GameMode.REVEAL_WITH_CLICKS);
        }

        // Wenn es noch keine Scores gibt, speichern wir einfach den neuen Score
        if (existingScores.size() < 10) {
            // Wenn weniger als 10 Scores vorhanden sind, fügen wir den neuen Score einfach hinzu
            return highScoreRepository.save(newHighScoreModel);
        }

        // Prüfen, ob der neue Score besser als der schlechteste Score im Top 10 ist
        if (newHighScoreModel.gameMode() == GameMode.REVEAL_OVER_TIME && newHighScoreModel.scoreTime() > existingScores.get(9).scoreTime()) {
            return null;  // Falls der neue Score nicht besser ist, gib null zurück
        }

        if (newHighScoreModel.gameMode() == GameMode.REVEAL_WITH_CLICKS && newHighScoreModel.numberOfClicks() > existingScores.get(9).numberOfClicks()) {
            return null;  // Falls der neue Score nicht besser ist, gib null zurück
        }

        // Lösche den schlechtesten Score, wenn notwendig (nach Zeit oder Klicks)
        HighScoreModel worstScore = existingScores.get(9);
        highScoreRepository.deleteById(worstScore.id());

        // Speichern des neuen HighScores
        return highScoreRepository.save(newHighScoreModel);
    }



    public void deleteHighScore(String id) {
        highScoreRepository.deleteById(id);
    }
}
