package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
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

    @GetMapping("/active")
    public List<RevealModel> getActiveReveals() {
        return revealService.getActiveReveals();
    }

    @GetMapping("/{id}")
    public RevealModel getRevealById(@PathVariable String id) {
        return revealService.getRevealById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReveal(@PathVariable String id, @AuthenticationPrincipal OAuth2User authentication) {
        revealService.deleteReveal(id);
    }

}
