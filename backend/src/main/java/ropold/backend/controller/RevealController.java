package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ropold.backend.Service.RevealService;
import ropold.backend.model.RevealModel;
import ropold.backend.model.RevealModelDto;

import java.util.List;

@RestController
@RequestMapping("/api/reveal-hub")
@RequiredArgsConstructor
public class RevealController {

    private final RevealService revealService;

    @GetMapping
    public List<RevealModel> getAllReveals() {
        return revealService.getAllReveals();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/test-add")
    public RevealModel addTestReveal(@RequestBody RevealModelDto revealModelDto) {
        return revealService.addTestReveal(
                new RevealModel(
                    null,
                        revealModelDto.name(),
                        revealModelDto.solutionWords(),
                        revealModelDto.closeSolutionWords(),
                        revealModelDto.category(),
                        revealModelDto.description(),
                        revealModelDto.isActive(),
                        revealModelDto.GithubId(),
                        revealModelDto.imageUrl()
                ));
    }


}
