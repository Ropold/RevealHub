package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import ropold.backend.model.Category;
import ropold.backend.model.RevealModel;
import ropold.backend.repository.RevealRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RevealControllerIntegrationTest {

    @MockBean
    private Cloudinary cloudinary;

    @Autowired
    MockMvc mockMvc;

    @Autowired
    RevealRepository revealRepository;

    @BeforeEach
    void setup() {
        revealRepository.deleteAll();

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
        revealRepository.saveAll(List.of(revealModel1, revealModel2));
    }

    @Test
    void getAllReveals_shouldReturnAllReveals() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/reveal-hub")
                )

                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                [
                    {
                        "id": "1",
                        "name": "Bobby Brown",
                        "solutionWords": ["word1", "word2", "word3"],
                        "closeSolutionWords": ["closeWord1", "closeWord2"],
                        "category": "ANIMAL",
                        "description": "Sample description for the RevealModel.",
                        "isActive": true,
                        "GithubId": "user",
                        "imageUrl": "https://example.com/image1.jpg"
                    },
                    {
                        "id": "2",
                        "name": "Johnny Cash",
                        "solutionWords": ["Solution1", "Solution2"],
                        "closeSolutionWords": ["Close Solution1", "Close Solution2"],
                        "category": "FOOD",
                        "description": "A brief description",
                        "isActive": true,
                        "GithubId": "user",
                        "imageUrl": "https://example.com/image1.jpg"
                    }
                ]
            """));
    }

    @Test
    void postTestReveal_shouldReturnCreatedReveal() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
        );
        revealRepository.deleteAll();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/reveal-hub/test-add")
                .contentType("application/json")
                .content("""

                        {
                        "name": "Test Reveal",
                        "solutionWords": ["Solution1", "Solution2"],
                        "closeSolutionWords": ["Close Solution1", "Close Solution2"],
                        "category": "FOOD",
                        "description": "A brief description",
                        "isActive": true,
                        "GithubId": "user",
                        "imageUrl": "https://example.com/image1.jpg"
                    }
                    """)
        ).andExpect(status().isCreated());

        List<RevealModel> allReveals = revealRepository.findAll();
        Assertions.assertEquals(1, allReveals.size());

        RevealModel revealModel = allReveals.getFirst();
        org.assertj.core.api.Assertions.assertThat(revealModel)
                .hasFieldOrPropertyWithValue("name", "Test Reveal")
                .hasFieldOrPropertyWithValue("solutionWords", List.of("Solution1", "Solution2"))
                .hasFieldOrPropertyWithValue("closeSolutionWords", List.of("Close Solution1", "Close Solution2"))
                .hasFieldOrPropertyWithValue("category", Category.FOOD)
                .hasFieldOrPropertyWithValue("description", "A brief description")
                .hasFieldOrPropertyWithValue("isActive", true)
                .hasFieldOrPropertyWithValue("GithubId", "user")
                .hasFieldOrPropertyWithValue("imageUrl", "https://example.com/image1.jpg");
    }

    @Test
    void getActiveReveals_shouldReturnActiveReveals() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/reveal-hub/active")
                )
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                [
                    {
                        "id": "1",
                        "name": "Bobby Brown",
                        "solutionWords": ["word1", "word2", "word3"],
                        "closeSolutionWords": ["closeWord1", "closeWord2"],
                        "category": "ANIMAL",
                        "description": "Sample description for the RevealModel.",
                        "isActive": true,
                        "GithubId": "user",
                        "imageUrl": "https://example.com/image1.jpg"
                    },
                    {
                        "id": "2",
                        "name": "Johnny Cash",
                        "solutionWords": ["Solution1", "Solution2"],
                        "closeSolutionWords": ["Close Solution1", "Close Solution2"],
                        "category": "FOOD",
                        "description": "A brief description",
                        "isActive": true,
                        "GithubId": "user",
                        "imageUrl": "https://example.com/image1.jpg"
                    }
                ]
            """));
    }

    @Test
    void getRevealById_shouldReturnReveal() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/reveal-hub/1")
                )
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                {
                    "id": "1",
                    "name": "Bobby Brown",
                    "solutionWords": ["word1", "word2", "word3"],
                    "closeSolutionWords": ["closeWord1", "closeWord2"],
                    "category": "ANIMAL",
                    "description": "Sample description for the RevealModel.",
                    "isActive": true,
                    "GithubId": "user",
                    "imageUrl": "https://example.com/image1.jpg"
                }
            """));
    }

    @Test
    void postReveal_shouldAddReveal() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
        );
        revealRepository.deleteAll();

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.test.de/"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/reveal-hub")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("revealModelDto", "", "application/json", """
                        {
                            "name": "Test Reveal",
                            "solutionWords": ["Solution1", "Solution2"],
                            "closeSolutionWords": ["Close Solution1", "Close Solution2"],
                            "category": "FOOD",
                            "description": "A brief description",
                            "isActive": true,
                            "GithubId": "user",
                            "imageUrl": "https://example.com/image1.jpg"
                        }
                        """.getBytes())))
                .andExpect(status().isCreated());

        List<RevealModel> allReveals = revealRepository.findAll();
        Assertions.assertEquals(1, allReveals.size());

        RevealModel savedReveal = allReveals.getFirst();
        org.assertj.core.api.Assertions.assertThat(savedReveal)
                .usingRecursiveComparison()
                .ignoringFields("id", "imageUrl")
                .isEqualTo(new RevealModel(
                        null,
                        "Test Reveal",
                        List.of("Solution1", "Solution2"),
                        List.of("Close Solution1", "Close Solution2"),
                        Category.FOOD,
                        "A brief description",
                        true,
                        "user",
                        "https://example.com/image1.jpg"
                ));
    }

    @Test
    void updateRevealWithPut_shouldUpdateRevealDetails() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/reveal-hub/1")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("revealModelDto", "", "application/json", """
                        {
                            "name": "Updated Reveal",
                            "solutionWords": ["Solution1", "Solution2"],
                            "closeSolutionWords": ["Close Solution1", "Close Solution2"],
                            "category": "FOOD",
                            "description": "A brief description",
                            "isActive": true,
                            "GithubId": "user",
                            "imageUrl": "https://example.com/updated-image.jpg"
                        }
                    """.getBytes()))
                        .contentType("multipart/form-data")
                .with(request -> { request.setMethod("PUT"); return request; }))
            .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Reveal"))
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/updated-image.jpg"));

        Assertions.assertEquals("Updated Reveal", revealRepository.findById("1").orElseThrow().name());
    }

    @Test
    void deleteReveal_shouldDeleteReveal() throws Exception {
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/reveal-hub/1"))
                .andExpect(status().isNoContent());

        Assertions.assertTrue(revealRepository.findById("1").isEmpty());
        verify(mockUploader).destroy(eq("image1"), anyMap());
    }

}
