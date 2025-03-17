package ropold.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.RevealModel;
import ropold.backend.repository.RevealRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RevealService {

    private final IdService idService;
    private final RevealRepository revealRepository;

    public List<RevealModel> getAllReveals() {
        return revealRepository.findAll();
    }


    public RevealModel addTestReveal(RevealModel revealModel) {
        RevealModel newRevealModel = new RevealModel(
                idService.generateRandomId(),
                revealModel.name(),
                revealModel.solutionWords(),
                revealModel.closeSolutionWords(),
                revealModel.category(),
                revealModel.description(),
                revealModel.isActive(),
                revealModel.GithubId(),
                revealModel.imageUrl()
        );
        return revealRepository.save(newRevealModel);
    }
}
