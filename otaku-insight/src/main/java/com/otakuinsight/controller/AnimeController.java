package com.otakuinsight.controller;

import com.otakuinsight.dto.AnimeDTO;
import com.otakuinsight.dto.EpisodeAnalysisDTO;
import com.otakuinsight.dto.MangaInfoDTO;
import com.otakuinsight.service.AnimeService;
import com.otakuinsight.service.MangaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "https://your-vercel-app.vercel.app")
@RestController
@RequestMapping("/api/anime")
public class AnimeController {

    @Autowired
    private AnimeService animeService;
    @Autowired
    private MangaService mangaService;


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
    @GetMapping("/{id}/manga-info")
    public ResponseEntity<MangaInfoDTO> getMangaInfo(
            @PathVariable Long id) {

        try {
            MangaInfoDTO mangaInfo = mangaService.getMangaInfo(id);
            return ResponseEntity.ok(mangaInfo);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}