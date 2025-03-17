package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.Service.CloudinaryService;
import ropold.backend.Service.IdService;
import ropold.backend.Service.RevealService;
import ropold.backend.model.Category;
import ropold.backend.model.RevealModel;
import ropold.backend.repository.RevealRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class RevealServiceTest {
    IdService idService = mock(IdService.class);
    RevealRepository revealRepository = mock(RevealRepository.class);
    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    RevealService revealService = new RevealService(idService, revealRepository, cloudinaryService);

    List<RevealModel> revealModels;

    @BeforeEach
    void setup() {
        RevealModel revealModel1 = new RevealModel(
                "1",
                "Bobby Brown",
                List.of("word1", "word2", "word3"),
                List.of("closeWord1", "closeWord2"),
                Category.ANIMAL,
                "Sample description for the RevealModel.",
                true,
                "user",
                "https://example.com/image1.jpg"
        );

        RevealModel revealModel2 = new RevealModel(
                "2",
                "Johnny Cash",
                List.of("Solution1", "Solution2"),
                List.of("Close Solution1", "Close Solution2"),
                Category.FOOD,
                "A brief description",
                true,
                "user",
                "https://example.com/image1.jpg"
        );

        revealModels = List.of(revealModel1, revealModel2);

        // Verhalten des Mocks definieren
        when(revealRepository.findAll()).thenReturn(revealModels);
    }

    @Test
    void testGetAllReveals() {
        List<RevealModel> result = revealService.getAllReveals();
        assertEquals(revealModels, result);
    }

    @Test
    void testAddTestReveal() {
        RevealModel revealModel3 = new RevealModel(
                "3",
                "Bobby Blue",
                List.of("word1", "word2", "word3"),
                List.of("closeWord1", "closeWord2"),
                Category.ANIMAL,
                "Sample description for the RevealModel.",
                true,
                "user",
                "https://example.com/image1.jpg"
        );

        when(idService.generateRandomId()).thenReturn("3");
        when(revealRepository.save(revealModel3)).thenReturn(revealModel3);

        RevealModel expected = revealService.addTestReveal(revealModel3);

        assertEquals(revealModel3, expected);
        verify(idService, times(1)).generateRandomId();
        verify(revealRepository, times(1)).save(revealModel3);
    }

}
