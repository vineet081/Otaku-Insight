package com.otakuinsight.controller;

import com.otakuinsight.dto.AnimeDTO;
import com.otakuinsight.dto.EpisodeAnalysisDTO;
import com.otakuinsight.service.AnimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/anime")
public class AnimeController {

    @Autowired
    private AnimeService animeService;


    @GetMapping("/search")
    public ResponseEntity<AnimeDTO> searchAnime(
            @RequestParam String name) {

        try {
            AnimeDTO anime = animeService.searchAnime(name);
            return ResponseEntity.ok(anime);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }



    @GetMapping("/{id}/episodes/analysis")
    public ResponseEntity<EpisodeAnalysisDTO> getEpisodeAnalysis(
            @PathVariable Long id) {

        try {
            EpisodeAnalysisDTO analysis = animeService.analyzeEpisodes(id);
            return ResponseEntity.ok(analysis);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}