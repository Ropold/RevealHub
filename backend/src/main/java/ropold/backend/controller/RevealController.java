package ropold.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.Service.CloudinaryService;
import ropold.backend.Service.RevealService;
import ropold.backend.exception.AccessDeniedException;
import ropold.backend.model.RevealModel;
import ropold.backend.model.RevealModelDto;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/reveal-hub")
@RequiredArgsConstructor
public class RevealController {

    private final RevealService revealService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public List<RevealModel> getAllReveals() {
        return revealService.getAllReveals();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/test-add")
    public RevealModel addTestReveal(@RequestBody RevealModelDto revealModelDto) {
        return revealService.addReveal(
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

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public RevealModel addReveal(
            @RequestPart RevealModelDto revealModelDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();
        if(!authenticatedUserId.equals(revealModelDto.GithubId())){
            throw new java.nio.file.AccessDeniedException("You are not allowed to add this reveal");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        return revealService.addReveal(
                new RevealModel(
                        null,
                        revealModelDto.name(),
                        revealModelDto.solutionWords(),
                        revealModelDto.closeSolutionWords(),
                        revealModelDto.category(),
                        revealModelDto.description(),
                        revealModelDto.isActive(),
                        revealModelDto.GithubId(),
                        imageUrl
                ));
    }

    @PutMapping("/{id}")
    public RevealModel updateReveal(
            @PathVariable String id,
            @RequestPart("revealModelDto") @Valid RevealModelDto revealModelDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();
        RevealModel existingReveal = revealService.getRevealById(id);

        if(!authenticatedUserId.equals(existingReveal.GithubId())){
            throw new AccessDeniedException("You are not allowed to update this reveal");
        }

        String newImageUrl;
        if (image != null && !image.isEmpty()) {
            newImageUrl = cloudinaryService.uploadImage(image);
        } else {
            newImageUrl = existingReveal.imageUrl();
        }

        return revealService.updateReveal(
                id,
                new RevealModel(
                        id,
                        revealModelDto.name(),
                        revealModelDto.solutionWords(),
                        revealModelDto.closeSolutionWords(),
                        revealModelDto.category(),
                        revealModelDto.description(),
                        revealModelDto.isActive(),
                        revealModelDto.GithubId(),
                        newImageUrl
                )
        );

    }




    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReveal(@PathVariable String id, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();

        RevealModel reveal = revealService.getRevealById(id);
        if (!reveal.GithubId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You are not allowed to delete this reveal");
        }
        revealService.deleteReveal(id);
    }

}
