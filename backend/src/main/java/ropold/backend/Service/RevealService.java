package ropold.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.exception.RevealNotFoundException;
import ropold.backend.model.RevealModel;
import ropold.backend.repository.RevealRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RevealService {

    private final IdService idService;
    private final RevealRepository revealRepository;
    private final CloudinaryService cloudinaryService;

    public List<RevealModel> getAllReveals() {
        return revealRepository.findAll();
    }


    public RevealModel addReveal(RevealModel revealModel) {
        RevealModel newRevealModel = new RevealModel(
                idService.generateRandomId(),
                revealModel.name(),
                revealModel.solutionWords(),
                revealModel.closeSolutionWords(),
                revealModel.category(),
                revealModel.description(),
                revealModel.isActive(),
                revealModel.githubId(),
                revealModel.imageUrl()
        );
        return revealRepository.save(newRevealModel);
    }

    public List<RevealModel> getActiveReveals() {
        return revealRepository.findAll().stream()
                .filter(RevealModel::isActive)
                .toList();
    }

    public RevealModel getRevealById(String id) {
        return revealRepository.findById(id).orElseThrow(() -> new RevealNotFoundException("No Reveal found with id: " + id));
    }


    public void deleteReveal(String id) {
        RevealModel revealModel = revealRepository.findById(id).orElseThrow(() -> new RevealNotFoundException("No Reveal found with id: " + id));

        if(revealModel.imageUrl() != null) {
            cloudinaryService.deleteImage(revealModel.imageUrl());
        }
        revealRepository.deleteById(id);
    }

    public List<RevealModel> getRevealsForGithubUser(String githubId) {
        return revealRepository.findAll().stream()
                .filter(revealModel -> revealModel.githubId().equals(githubId))
                .toList();
    }

    public RevealModel updateReveal(String id, RevealModel revealModel) {
        if(revealRepository.existsById(id)) {
            RevealModel updatedRevealModel = new RevealModel(
                    id,
                    revealModel.name(),
                    revealModel.solutionWords(),
                    revealModel.closeSolutionWords(),
                    revealModel.category(),
                    revealModel.description(),
                    revealModel.isActive(),
                    revealModel.githubId(),
                    revealModel.imageUrl()
            );
            return revealRepository.save(updatedRevealModel);
        }
        throw new RevealNotFoundException("No Reveal found with id: " + id);
    }

    public List<RevealModel> getRevealsByIds(List<String> favoriteRevealIds) {
        return revealRepository.findAllById(favoriteRevealIds);
    }

    public RevealModel toggleRevealActive(String id) {
        RevealModel reveal = revealRepository.findById(id)
                .orElseThrow(() -> new RevealNotFoundException("No Reveal found with id: " + id));

        RevealModel updatedReveal = new RevealModel(
                id,
                reveal.name(),
                reveal.solutionWords(),
                reveal.closeSolutionWords(),
                reveal.category(),
                reveal.description(),
                !reveal.isActive(),
                reveal.githubId(),
                reveal.imageUrl()
        );
        return revealRepository.save(updatedReveal);
    }


    public List<String> getActiveRevealCategories() {
        return revealRepository.findAll().stream()
                .filter(RevealModel::isActive) // Nur aktive Einträge filtern
                .map(reveal -> reveal.category().name()) // Enum-Namen extrahieren
                .distinct() // Doppelte Kategorien entfernen
                .toList();
    }

    public List<RevealModel> getActiveRevealsByCategory(String category) {
        return revealRepository.findAll().stream()
                .filter(reveal -> reveal.isActive() && reveal.category().name().equals(category))
                .toList();
    }
}
