package ropold.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.Service.AppUserService;
import ropold.backend.Service.CloudinaryService;
import ropold.backend.Service.RevealService;
import ropold.backend.exception.AccessDeniedException;
import ropold.backend.exception.RevealNotFoundException;
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
    private final AppUserService appUserService;

    @GetMapping
    public List<RevealModel> getAllReveals() {
        return revealService.getAllReveals();
    }

    @GetMapping("/active/category/{category}")
    public List<RevealModel> getActiveRevealsByCategory(@PathVariable String category) {
        return revealService.getActiveRevealsByCategory(category);
    }

    @GetMapping("/active/categories")
    public List<String> getActiveRevealCategories() {
        return revealService.getActiveRevealCategories();
    }

    @GetMapping("/favorites")
    public List<RevealModel> getUserFavorites(@AuthenticationPrincipal OAuth2User authentication) {
        List<String> favoriteRevealIds = appUserService.getUserFavorites(authentication.getName());
        return revealService.getRevealsByIds(favoriteRevealIds);
    }

    @PostMapping("/favorites/{revealId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addRevealToFavorites(@PathVariable String revealId, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        appUserService.addRevealToFavorites(authenticatedUserId, revealId);
    }

    @DeleteMapping("/favorites/{revealId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeRevealFromFavorites(@PathVariable String revealId, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        appUserService.removeRevealFromFavorites(authenticatedUserId, revealId);
    }

    @PutMapping("/{id}/toggle-active")
    public RevealModel toggleRevealActive(@PathVariable String id, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        RevealModel reveal = revealService.getRevealById(id);
        if (!reveal.githubId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You are not allowed to toggle this reveal");
        }
        return revealService.toggleRevealActive(id);
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
                        revealModelDto.githubId(),
                        revealModelDto.imageUrl()
                ));
    }

    @GetMapping("/active")
    public List<RevealModel> getActiveReveals() {
        return revealService.getActiveReveals();
    }

    @GetMapping("/{id}")
    public RevealModel getRevealById(@PathVariable String id) {
        RevealModel reveal = revealService.getRevealById(id);
        if(reveal == null) {
            throw new RevealNotFoundException("No Reveal found with id: " + id);
        }
        return reveal;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public RevealModel addReveal(
            @RequestPart("revealModelDto") @Valid RevealModelDto revealModelDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();
        if (!authenticatedUserId.equals(revealModelDto.githubId())) {
            throw new AccessDeniedException("You are not allowed to add this reveal");
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
                        revealModelDto.githubId(),
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

        if(!authenticatedUserId.equals(existingReveal.githubId())){
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
                        revealModelDto.githubId(),
                        newImageUrl
                )
        );

    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReveal(@PathVariable String id, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();

        RevealModel reveal = revealService.getRevealById(id);
        if (!reveal.githubId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You are not allowed to delete this reveal");
        }
        revealService.deleteReveal(id);
    }

}
